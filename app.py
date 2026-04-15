# app.py
from flask import Flask, render_template, request, redirect, url_for, send_file, jsonify
import pandas as pd
import sqlite3
import io, base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from flask_cors import CORS
import datetime

from Scraper import run_scrapers_and_update_db, DB_NAME, TABLE_NAME
import os
from flask import send_file
from components.recommendation_engine import add_better_alternatives, get_top_recommendations, add_similar_products
from components.value_scorer import calculate_value_score
from components.sentiment import add_sentiment_scores
from components.alerts import add_user_alert
from components.compare import get_comparison_data
from components.data_cleaner import remove_outliers
from flask import session, flash

app = Flask(__name__)
app.secret_key = "product_analysis_super_secret_key"
# Enable CORS so the Chrome Extension can call this API from any tab
CORS(app, resources={r"/api/*": {"origins": "*"}})


def load_data_from_db():
    conn = sqlite3.connect(DB_NAME)
    try:
        df = pd.read_sql(f"SELECT * FROM {TABLE_NAME}", conn)
        df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
        df["Rating"] = pd.to_numeric(df["Rating"], errors="coerce")
        df = df.dropna(subset=["Price"])
    except Exception:
        # empty DB or table does not exist
        df = pd.DataFrame(columns=["Source", "Title", "Price", "Rating", "Link"])
    conn.close()
    return df


def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return b64


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        query = request.form.get("query", "").strip()
        use_amazon = request.form.get("amazon")=="on"
        use_myntra = request.form.get("myntra")=="on"
        use_flipkart = request.form.get("flipkart")=="on"
        use_ajio = request.form.get("ajio")=="on"
        use_nykaa = request.form.get("nykaa")=="on"
        use_tatacliq = request.form.get("tatacliq")=="on"
        use_meesho = request.form.get("meesho")=="on"
        
        # optional number of pages (keep small)
        pages = int(request.form.get("pages", 1))
        # headless option toggle (helpful for debugging)
        headless = True if request.form.get("headless") == "on" else False

        if not query:
            return render_template("home.html", message="Please enter a product to search.", example="shoes")

        if not any([use_amazon, use_myntra, use_flipkart, use_ajio, use_nykaa, use_tatacliq, use_meesho]):
            return render_template("home.html", message="⚠ Please select at least one site.", example="shoes")

        # Refactored Component Caching Call
        from components.caching_service import get_cached_or_scrape
        get_cached_or_scrape(query, use_amazon, use_myntra, use_flipkart, use_ajio, use_nykaa, use_tatacliq, use_meesho, pages, headless)

        # Feature 6: Tracking Search History via session
        if "searches" not in session:
            session["searches"] = []
        if query not in session["searches"]:
            session["searches"].append(query)
            session.modified = True

        return redirect(url_for("products"))

    # GET request - render form
    return render_template("home.html", message=None, example="shoes")


@app.route("/products")
def products():
    conn = sqlite3.connect(DB_NAME)
    try:
        df = pd.read_sql(f"SELECT * FROM {TABLE_NAME}", conn)
    except Exception:
        conn.close()
        flash("No products found yet. Please perform a search first.")
        return redirect(url_for("home"))
    conn.close()

    if df.empty:
        flash("No products found. Please try a different search.")
        return redirect(url_for("home"))

    # Ensure numeric
    df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
    df = df.dropna(subset=["Price"])

    # Feature 8: Automated Outlier Removal Data Cleansing
    df = remove_outliers(df)

    # Recommender ML & Rules Integration
    df = calculate_value_score(df)
    top_recommendations = get_top_recommendations(df)
    df = add_better_alternatives(df)
    df = add_similar_products(df)
    df = add_sentiment_scores(df)

    # Re-sort by Value Score if available
    df = df.sort_values(by="ValueScore", ascending=False)

    cheapest = df.nsmallest(5, "Price").to_dict(orient="records")
    expensive = df.nlargest(5, "Price").to_dict(orient="records")

    return render_template("products.html",
                           tables=df.to_dict(orient="records"),
                           cheapest=cheapest,
                           expensive=expensive,
                           top_recs=top_recommendations)


@app.route("/download_csv")
def download_csv():
    conn = sqlite3.connect(DB_NAME)
    df = pd.read_sql(f"SELECT * FROM {TABLE_NAME}", conn)
    conn.close()

    # Ensure numeric for price
    df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
    df = df.dropna(subset=["Price"])

    # Save CSV in project directory (safe)
    file_path = os.path.join(os.getcwd(), "scraped_data.csv")
    df.to_csv(file_path, index=False, encoding="utf-8-sig")

    return send_file(file_path, as_attachment=True)


@app.route("/visuals")
def visuals():
    df = load_data_from_db()
    plots = {}

    if df.empty:
        return render_template("visuals.html", plots={}, message="No data available. Run a search first.")

    # Price distribution
    fig, ax = plt.subplots(figsize=(10,5))
    sns.histplot(data=df, x="Price", hue="Source", bins=30, kde=True, element="step", ax=ax)
    ax.set_title("Price Distribution")
    plots["price_dist"] = fig_to_base64(fig)

    # Boxplot
    fig, ax = plt.subplots(figsize=(8,5))
    sns.boxplot(x="Source", y="Price", data=df, ax=ax, palette={"Amazon":"#FF9900","Myntra":"#E91E63"})
    ax.set_title("Price Comparison (Amazon vs Myntra)")
    plots["boxplot"] = fig_to_base64(fig)

    # Avg price
    avg_price = df.groupby("Source")["Price"].mean()
    fig, ax = plt.subplots(figsize=(6,4))
    avg_price.plot(kind="bar", color=["#FF9900","#E91E63"], ax=ax)
    ax.set_title("Average Price")
    plots["avg_price"] = fig_to_base64(fig)

    # Amazon ratings
    try:
        amazon_only = df[df["Source"] == "Amazon"].dropna(subset=["Rating"])
        if not amazon_only.empty:
            fig, ax = plt.subplots(figsize=(6,4))
            sns.histplot(amazon_only, x="Rating", bins=10, kde=True, ax=ax, color="#FF9900")
            ax.set_title("Amazon Ratings")
            plots["amazon_ratings"] = fig_to_base64(fig)
    except Exception:
        pass

    return render_template("visuals.html", plots=plots, message=None)

