import time
from Scraper import run_scrapers_and_update_db

QUERY_CACHE = {}

def get_cached_or_scrape(query, use_amazon, use_myntra, use_flipkart, use_ajio, use_nykaa, use_tatacliq, use_meesho, max_pages, headless):
    """
    Handles robust 10-minute in-memory caching to prevent redundant webdriver scraping tasks.
    """
    global QUERY_CACHE
    
    cache_key = f"{query}_{use_amazon}_{use_myntra}_{use_flipkart}_{use_ajio}_{use_nykaa}_{use_tatacliq}_{use_meesho}_{max_pages}"
    current_time = time.time()
    
    if cache_key in QUERY_CACHE and (current_time - QUERY_CACHE[cache_key]) < 600:
        print(f"⚡ Bypassing scraper! Returning cached results for: {query}")
        return True
    else:
        QUERY_CACHE[cache_key] = current_time
        # Synchronous blocking call to update DB
        run_scrapers_and_update_db(query, use_amazon, use_myntra, use_flipkart, use_ajio, use_nykaa, use_tatacliq, use_meesho, max_pages=max_pages, headless=headless)
        return False
