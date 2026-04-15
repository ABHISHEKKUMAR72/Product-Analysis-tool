import pandas as pd
import random

def add_sentiment_scores(df):
    """
    Simulates NLP Sentiment Review mapping based on rating distribution.
    In a real-world scenario, this queries HuggingFace or locally chunks text reviews.
    """
    if df is None or df.empty:
        return df
    df = df.copy()
    sentiments = []
    
    for _, row in df.iterrows():
        try:
            rating = float(row.get('Rating', 0))
        except:
            rating = 0.0
            
        if rating >= 4.2:
            sentiments.append("Highly Positive 🟢")
        elif rating >= 3.8:
            sentiments.append("Positive 🟡")
        elif rating >= 3.0:
            sentiments.append("Mixed 🟠")
        elif rating > 0:
            sentiments.append("Negative 🔴")
        else:
            sentiments.append("Unknown ⚪")
            
    df['Sentiment'] = sentiments
    return df
