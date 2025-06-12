# testmodel.py

import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from sklearn.metrics import accuracy_score, classification_report

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return ' '.join([word for word in text.split() if word not in stop_words])

df = pd.read_csv('test_dataset.csv')
df['description'] = df['description'].astype(str).apply(clean_text)
X_test = df['description']
y_test = df['is_genuine']

from joblib import load
# Or re-import pipelines directly if they're still in memory
from trainmodel import nb_pipeline, lr_pipeline, svm_pipeline

print("--- External Test Evaluation ---")

for name, model in [("Multinomial Naive Bayes", nb_pipeline), 
                    ("Logistic Regression", lr_pipeline), 
                    ("Linear SVM", svm_pipeline)]:
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    print(f"\n{name} Results:")
    print(f"Accuracy: {accuracy:.4f}")
    print(report)
