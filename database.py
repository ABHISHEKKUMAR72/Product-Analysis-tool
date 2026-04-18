import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables from .env file (optional)
# This will search for a .env file in the current directory
if os.path.exists(".env"):
    load_dotenv()
else:
    print("[Database] Warning: .env file not found. Using default SQLite configuration.")

# Get the database URL from environment, default to SQLite if missing
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("[Database] DATABASE_URL not found in environment. Falling back to SQLite.")
    DATABASE_URL = "sqlite:///products.db"

# Engine with built-in connection pooling configured securely
try:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,          # Allow up to 10 concurrent connections in pool
        max_overflow=20,       # Allow an extra 20 beyond pool size during peak spikes
        pool_timeout=30,       # Wait up to 30s before throwing timeout
        pool_recycle=1800,     # Recycle connections every 30 minutes to prevent staleness
    )
    print(f"[Database] Connected to: {DATABASE_URL}")
except Exception as e:
    print(f"[Database] Error creating engine: {e}")
    # Final fallback to a very simple sqlite engine
    DATABASE_URL = "sqlite:///products.db"
    engine = create_engine(DATABASE_URL)
    print(f"[Database] Final fallback to: {DATABASE_URL}")