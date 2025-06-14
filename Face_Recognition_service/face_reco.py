import cv2
import mediapipe as mp
import numpy as np
from deepface import DeepFace
from flask import Flask, request, jsonify, render_template
import os
import json
import uuid
from threading import Thread
import random
import logging

# --- 1. INITIALIZATIONS AND CONFIGURATION ---

# Basic Flask and Logging Setup
app = Flask(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Centralized Configuration Dictionary
CONFIG = {
    "SIMILARITY_THRESHOLD": 0.60,
    "BLUR_THRESHOLD": 50.0,
    "BRIGHTNESS_LOW_THRESHOLD": 70,
    "BRIGHTNESS_HIGH_THRESHOLD": 180,
    "NOD_UP_ANGLE": 100,
    "NOD_DOWN_ANGLE": 85,
    "HEAD_TURN_LEFT_RATIO": 0.5,
    "HEAD_TURN_RIGHT_RATIO": 1.8,
    "BLINK_THRESHOLD": 0.025,
    "NUM_LIVENESS_CHALLENGES": 3
}

# MediaPipe Initialization
mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh
face_detector = mp_face_detection.FaceDetection(min_detection_confidence=0.6)
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, min_detection_confidence=0.6, min_tracking_confidence=0.6)

# Folder Setup
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Liveness Challenges Dictionary
LIVENESS_CHALLENGES = {
    "blink": "Please blink your eyes.",
    "turn_left": "Slowly turn your head to your left.",
    "turn_right": "Slowly turn your head to your right.",
    "nod_up": "Slowly tilt your head upwards.",
    "nod_down": "Slowly tilt your head downwards."
}

# Pre-load DeepFace model
try:
    logging.info("DeepFace Facenet model pre-loading...")
    DeepFace.represent(np.zeros((160, 160, 3), dtype=np.uint8), model_name="Facenet", enforce_detection=False)
    logging.info("DeepFace Facenet model pre-loaded successfully.")
except Exception as e:
    logging.error(f"Error pre-loading DeepFace Facenet model: {e}", exc_info=True)

# --- 2. HELPER FUNCTIONS ---

def preprocess_image(image):
    if image is None or image.size == 0: return None
    image = cv2.resize(image, (160, 160), interpolation=cv2.INTER_AREA)
    if image.dtype != np.uint8: image = (image * 255).astype(np.uint8)
    return image

def extract_face_from_document(image_path):
    img = cv2.imread(image_path)
    if img is None: return None
    results = face_detector.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    if results.detections:
        detection = results.detections[0]
        bbox = detection.location_data.relative_bounding_box
        h, w, _ = img.shape
        x, y, width, height = int(bbox.xmin * w), int(bbox.ymin * h), int(bbox.width * w), int(bbox.height * h)
        padding = int(max(width, height) * 0.2)
        x, y = max(0, x - padding), max(0, y - padding)
        width, height = min(w - x, width + 2 * padding), min(h - y, height + 2 * padding)
        face_img = img[y:y+height, x:x+width]
        if face_img.size > 0: return preprocess_image(face_img)
    return None

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return np.degrees(angle)

def generate_embedding(frame):
    if frame is None or frame.size == 0: return None
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"temp_face_{uuid.uuid4()}.jpg")
    cv2.imwrite(temp_path, frame)
    try:
        return DeepFace.represent(temp_path, model_name="Facenet", enforce_detection=True)[0]["embedding"]
    except Exception as e:
        logging.error(f"Generate Embedding Error: {e}", exc_info=True)
        return None
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)

# --- 3. LIVENESS & QUALITY CHECKS ---

def check_blink(landmarks):
    if not landmarks or len(landmarks) < 160: return False
    return abs(landmarks[159][1] - landmarks[145][1]) < CONFIG["BLINK_THRESHOLD"]

def check_head_turn_new(landmarks, direction):
    if not landmarks or len(landmarks) < 468: return False
    nose = landmarks[1]
    left_contour = landmarks[127]
    right_contour = landmarks[356]
    dist_left = abs(nose[0] - left_contour[0])
    dist_right = abs(right_contour[0] - nose[0])
    if dist_right == 0: return False
    ratio = dist_left / dist_right
    logging.info(f"Turn Ratio: {ratio:.2f}")
    if direction == 'left': return ratio < CONFIG["HEAD_TURN_LEFT_RATIO"]
    elif direction == 'right': return ratio > CONFIG["HEAD_TURN_RIGHT_RATIO"]
    return False

def check_nod_new(landmarks, direction):
    if not landmarks or len(landmarks) < 468: return False
    forehead, nose_tip, chin = landmarks[10], landmarks[1], landmarks[152]
    angle = calculate_angle(forehead, nose_tip, chin)
    logging.info(f"Nod Angle: {angle:.2f}°")
    if direction == 'up': return angle > CONFIG["NOD_UP_ANGLE"]
    elif direction == 'down': return angle < CONFIG["NOD_DOWN_ANGLE"]
    return False

def perform_liveness_check(landmarks, challenge):
    if challenge == "blink": return check_blink(landmarks)
    elif challenge == "turn_left": return check_head_turn_new(landmarks, 'left')
    elif challenge == "turn_right": return check_head_turn_new(landmarks, 'right')
    elif challenge == "nod_up": return check_nod_new(landmarks, 'up')
    elif challenge == "nod_down": return check_nod_new(landmarks, 'down')
    return False

