from flask import Flask, jsonify, request
import joblib
import pandas as pd
from sklearn.cluster import MeanShift, KMeans
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
    if type(sentences) == str:
        scores = model.polarity_scores(sentences)

        # Calculate the percentage of positive, negative, neutral, and compound sentiments
        total = sum(abs(score) for score in scores.values())
        positive_percentage = (scores['compound'] + 1) / (total + 1) * 100  # Adding 1 to avoid division by zero
        negative_percentage = (abs(scores['compound'] - 1)) / (total + 1) * 100
        neutral_percentage = (1 - abs(scores['compound'])) / (total + 1) * 100
        compound_percentage = (scores['compound'] + 1) / 2 * 100

        # Classify sentiment based on compound score
        if scores['compound'] >= 0.05:
            sentiment= 'Positive'
        elif scores['compound'] <= -0.05:
            sentiment= 'Negative'
        else:
            sentiment = 'Neutral'
        sentiments.append({'sentiment':sentiment,'compound_percentage':compound_percentage})
    else:
        for sentence in sentences:
            scores = model.polarity_scores(sentence)

            # Calculate the percentage of positive, negative, neutral, and compound sentiments
            total = sum(abs(score) for score in scores.values())
            positive_percentage = (scores['compound'] + 1) / (total + 1) * 100  # Adding 1 to avoid division by zero
            negative_percentage = (abs(scores['compound'] - 1)) / (total + 1) * 100
            neutral_percentage = (1 - abs(scores['compound'])) / (total + 1) * 100
            compound_percentage = (scores['compound'] + 1) / 2 * 100

            # Classify sentiment based on compound score
            if scores['compound'] >= 0.05:
                sentiment= 'Positive'
            elif scores['compound'] <= -0.05:
                sentiment= 'Negative'
            else:
                sentiment = 'Neutral'
            sentiments.append({'sentiment':sentiment,'compound_percentage':compound_percentage})
    return sentiments

@app.route('/getClusters', methods=['POST'])
def getClusters():
    data = request.get_json()['formResponses']
    empIDs = request.get_json()['empIDs']
    df = pd.DataFrame(data)
    df['empIDs'] = empIDs
    df.set_index('empIDs',inplace=True)
    model = MeanShift().fit(df)
    df['cluster'] = model.labels_
    clusters = defaultdict(list)
    for index, row in df.iterrows():
        clusters[row['cluster']].append(index)

    SSE = []
    for k in range(1, 8):
        kmeans = KMeans(n_clusters=k, n_init=10).fit(df)
        SSE.append(kmeans.inertia_)
    print(model.cluster_centers_)


    return clusters

if __name__ == '__main__':
    app.run(debug=True, port=5000)
