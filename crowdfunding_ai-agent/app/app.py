# In app/app.py

import os
import joblib
from flask import Flask, request, jsonify # No longer importing render_template
from flask_cors import CORS

# --- 1. Setup ---
app = Flask(__name__)
# This enables Cross-Origin Resource Sharing for your API
CORS(app) 

# --- 2. Load the Best Model ---
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'best_model.pkl')

if not os.path.exists(MODEL_PATH):
    print(f"Error: The model file 'best_model.pkl' was not found in the '{MODELS_DIR}' directory.")
    pipeline = None
else:
    pipeline = joblib.load(MODEL_PATH)
    print("✅ Best model pipeline loaded successfully.")

# --- 3. Define Routes ---
@app.route('/')
def home():
    # This route is useful for quickly checking if the server is up.
    return "AI Agent for Daan is active!"

@app.route('/predict', methods=['POST'])
def predict():
    if pipeline is None:
        return jsonify({'error': 'Model is not loaded'}), 500

    # Get data from the JSON request body
    req_data = request.get_json()
    if not req_data or 'description' not in req_data:
        return jsonify({'error': 'Description not found in request body.'}), 400

    description = req_data['description']
    if not description:
        return jsonify({'error': 'Please provide a campaign description.'}), 400

    # The pipeline handles the prediction
    prediction = pipeline.predict([description])
    
    # Return a clean JSON response instead of rendering a template
    if prediction[0] == 1:
        result = "Genuine"
    else:
        result = "Requires Review"

    return jsonify({'prediction': result})

# --- 4. Run the App ---
if __name__ == '__main__':
    app.run(debug=True)