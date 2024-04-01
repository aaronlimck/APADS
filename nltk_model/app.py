from flask import Flask, jsonify, request
import joblib
import pandas as pd
from sentiment_preprocessor import preprocess_text
from sklearn.cluster import MeanShift
from sklearn.ensemble import RandomForestClassifier
from collections import defaultdict

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
    model = joblib.load('./nltk_model.sav')
    sentiments = []
    positive_words = []
    negative_words = []
    neutral_words = []

    if type(sentences) == str:
        scores = model.polarity_scores(sentences)

        # Calculate the percentage of positive, negative, neutral, and compound sentiments
        total = sum(abs(score) for score in scores.values())
        compound_percentage = (scores['compound'] + 1) / 2 * 100

        # Classify sentiment based on compound score
        if scores['compound'] >= 0.05:
            sentiment= 'Positive'
            positive_words.extend(sentences.split())
        elif scores['compound'] <= -0.05:
            sentiment= 'Negative'
            negative_words.extend(sentences.split())
        else:
            sentiment = 'Neutral'
            neutral_words.extend(sentences.split())
            
        sentiments.append({'sentiment':sentiment,'compound_percentage':compound_percentage})
    else:
        processed_sentences = preprocess_text(sentences)
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

    # else:
    #     for sentence in sentences:
    #         scores = model.polarity_scores(sentence)

    #         # Calculate the percentage of positive, negative, neutral, and compound sentiments
    #         total = sum(abs(score) for score in scores.values())
    #         positive_percentage = (scores['compound'] + 1) / (total + 1) * 100  # Adding 1 to avoid division by zero
    #         negative_percentage = (abs(scores['compound'] - 1)) / (total + 1) * 100
    #         neutral_percentage = (1 - abs(scores['compound'])) / (total + 1) * 100
    #         compound_percentage = (scores['compound'] + 1) / 2 * 100

    #         # Classify sentiment based on compound score
    #         if scores['compound'] >= 0.05:
    #             sentiment= 'Positive'
    #         elif scores['compound'] <= -0.05:
    #             sentiment= 'Negative'
    #         else:
    #             sentiment = 'Neutral'
    #         sentiments.append({'sentiment':sentiment,'compound_percentage':compound_percentage})
    # return sentiments

@app.route('/getClusters', methods=['POST'])
def getClusters():
    data = request.get_json()['formResponses']
    empIDs = request.get_json()['empIDs']
    df = pd.DataFrame(data)
    df['empIDs'] = empIDs
    df.set_index('empIDs',inplace=True)
    ms = MeanShift().fit(df)
    df['cluster'] = ms.labels_
    clusters = defaultdict(list)
    for index, row in df.iterrows():
        clusters[row['cluster']].append(index)

    # Train a Random Forest model on the cluster labels
    rf = RandomForestClassifier()
    rf.fit(df.drop('cluster', axis=1), df['cluster'])

    # Get feature importance
    importances = rf.feature_importances_

    mostImportantFeature = ''
    mostImportantFeatureValue = 0
    featureImportance = {}
    # Get Feature importance
    for feature, importance in zip(df.drop('cluster', axis=1).columns, importances):
        featureImportance[feature] = importance
        if importance > mostImportantFeatureValue:
            mostImportantFeatureValue = importance
            mostImportantFeature = feature
    

    data = {'clusters': clusters, 'featureImportance': featureImportance, 'clusterCenters': ms.cluster_centers_.tolist()}

    return data

if __name__ == '__main__':
    app.run(debug=True, port=5000)
