import sqlite3
import pandas as pd
from Scraper import DB_NAME, TABLE_NAME

def get_comparison_data(links):
    """
    Fetches raw DB data for specific Head-to-Head product comparisons.
    """
    if not links: return pd.DataFrame()
    conn = sqlite3.connect(DB_NAME)
    placeholders = ",".join("?" for _ in links)
    try:
        df = pd.read_sql(f"SELECT * FROM {TABLE_NAME} WHERE Link IN ({placeholders})", conn, params=links)
    except Exception:
        df = pd.DataFrame()
    conn.close()
    return df
