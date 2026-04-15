import sqlite3
import pandas as pd
from Scraper import DB_NAME

def setup_alerts_table():
    conn = sqlite3.connect(DB_NAME)
    conn.execute("CREATE TABLE IF NOT EXISTS alerts (email TEXT, link TEXT, target_price REAL, title TEXT)")
    conn.commit()
    conn.close()

def add_user_alert(email, link, target_price, title):
    """
    Registers a target price threshold for an eCommerce item.
    """
    setup_alerts_table()
    conn = sqlite3.connect(DB_NAME)
    conn.execute("INSERT INTO alerts (email, link, target_price, title) VALUES (?, ?, ?, ?)", 
                 (email, link, float(target_price), title))
    conn.commit()
    conn.close()
