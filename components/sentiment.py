import pandas as pd
import re

def analyze_sentiment(text):
    """Simple but effective sentiment analysis"""
    if not text or text == "N/A":
        return "Neutral ⚪"
    
    text = str(text).lower()
    
    # Positive keywords
    positive_words = ['good', 'great', 'excellent', 'awesome', 'amazing', 'best', 'love', 'perfect', 'beautiful']
    # Negative keywords
    negative_words = ['bad', 'poor', 'worst', 'terrible', 'awful', 'useless', 'waste', 'defective', 'broken']
    
    pos_score = sum(1 for word in positive_words if word in text)
    neg_score = sum(1 for word in negative_words if word in text)
    
    # Also check rating numbers
    rating_match = re.search(r'(\d+(?:\.\d+)?)', text)
    if rating_match:
        rating = float(rating_match.group(1))
        if rating >= 4.0:
            return "Highly Positive 🟢"
        elif rating >= 3.0:
            return "Positive 🟡"
        elif rating >= 2.0:
            return "Mixed 🟠"
        elif rating > 0:
            return "Negative 🔴"
    
    if pos_score > neg_score:
        return "Positive 🟢"
    elif neg_score > pos_score:
        return "Negative 🔴"
    else:
        return "Neutral ⚪"

def add_sentiment_scores(df):
    """Add sentiment scores to dataframe"""
    if df is None or df.empty:
        return df
    
    df = df.copy()
    sentiments = []
    
    for _, row in df.iterrows():
        rating = row.get('Rating', 'N/A')
        title = row.get('Title', '')
        
        # Combine title and rating for analysis
        text = f"{title} {rating}"
        sentiment = analyze_sentiment(text)
        sentiments.append(sentiment)
    
    df['Sentiment'] = sentiments
    return df