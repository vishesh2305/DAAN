import cv2
import mediapipe as mp
import numpy as np
from deepface import DeepFace
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import json
import uuid
from threading import Thread
import random
import logging
import re
import pytesseract

# --- IMPORTANT: TESSERACT INSTALLATION PATH (For Windows Users) ---
# If you are on Windows and Tesseract is not in your system's PATH,
# you may need to uncomment and update the following line:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


# --- 1. INITIALIZATIONS AND CONFIGURATION ---
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

CONFIG = {
    "SIMILARITY_THRESHOLD": 0.55, # Stricter threshold for better accuracy
    "NUM_LIVENESS_CHALLENGES": 2 # Number of random challenges to perform
}

# Folder setup
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MediaPipe setup for Liveness Detection
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, min_detection_confidence=0.6, min_tracking_confidence=0.6)

# Liveness Challenges Dictionary
LIVENESS_CHALLENGES = {
    "blink": "Please blink your eyes.",
    "turn_left": "Slowly turn your head to your left.",
    "turn_right": "Slowly turn your head to your right.",
    "nod_up": "Slowly tilt your head upwards.",
    "nod_down": "Slowly tilt your head downwards."
}

# Pre-load DeepFace model for Face Recognition
try:
    logging.info("DeepFace Facenet model pre-loading...")
    DeepFace.represent(np.zeros((160, 160, 3), dtype=np.uint8), model_name="Facenet", enforce_detection=False)
    logging.info("DeepFace Facenet model pre-loaded successfully.")
except Exception as e:
    logging.error(f"Error pre-loading DeepFace Facenet model: {e}.")


# --- 2. IMAGE, FACE, AND OCR PROCESSING UTILITIES ---

def preprocess_image_for_ocr(image_bytes):
    """Decodes image bytes into an OpenCV image object for OCR."""
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        logging.error(f"Error decoding image for OCR: {e}")
        return None

def preprocess_image_for_face(image):
    """Prepares an image for DeepFace embedding generation."""
    if image is None or image.size == 0: return None
    # DeepFace handles resizing, but we ensure it's in the correct color format and type
    if image.dtype != np.uint8:
        image = (image * 255).astype(np.uint8)
    return image


def generate_embedding(image):
    """Generates a face embedding from an image using DeepFace."""
    try:
        processed_image = preprocess_image_for_face(image)
        embedding_objs = DeepFace.represent(processed_image, model_name='Facenet', enforce_detection=True)
        if embedding_objs and len(embedding_objs) > 0:
            return embedding_objs[0]['embedding']
        logging.warning("No face detected by DeepFace for embedding generation.")
        return None
    except Exception as e:
        logging.warning(f"Could not generate face embedding: {e}")
        return None

def extract_text_with_ocr(image):
    """Enhances image and extracts text using Pytesseract."""
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        text = pytesseract.image_to_string(thresh, lang='eng')
        logging.info(f"--- OCR Raw Text ---\n{text}\n--------------------")
        return text
    except Exception as e:
        logging.error(f"Error during OCR extraction: {e}")
        return ""

def parse_aadhar_data(text):
    """Parses raw OCR text to find Name, DOB, and Address."""
    data = {"name": "Not Found", "dob": "Not Found", "address": "Not Found"}
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # DOB Extraction
    dob_match = re.search(r'(\d{4}-\d{2}-\d{2})|(\d{2}/\d{2}/\d{4})', text)
    if dob_match:
        dob_str = dob_match.group(0)
        if '-' in dob_str:
            parts = dob_str.split('-')
            data["dob"] = f"{parts[2]}/{parts[1]}/{parts[0]}"
        else:
            data["dob"] = dob_str
    
        # Name Extraction (usually the line above DOB)
        for i, line in enumerate(lines):
            if dob_str in line and i > 0:
                potential_name = lines[i-1]
                if not any(char.isdigit() for char in potential_name) and len(potential_name) > 2:
                    data["name"] = potential_name
                    break

    # Address Extraction
    address_match = re.search(r'Address\s*:([\s\S]*?)(\d{6})', text, re.IGNORECASE)
    if address_match:
        address_text = address_match.group(1).replace('\n', ' ').strip()
        pin_code = address_match.group(2)
        full_address = f"{address_text}, {pin_code}"
        data["address"] = ' '.join(full_address.split())

    logging.info(f"Parsed OCR Data: {data}")
    return data


# --- 3. LIVENESS CHECKING LOGIC ---

def check_blink(landmarks):
    """Returns True if a blink is detected based on vertical eye distance."""
    if not landmarks or len(landmarks) < 160: return False
    # Landmarks 159 (lower eyelid) and 145 (upper eyelid) for the left eye
    left_eye_dist = abs(landmarks[159][1] - landmarks[145][1])
    return left_eye_dist < 0.025

def check_head_turn(landmarks, direction):
    """Returns True if a head turn is detected based on nose-to-contour ratio."""
    if not landmarks or len(landmarks) < 468: return False
    nose = landmarks[1]; left_contour = landmarks[127]; right_contour = landmarks[356]
    dist_left = abs(nose[0] - left_contour[0]); dist_right = abs(right_contour[0] - nose[0])
    if dist_right == 0: return False # Avoid division by zero
    ratio = dist_left / dist_right
    logging.info(f"[Liveness] Turn Ratio: {ratio:.2f}")
    if direction == 'left': return ratio < 0.5
    elif direction == 'right': return ratio > 1.8
    return False

