import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

from nltk.tokenize import word_tokenize

def preprocess_text(sentences):
    processed_sentences = []
    for sentence in sentences:
        tokens = word_tokenize(sentence.lower())
        # Add your additional preprocessing steps here
        processed_sentences.append(tokens)
    return processed_sentences