def check_image_quality(face_image):
    gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    if laplacian_var < CONFIG["BLUR_THRESHOLD"]:
        message = f"Document image may be too blurry (Laplacian Var: {laplacian_var:.2f})."
        logging.warning(f"[QUALITY CHECK] {message}")
        return False, message
    brightness = np.mean(gray)
    if brightness < CONFIG["BRIGHTNESS_LOW_THRESHOLD"]:
        message = f"Document image may be too dark (Brightness: {brightness:.2f})."
        logging.warning(f"[QUALITY CHECK] {message}")
        return False, message
    if brightness > CONFIG["BRIGHTNESS_HIGH_THRESHOLD"]:
        message = f"Document image may be too bright (Brightness: {brightness:.2f})."
        logging.warning(f"[QUALITY CHECK] {message}")
        return False, message
    logging.info("[QUALITY CHECK] Document image quality is acceptable.")
    return True, "Quality OK"

# --- 4. FLASK ROUTES ---

@app.route('/')
def index():
    return render_template('index.html', message="")

@app.route('/get-challenge-sequence', methods=['GET'])
def get_challenge_sequence():
    num_of_challenges = CONFIG["NUM_LIVENESS_CHALLENGES"]
    all_challenges = list(LIVENESS_CHALLENGES.keys())
    challenge_sequence = random.sample(all_challenges, k=num_of_challenges)
    instructions_sequence = [LIVENESS_CHALLENGES[key] for key in challenge_sequence]
    logging.info(f"Generated new challenge sequence: {challenge_sequence}")
    return jsonify({"sequence": challenge_sequence, "instructions": instructions_sequence})

@app.route('/verify-liveness', methods=['POST'])
def verify_liveness():
    try:
        data = request.form
        if 'landmarks' not in data or 'challenge' not in data:
            return jsonify({"success": False, "message": "Missing landmarks or challenge."}), 400
        landmarks = json.loads(data['landmarks'])
        challenge = data['challenge']
        logging.info(f"--- Verifying Step: {challenge.replace('_', ' ').title()} ---")
        is_live = perform_liveness_check(landmarks, challenge)
        if is_live:
            return jsonify({"success": True, "message": "Step successful!"})
        else:
            return jsonify({"success": False, "message": "Action not detected correctly. Please try again."})
    except Exception as e:
        logging.error(f"Error during liveness verification: {e}", exc_info=True)
        return jsonify({"success": False, "message": "An error occurred."}), 500

@app.route('/upload', methods=['POST'])
def upload_data():
    doc_path = None
    live_path = None
    try:
        if 'document' not in request.files or 'image' not in request.files:
            return jsonify({"message": "Missing document or live image."}), 400
        
        doc_file = request.files['document']
        doc_path = os.path.join(app.config['UPLOAD_FOLDER'], f"doc_face_{uuid.uuid4()}.jpg")
        doc_file.save(doc_path)
        
        doc_face = extract_face_from_document(doc_path)
        if doc_face is None:
            return jsonify({"message": "No face detected in document."})

        is_quality_ok, quality_message = check_image_quality(doc_face)
        if not is_quality_ok:
            return jsonify({"message": f"Document Quality Issue: {quality_message}"})

        doc_embedding = generate_embedding(doc_face)
        if doc_embedding is None:
            return jsonify({"message": "Failed to create embedding for document face."})
        
        live_file = request.files['image']
        live_path = os.path.join(app.config['UPLOAD_FOLDER'], f"live_face_{uuid.uuid4()}.jpg")
        live_file.save(live_path)
        
        live_face_img = cv2.imread(live_path)
        live_face_processed = preprocess_image(live_face_img)
        if live_face_processed is None:
            return jsonify({"message": "Failed to process live face image."})
        
        live_embedding = generate_embedding(live_face_processed)
        if live_embedding is None:
            return jsonify({"message": "Failed to create embedding for live face."})
        
        similarity = np.dot(live_embedding, doc_embedding) / (np.linalg.norm(live_embedding) * np.linalg.norm(doc_embedding))
        logging.info(f"Final Similarity Score: {similarity:.4f}")
        
        if similarity > CONFIG["SIMILARITY_THRESHOLD"]:
            return jsonify({"message": f"Verified! Faces match (Similarity: {similarity:.2f})."})
        else:
            return jsonify({"message": f"Not Verified. Faces do not match (Similarity: {similarity:.2f})."})
            
    except Exception as e:
        logging.error(f"An unexpected error occurred in upload route: {e}", exc_info=True)
        return jsonify({"message": f"An internal server error occurred: {str(e)}."}), 500
    finally:
        if doc_path and os.path.exists(doc_path):
            os.remove(doc_path)
        if live_path and os.path.exists(live_path):
            os.remove(live_path)

# --- 5. MAIN FUNCTION ---

def main():
    server = Thread(target=lambda: app.run(debug=False, host='0.0.0.0', port=5000))
    server.start()
    logging.info("Flask server started. Open http://localhost:5000 in your browser.")

if __name__ == "__main__":
    main()