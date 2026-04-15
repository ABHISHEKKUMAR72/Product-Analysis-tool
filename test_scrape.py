from Scraper import scrape_ajio, scrape_meesho, scrape_nykaa, scrape_tatacliq, scrape_flipkart, scrape_myntra

print("Testing Ajio:")
df_ajio = scrape_ajio("shoes", max_pages=1, headless=True)
print(df_ajio)

print("Testing Nykaa:")
df_nykaa = scrape_nykaa("shoes", max_pages=1, headless=True)
print(df_nykaa)

print("Testing TataCLiQ:")
df_tata = scrape_tatacliq("shoes", max_pages=1, headless=True)
print(df_tata)

print("Testing Meesho:")
df_meesho = scrape_meesho("shoes", max_pages=1, headless=True)
print(df_meesho)