@app.route("/history")
def history():
    link = request.args.get("link")
    if not link:
        return redirect(url_for("products"))
        
    conn = sqlite3.connect(DB_NAME)
    try:
        df = pd.read_sql("SELECT * FROM price_history WHERE Link = ?", conn, params=(link,))
    except Exception:
        df = pd.DataFrame()
        
    if df.empty:
        try:
            # Fallback to current snapshot in 'products' table if history missing
            df = pd.read_sql("SELECT Title, Source, Price, Link FROM products WHERE Link = ?", conn, params=(link,))
            import datetime
            df["Timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            pass
    conn.close()
    
    if df.empty:
        return render_template("history.html", plot=None, message="No historical data available for this product.", title="Unknown", link=link)
        
    # Generate plot
    df["Timestamp"] = pd.to_datetime(df["Timestamp"])
    df = df.sort_values(by="Timestamp")
    
    fig, ax = plt.subplots(figsize=(10,5))
    ax.plot(df["Timestamp"], df["Price"], marker='o', linestyle='-', color='b', linewidth=2)
    ax.set_title("Price History for Product")
    ax.set_xlabel("Date")
    ax.set_ylabel("Price (₹)")
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    plot_b64 = fig_to_base64(fig)
    product_title = df["Title"].iloc[0]
    
    return render_template("history.html", plot=plot_b64, message=None, title=product_title, link=link)

@app.route("/alert", methods=["POST"])
def alert():
    email = request.form.get("email")
    link = request.form.get("link")
    target_price = request.form.get("target_price")
    title = request.form.get("title")
    if email and link:
        add_user_alert(email, link, target_price, title)
        flash(f"Price alert set for {email}!", "success")
    return redirect(url_for("products"))

@app.route("/compare")
def compare():
    link = request.args.get("link")
    if not link:
        return redirect(url_for("products"))
        
    # Get the target item
    df_raw = load_data_from_db()
    if df_raw.empty:
        return redirect(url_for("products"))
        
    df_raw["Price"] = pd.to_numeric(df_raw["Price"], errors="coerce")
    df_raw["Rating"] = pd.to_numeric(df_raw["Rating"], errors="coerce")
    df_valid = df_raw.dropna(subset=["Price"])
    
    target_item = df_valid[df_valid["Link"] == link]
    if target_item.empty:
        return redirect(url_for("products"))
        
    target_row = target_item.iloc[0]
    
    # Get similar items (competitors)
    from components.recommendation_engine import get_similar_products_knn
    similar = get_similar_products_knn(df_valid, target_row, n_neighbors=2)
    
    compare_list = [target_row.to_dict()] + similar
    return render_template("compare.html", items=compare_list)

@app.route("/clear_history", methods=["POST"])
def clear_history():
    if "searches" in session:
        session["searches"] = []
        session.modified = True
    return redirect(url_for("home"))

@app.route("/api/history")
def api_history():
    title = request.args.get("title")
    if not title: return {"error": "Missing title"}, 400
    
    conn = sqlite3.connect(DB_NAME)
    try:
        df = pd.read_sql("SELECT Source, Price, Timestamp FROM price_history WHERE Title = ?", conn, params=(title,))
    except Exception as e:
        conn.close()
        return {"error": str(e)}, 500
    conn.close()

    if df.empty: return {"data": []}, 200
    
    return {"data": df.to_dict(orient="records")}, 200

# ---------------------------------------------------------------------------
# REST API — used by the Chrome Extension
# ---------------------------------------------------------------------------
_api_cache = {}  # simple in-process cache, TTL 10 min

@app.route("/api/search")
def api_search():
    """
    GET /api/search?q=iphone+13
    Called by the Chrome Extension popup to get live price comparisons.
    Returns JSON with results from all sites, sorted by price.
    """
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"error": "Missing query parameter ?q="}), 400

    # Check cache (10-minute TTL)
    now = datetime.datetime.utcnow()
    if query in _api_cache:
        cached_at, cached_data = _api_cache[query]
        if (now - cached_at).total_seconds() < 600:
            cached_data["from_cache"] = True
            return jsonify(cached_data)

    # Run the fast async scraper (with Selenium fallback)
    try:
        from fast_scraper import run_with_fallback
        results = run_with_fallback(
            query,
            use_amazon=True,
            use_flipkart=True,
            use_myntra=True,
            use_meesho=True,
            use_nykaa=True,
            use_tatacliq=True,
            use_ajio=True,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Build response
    priced = [r for r in results if r.get("price")]
    cheapest = priced[0] if priced else None
    response = {
        "query": query,
        "count": len(results),
        "results": results,
        "cheapest": cheapest,
        "timestamp": now.isoformat(),
        "from_cache": False,
    }

    _api_cache[query] = (now, response)
    return jsonify(response)


@app.route("/api/status")
def api_status():
    """Health check endpoint for the extension to verify the server is running."""
    return jsonify({"status": "ok", "version": "1.0"})


if __name__ == "__main__":
    app.run(debug=True)
