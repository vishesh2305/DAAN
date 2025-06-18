import cv2
import mediapipe as mp
import numpy as np
from deepface import DeepFace
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import re
from PIL import Image
import pytesseract

# --- IMPORTANT: TESSERACT INSTALLATION PATH (For Windows Users) ---
# If you are on Windows and Tesseract is not in your system's PATH,
# you may need to uncomment and update the following line:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# --- 1. INITIALIZATIONS AND CONFIGURATION ---
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

CONFIG = {
    "SIMILARITY_THRESHOLD": 0.50,
}

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- 2. IMAGE, FACE, AND OCR PROCESSING UTILITIES ---

def preprocess_image(image_bytes):
    """Decodes image bytes into an OpenCV image object."""
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        logging.error(f"Error preprocessing image: {e}")
        return None

def generate_embedding(image):
    """Generates a face embedding from an image using a fast model."""
    try:
        embedding_objs = DeepFace.represent(image, model_name='Facenet', enforce_detection=False)
        if embedding_objs and len(embedding_objs) > 0:
            return embedding_objs[0]['embedding']
        return None
    except Exception as e:
        logging.warning(f"Could not generate face embedding: {e}")
        return None

def extract_text_with_ocr(image):
    """Enhances image and extracts text using Pytesseract for better accuracy."""
    try:
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to get a binary image
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Use Tesseract to extract text
        text = pytesseract.image_to_string(thresh, lang='eng')
        logging.info(f"--- OCR Raw Text ---\n{text}\n--------------------")
        return text
    except Exception as e:
        logging.error(f"Error during OCR extraction: {e}")
        return ""

def parse_aadhar_data(text):
    """
    Parses raw OCR text with improved regex specifically for DigiLocker Aadhar card formats.
    """
    data = {"name": "Not Found", "dob": "Not Found", "address": "Not Found"}

    # --- DOB EXTRACTION (More Robust) ---
    # Looks for YYYY-MM-DD or DD/MM/YYYY formats anywhere in the text.
    dob_match = re.search(r'(\d{4}-\d{2}-\d{2})|(\d{2}/\d{2}/\d{4})', text)
    if dob_match:
        dob_str = dob_match.group(1) or dob_match.group(2)
        # Standardize the format to DD/MM/YYYY
        if '-' in dob_str:
            try:
                parts = dob_str.split('-')
                data["dob"] = f"{parts[2]}/{parts[1]}/{parts[0]}"
            except IndexError:
                data["dob"] = dob_str # Fallback if format is unexpected
        else:
            data["dob"] = dob_str

    # --- NAME EXTRACTION (Contextual) ---
    # The name on DigiLocker cards is typically the line directly above the DOB.
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if dob_match:
        for i, line in enumerate(lines):
            if dob_match.group(0) in line:
                if i > 0:
                    potential_name = lines[i-1]
                    # A name should not contain numbers and should be of a reasonable length.
                    if not any(char.isdigit() for char in potential_name) and len(potential_name) > 2:
                        data["name"] = potential_name
                        break # Found it, no need to continue

    # --- ADDRESS EXTRACTION (More Precise) ---
    # Captures multi-line text after "Address:" up to the PIN code
    address_match = re.search(r'Address\s*:([\s\S]*?)(\d{6})', text, re.IGNORECASE)
    if address_match:
        address_text = address_match.group(1).replace('\n', ' ').strip()
        pin_code = address_match.group(2)
        # Combine the address text with the PIN code
        full_address = f"{address_text}, {pin_code}"
        data["address"] = ' '.join(full_address.split()) # Normalize whitespace

    logging.info(f"Parsed OCR Data: {data}")
    return data


# --- 3. FLASK WEB ROUTE ---
@app.route('/upload', methods=['POST'])
def upload():
    if 'document' not in request.files or 'live_face' not in request.files:
        return jsonify({"message": "Document and live face images are required."}), 400

    doc_file = request.files['document']
    live_file = request.files['live_face']

    doc_img = preprocess_image(doc_file.read())
    if doc_img is None: return jsonify({"message": "Cannot process document image."}), 400
    
    extracted_text = extract_text_with_ocr(doc_img)
    ocr_data = parse_aadhar_data(extracted_text)
    
    doc_embedding = generate_embedding(doc_img)
    if doc_embedding is None:
        return jsonify({"verification_status": "Not Verified", "message": "Could not find a face in the document."}), 400

    live_face_img = preprocess_image(live_file.read())
    if live_face_img is None: return jsonify({"message": "Cannot process live face image."}), 400
    
    live_embedding = generate_embedding(live_face_img)
    if live_embedding is None:
        return jsonify({"verification_status": "Not Verified", "message": "Could not detect a face from the camera."}), 400
    
    similarity = np.dot(live_embedding, doc_embedding) / (np.linalg.norm(live_embedding) * np.linalg.norm(doc_embedding))
    
    if similarity > CONFIG["SIMILARITY_THRESHOLD"]:
        return jsonify({
            "verification_status": "Verified",
            "message": "Identity Verified!",
            "extracted_data": ocr_data
        })
    else:
        return jsonify({
            "verification_status": "Not Verified",
            "message": f"Face does not match document (Similarity: {similarity:.2f}).",
            "extracted_data": None
        })

# --- 4. MAIN FUNCTION ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    