import pandas as pd
from sqlalchemy import text
from database import engine

def setup_alerts_table():
    with engine.connect() as conn:
        conn.execute(text("CREATE TABLE IF NOT EXISTS alerts (email TEXT, link TEXT, target_price REAL, title TEXT)"))
        conn.commit()

def add_user_alert(email, link, target_price, title):
    """
    Registers a target price threshold for an eCommerce item.
    """
    setup_alerts_table()
    with engine.connect() as conn:
        conn.execute(
            text("INSERT INTO alerts (email, link, target_price, title) VALUES (:email, :link, :target_price, :title)"),
            {"email": email, "link": link, "target_price": float(target_price), "title": title}
        )
        conn.commit()
