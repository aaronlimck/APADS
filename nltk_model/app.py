from flask import Flask, jsonify, request
import joblib
import pandas as pd
from sentiment_preprocessor import preprocess_text

app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict():
    df = pd.read_csv('X_test.csv')
    model = joblib.load('./testDT_model.sav')
    predictionList = (list(model.predict(df)))
    return predictionList

@app.route('/getSentiment', methods=['POST'])
def getSentiment():
    sentences = request.get_json()['data']
    processed_sentences = preprocess_text(sentences)
    model = joblib.load('./nltk_model.sav')
    sentiments = []
    positive_words = []
    negative_words = []
    neutral_words = []

    for sentence in processed_sentences:
        sentence = ' '.join(sentence)  # Join the words back into a string
        scores = model.polarity_scores(sentence)

        # Calculate the percentage of positive, negative, neutral, and compound sentiments
        total = sum(abs(score) for score in scores.values())
        compound_percentage = (scores['compound'] + 1) / 2 * 100

        # Classify sentiment based on compound score
        if scores['compound'] >= 0.05:
            sentiment= 'Positive'
            positive_words.extend(sentence.split())
        elif scores['compound'] <= -0.05:
            sentiment= 'Negative'
            negative_words.extend(sentence.split())
        else:
            sentiment = 'Neutral'
            neutral_words.extend(sentence.split())
            
        sentiments.append({'sentiment':sentiment,'compound_percentage':compound_percentage})

    positive_sentences = ' '.join(positive_words)
    negative_sentences = ' '.join(negative_words)
    neutral_sentences = ' '.join(neutral_words)

    return {"sentiments": sentiments, 'positive_sentences':positive_sentences, 'negative_sentences':negative_sentences, 'neutral_sentences':neutral_sentences}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
