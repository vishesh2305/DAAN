import pandas as pd
import re
import nltk
import joblib
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report

# Download stopwords
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Clean text function
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return ' '.join([word for word in text.split() if word not in stop_words])

# Load and preprocess dataset
df = pd.read_csv('dataset.csv')
df['description'] = df['description'].astype(str).apply(clean_text)

# Split dataset
X = df['description']
y = df['is_genuine']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Naive Bayes pipeline
nb_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB()),
])
nb_pipeline.fit(X_train, y_train)
joblib.dump(nb_pipeline, 'naive_bayes_model.pkl')

# Logistic Regression pipeline
lr_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression(random_state=42, solver='liblinear')),
])
lr_pipeline.fit(X_train, y_train)
joblib.dump(lr_pipeline, 'logistic_regression_model.pkl')

# Linear SVM pipeline

svm_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LinearSVC(random_state=42)),
])
svm_pipeline.fit(X_train, y_train)
joblib.dump(svm_pipeline, 'svm_model.pkl')

# Evaluate models
y_pred_nb = nb_pipeline.predict(X_test)
y_pred_lr = lr_pipeline.predict(X_test)
y_pred_svm = svm_pipeline.predict(X_test)

accuracy_nb = accuracy_score(y_test, y_pred_nb)
accuracy_lr = accuracy_score(y_test, y_pred_lr)
accuracy_svm = accuracy_score(y_test, y_pred_svm)

print("--- Evaluating Models ---")
print("\nMultinomial Naive Bayes Results:")
print(f"Accuracy: {accuracy_nb:.4f}")
print(classification_report(y_test, y_pred_nb))

print("\nLogistic Regression Results:")
print(f"Accuracy: {accuracy_lr:.4f}")
print(classification_report(y_test, y_pred_lr))

print("\nLinear SVM Results:")
print(f"Accuracy: {accuracy_svm:.4f}")
print(classification_report(y_test, y_pred_svm))

print("\n--- Conclusion ---")
if accuracy_nb >= accuracy_lr and accuracy_nb >= accuracy_svm:
    print("Multinomial Naive Bayes has the highest accuracy.")
elif accuracy_lr >= accuracy_nb and accuracy_lr >= accuracy_svm:
    print("Logistic Regression has the highest accuracy.")
else:
    print("Linear SVM has the highest accuracy.")

print("\n✅ Models saved as:")
print(" - naive_bayes_model.pkl")
print(" - logistic_regression_model.pkl")
print(" - svm_model.pkl")