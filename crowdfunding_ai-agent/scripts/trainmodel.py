# In scripts/tune_and_train_best_model.py

import pandas as pd
import re
import os
import joblib
import nltk
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report

# --- 1. Setup and Data Loading ---
print("⚙️ Setting up...")
try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')

print("📂 Loading and preprocessing data...")

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dataset.csv')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)

stop_words = set(stopwords.words('english'))
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', '', text)
    return ' '.join([word for word in text.split() if word not in stop_words])

df['description'] = df['description'].apply(clean_text)

X = df['description']
y = df['is_genuine']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
print("Data loading complete.")


# --- 2. Hyperparameter Tuning using GridSearchCV ---
print("\n🚀 Starting Hyperparameter Tuning for the Champion Model (SVM)...")

# Create the pipeline with our chosen model type
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LinearSVC(random_state=42, dual=True, max_iter=2000)),
])

# Define the "menu" of settings to try.
# We will tune the vectorizer's settings and the SVM's 'C' parameter.
parameters = {
    'tfidf__ngram_range': [(1, 1), (1, 2)],  # Try unigrams and bigrams
    'tfidf__max_df': [0.9, 0.95],             # Ignore words that are too frequent
    'clf__C': [0.5, 1, 1.5],                  # SVM's regularization parameter
}

# The GridSearchCV tool will automatically test all combinations.
# cv=5 means it uses 5-fold cross-validation for reliable scoring.
# n_jobs=-1 uses all available CPU cores to speed up the process.
grid_search = GridSearchCV(pipeline, parameters, cv=5, n_jobs=-1, verbose=2, scoring='f1_weighted')

grid_search.fit(X_train, y_train)

# --- 3. Save the Single Best Model ---
print("\n✅ Tuning complete.")
print(f"Best F1-Score found: {grid_search.best_score_:.4f}")
print("Best parameters found:")
print(grid_search.best_params_)

# The grid_search object itself contains the best, fully-trained model.
best_model = grid_search.best_estimator_

# Save this single, best model to be used by the app.
BEST_MODEL_PATH = os.path.join(MODELS_DIR, 'best_model.pkl')
joblib.dump(best_model, BEST_MODEL_PATH)
print(f"\n🏆 Single best model saved to: {BEST_MODEL_PATH}")


# --- 4. Final Evaluation on the Test Set ---
print("\n📊 Evaluating the final tuned model on the unseen test data...")
y_pred = best_model.predict(X_test)
print(classification_report(y_test, y_pred))