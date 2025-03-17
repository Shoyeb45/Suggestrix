import wikipediaapi
import nltk
from collections import Counter
import re
import json
import logging

# Download NLTK stopwords
nltk.download("stopwords")
from nltk.corpus import stopwords

# Initialize Wikipedia API with user agent
wiki = wikipediaapi.Wikipedia(language="en", user_agent="SuggestrixBot/1.0 (https://example.com)")

# Set stopwords & regex for cleaning
stop_words = set(stopwords.words("english"))
word_pattern = re.compile(r"\b[a-zA-Z]{3,}\b")  # Words with at least 3 letters

# Dictionary to store word frequencies
word_freq = Counter()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def fetch_wikipedia_text(title):
    """Fetch article text from Wikipedia"""
    try:
        page = wiki.page(title)
        if page.exists():
            return page.text
        else:
            logging.warning(f"Page '{title}' does not exist.")
            return ""
    except Exception as e:
        logging.error(f"Error fetching page '{title}': {e}")
        return ""

def process_text(text):
    """Extract words, clean & update frequency"""
    words = word_pattern.findall(text.lower())
    for word in words:
        if word not in stop_words:
            word_freq[word] += 1

def fetch_random_articles(n=100):
    """Fetch n random Wikipedia articles"""
    titles = ["Machine learning", "Artificial intelligence", "Computer science",
              "Data science", "Programming language", "Quantum computing",
              "Cryptography", "Cybersecurity", "Mathematics", "Statistics"]
    
    for title in titles[:n]:
        logging.info(f"Fetching: {title}")
        text = fetch_wikipedia_text(title)
        if text:
            process_text(text)

# Fetch & process articles
fetch_random_articles(50)

# Save to file
try:
    with open("wikipedia_word_freq.json", "w") as f:
        json.dump(word_freq, f)
    logging.info("Word data saved!")
except Exception as e:
    logging.error(f"Error saving word data: {e}")
