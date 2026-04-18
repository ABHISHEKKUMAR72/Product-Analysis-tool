import pandas as pd
from sqlalchemy import text
from database import engine
from Scraper import TABLE_NAME

def get_comparison_data(df, query_str=None):
    """
    Fetches raw DB data for specific Head-to-Head product comparisons.
    If query_str is provided, it filters the DataFrame.
    """
    if df.empty: return []
    
    if query_str:
        # Filter by title relevance
        filtered_df = df[df['Title'].str.contains(query_str, case=False, na=False)]
        return filtered_df.to_dict(orient="records")
        
    return df.to_dict(orient="records")
