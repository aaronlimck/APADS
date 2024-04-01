import spacy

nlp = spacy.load('en_core_web_sm')

def preprocess_text(sentences):
    processed_sentences = []
    for sentence in sentences:
        # Tokenize the sentence
        tokens = nlp(sentence.lower())
        
        # Remove stopwords
        tokens = [word for word in tokens if not word.is_stop]
        
        # Remove punctuation
        tokens = [word for word in tokens if not word.is_punct]
        
        # Lemmatize the words
        tokens = [word.lemma_ for word in tokens]
        
        processed_sentences.append(tokens)
    
    return processed_sentences