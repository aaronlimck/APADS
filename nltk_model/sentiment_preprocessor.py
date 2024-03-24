import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def preprocess_text(sentences):
    processed_sentences = []
    for sentence in sentences:
        # Tokenize the sentence
        tokens = word_tokenize(sentence.lower())
        
        # Remove stopwords
        tokens = [word for word in tokens if word not in stopwords.words('english')]

        # Lemmatize the words
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
        # Add your additional preprocessing steps here
        processed_sentences.append(tokens)
    return processed_sentences