# web_enricher.py

# --- Step 1: All imports at the top ---
import spacy
import requests
from bs4 import BeautifulSoup
from googlesearch import search
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
import nltk

# --- Step 2: Ensure necessary NLTK data is available for the summarizer ---
# This is a small "setup" step to make sure `sumy` works correctly.
try:
    nltk.data.find('tokenizers/punkt')
except nltk.downloader.DownloadError:
    print("Downloading NLTK 'punkt' model for summarization...")
    nltk.download('punkt')


# --- Step 3: Your functions remain mostly the same, as they are correct ---

# Load the spaCy model once when the module is loaded
nlp = spacy.load("en_core_web_sm")

def find_clues(description):
    """This function takes a description and pulls out the important keywords."""
    doc = nlp(description)
    keywords = []
    for chunk in doc.noun_chunks:
        keywords.append(chunk.text)
    for ent in doc.ents:
        if ent.label_ in ["GPE", "ORG"]:
            keywords.append(ent.text)
    return " ".join(list(set(keywords)))

def perform_search(query):
    """This function takes a query and returns the top 5 Google search result links."""
    print(f"Searching Google for: '{query}'")
    try:
        links = []
        for link in search(query, tld="co.in", num=5, stop=5, pause=2, lang='en'):
            links.append(link)
        return links
    except Exception as e:
        print(f"An error occurred during Google search: {e}")
        return []

def read_webpage(url):
    """This function visits a URL and scrapes all its text."""
    print(f"\nReading content from: {url}")
    try:
        # Adding a user-agent header can help avoid being blocked by some websites
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        response = requests.get(url, timeout=10, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            text = soup.get_text(separator=' ', strip=True)
            return text
        else:
            return f"Could not retrieve the webpage. Status code: {response.status_code}"
    except Exception as e:
        return f"An error occurred while reading the webpage: {e}"

def summarize_text(full_text, num_sentences=3):
    """This function takes a long text and summarizes it."""
    # --- Improvement: Check if there's any text to summarize ---
    if not full_text or full_text.isspace():
        return "The webpage contained no text to summarize."
        
    print("\nSummarizing the text...")
    parser = PlaintextParser.from_string(full_text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary_sentences = summarizer(parser.document, num_sentences)
    summary = " ".join([str(sentence) for sentence in summary_sentences])
    return summary

def get_web_enrichment(description):
    """The main function that runs the whole detective process."""
    print("--- Starting Web Enrichment Process ---")
    query = find_clues(description)
    if not query:
        return "Could not find specific keywords to search."
        
    links = perform_search(query)
    if not links:
        return "No relevant web pages found for the keywords."
        
    text = read_webpage(links[0])
    # --- Improvement: Better checking of the scraped text before summarizing ---
    if text.startswith("Could not retrieve") or text.startswith("An error occurred") or text.startswith("The webpage contained no text"):
        return text # Return the error message directly
        
    summary = summarize_text(text)
    print("--- Web Enrichment Process Finished ---")
    return summary

# This block allows you to test this file directly if you want
# by running `python web_enricher.py` in your terminal
if __name__ == '__main__':
    # --- FINAL TEST ---
    campaign = "Help us raise funds for medical treatment for Rohan Gupta suffering from Leukemia at Apollo Hospital Delhi."
    final_result = get_web_enrichment(campaign)

    print("\n--------------------------------")
    print(f"ENRICHMENT FOR CAMPAIGN: {campaign}")
    print(f"GENERATED INFO: {final_result}")
    print("--------------------------------")