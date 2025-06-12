# In app/app.py

import os
import joblib
from flask import Flask, request, render_template, jsonify

# --- 1. Setup ---
app = Flask(__name__)

# --- 2. Load the Best Model ---
# This loads your "champion" model.
# After training, find the winner (e.g., 'svm_model.pkl') and rename a copy to 'best_model.pkl'
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'best_model.pkl')

# Check if the best_model.pkl exists
if not os.path.exists(MODEL_PATH):
    print(f"Error: The model file 'best_model.pkl' was not found in the '{MODELS_DIR}' directory.")
    print("Please run the training script and copy the best performing model to 'best_model.pkl'.")
    pipeline = None
else:
    pipeline = joblib.load(MODEL_PATH)
    print("✅ Best model pipeline loaded successfully.")

# --- 3. Define Routes ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if pipeline is None:
        return render_template('index.html', prediction_text='Error: Model is not loaded.')

    description = request.form.get('description')
    if not description:
        return render_template('index.html', prediction_text='Please enter a description.')

    # The pipeline handles everything: cleaning (if added), vectorizing, and predicting
    prediction = pipeline.predict([description])
    
    # Assuming 1 is 'Genuine' and 0 is 'Not Genuine'
    if prediction[0] == 1:
        result_text = "This campaign appears to be Genuine."
        # Here you would call your web enrichment function
        # enriched_info = get_web_enrichment(description)
        # result_text += f"\n\nAdditional Info: {enriched_info}"
    else:
        result_text = "This campaign requires further review."

    return render_template('index.html', prediction_text=result_text)


# --- 4. Run the App ---
if __name__ == '__main__':
    app.run(debug=True)