def check_nod(landmarks, direction):
    """Returns True if a nod is detected based on face height-to-width ratio."""
    if not landmarks or len(landmarks) < 468: return False
    forehead_top = landmarks[10]; chin = landmarks[152]; left_contour = landmarks[127]; right_contour = landmarks[356]
    dist_vertical = abs(chin[1] - forehead_top[1]); dist_horizontal = abs(right_contour[0] - left_contour[0])
    if dist_horizontal == 0: return False # Avoid division by zero
    ratio = dist_vertical / dist_horizontal
    logging.info(f"[Liveness] Nod Ratio: {ratio:.2f}")
    if direction == 'up': return ratio < 1.42
    elif direction == 'down': return ratio > 1.42 and ratio < 1.60
    return False

def perform_liveness_check(landmarks, challenge):
    """Dispatcher function to call the correct liveness check."""
    if challenge == "blink": return check_blink(landmarks)
    elif challenge == "turn_left": return check_head_turn(landmarks, 'left')
    elif challenge == "turn_right": return check_head_turn(landmarks, 'right')
    elif challenge == "nod_up": return check_nod(landmarks, 'up')
    elif challenge == "nod_down": return check_nod(landmarks, 'down')
    return False

# --- 4. FLASK API ROUTES ---

@app.route('/')
def index():
    """Serves the main HTML page (optional)."""
    return "Liveness + OCR + Face Reco Backend is running."

@app.route('/get-challenge-sequence', methods=['GET'])
def get_challenge_sequence():
    """Provides a random sequence of liveness challenges to the frontend."""
    all_challenges = list(LIVENESS_CHALLENGES.keys())
    challenge_sequence = random.sample(all_challenges, k=CONFIG["NUM_LIVENESS_CHALLENGES"])
    instructions_sequence = [LIVENESS_CHALLENGES[key] for key in challenge_sequence]
    logging.info(f"Generated new challenge sequence: {challenge_sequence}")
    return jsonify({"sequence": challenge_sequence, "instructions": instructions_sequence})

@app.route('/verify-liveness', methods=['POST'])
def verify_liveness():
    """Verifies a single liveness challenge step."""
    try:
        data = request.form
        if 'landmarks' not in data or 'challenge' not in data:
            return jsonify({"success": False, "message": "Missing landmarks or challenge."}), 400
        
        landmarks = json.loads(data['landmarks'])
        challenge = data['challenge']
        logging.info(f"--- Verifying Liveness Step: {challenge.replace('_', ' ').title()} ---")
        
        is_live = perform_liveness_check(landmarks, challenge)
        
        if is_live:
            return jsonify({"success": True, "message": "Step successful!"})
        else:
            return jsonify({"success": False, "message": "Action not detected. Please try again."})
    except Exception as e:
        logging.error(f"Error during liveness verification: {e}")
        return jsonify({"success": False, "message": "An error occurred during liveness check."}), 500

@app.route('/upload', methods=['POST'])
def upload():
    """
    Final endpoint for OCR and Face Matching after liveness is confirmed.
    """
    if 'document' not in request.files or 'live_face' not in request.files:
        return jsonify({"message": "Document and live face images are required."}), 400

    doc_file = request.files['document']
    live_file = request.files['live_face']

    # --- OCR Processing ---
    doc_img_bytes = doc_file.read()
    doc_img_for_ocr = preprocess_image_for_ocr(doc_img_bytes)
    if doc_img_for_ocr is None: return jsonify({"message": "Cannot process document image for OCR."}), 400
    
    extracted_text = extract_text_with_ocr(doc_img_for_ocr)
    ocr_data = parse_aadhar_data(extracted_text)

    # --- Face Matching ---
    # Use the same image bytes to create an image for face detection
    doc_img_for_face = cv2.imdecode(np.frombuffer(doc_img_bytes, np.uint8), cv2.IMREAD_COLOR)
    doc_embedding = generate_embedding(doc_img_for_face)
    if doc_embedding is None:
        return jsonify({"verification_status": "Not Verified", "message": "Could not find a face in the document."}), 400

    live_face_img = cv2.imdecode(np.frombuffer(live_file.read(), np.uint8), cv2.IMREAD_COLOR)
    live_embedding = generate_embedding(live_face_img)
    if live_embedding is None:
        return jsonify({"verification_status": "Not Verified", "message": "Could not detect a face from the camera."}), 400
    
    # Calculate Cosine Similarity
    similarity = np.dot(live_embedding, doc_embedding) / (np.linalg.norm(live_embedding) * np.linalg.norm(doc_embedding))
    
    if similarity > CONFIG["SIMILARITY_THRESHOLD"]:
        return jsonify({
            "verification_status": "Verified",
            "message": f"Identity Verified! (Similarity: {similarity:.2f})",
            "extracted_data": ocr_data
        })
    else:
        return jsonify({
            "verification_status": "Not Verified",
            "message": f"Face does not match document (Similarity: {similarity:.2f}).",
            "extracted_data": ocr_data # Return OCR data even if face doesn't match
        })

# --- 5. MAIN FUNCTION ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)