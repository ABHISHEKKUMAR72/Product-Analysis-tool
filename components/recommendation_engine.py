import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors

def get_similar_products_knn(df, target_row, n_neighbors=3):
    """
    Uses KNN to find similar products based on Price and Rating.
    """
    # Create feature matrix
    features_df = df[['Price', 'Rating']].copy()
    
    # Ensure KNN operates on valid numbers (replace NaNs with 0)
    features_df['Price'] = pd.to_numeric(features_df['Price'], errors='coerce').fillna(0)
    features_df['Rating'] = pd.to_numeric(features_df['Rating'], errors='coerce').fillna(0)
    
    max_price = features_df['Price'].max() if features_df['Price'].max() > 0 else 1
    features_df['Price_Scaled'] = features_df['Price'] / max_price
    features_df['Rating_Scaled'] = features_df['Rating'] / 5.0
    
    X = features_df[['Price_Scaled', 'Rating_Scaled']].values
    
    target_price_scaled = target_row['Price'] / max_price if max_price > 0 else 0
    target_rating_scaled = target_row['Rating'] / 5.0
    target_x = [[target_price_scaled, target_rating_scaled]]
    
    n = min(n_neighbors + 1, len(X))
    if n < 2:
        return []
        
    model = NearestNeighbors(n_neighbors=n)
    model.fit(X)
    
    distances, indices = model.kneighbors(target_x)
    
    similar_products = []
    for idx in indices[0]:
        sim_row = df.iloc[idx]
        if sim_row['Title'] != target_row['Title']:
            similar_products.append(sim_row.to_dict())
            
    return similar_products[:n_neighbors]


def add_better_alternatives(df):
    """
    Applies the rule-based "Better Alternative" logic to every product in the DataFrame.
    Returns the dataframe with a 'BetterAlternative' column containing dictionaries.
    """
    if df is None or df.empty:
        return df
        
    df = df.copy()
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
    df['NumericRating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0.0)
    
    alternatives = []
    valid_df = df.dropna(subset=['Price'])
    
    for _, row in df.iterrows():
        if pd.isna(row['Price']):
            alternatives.append(None)
            continue
            
        target_price = row['Price']
        target_rating = row['NumericRating']
        
        better_mask = (
            (valid_df['Price'] < target_price - 50) & 
            (valid_df['NumericRating'] >= target_rating) &
            (valid_df['Title'] != row['Title'])
        )
        better_options = valid_df[better_mask]
        
        if not better_options.empty:
            best_alt = better_options.sort_values(by=['Price', 'NumericRating'], ascending=[True, False]).iloc[0]
            savings = target_price - best_alt['Price']
            
            alternatives.append({
                "title": best_alt['Title'],
                "price": best_alt['Price'],
                "rating": best_alt['Rating'],
                "source": best_alt['Source'],
                "link": best_alt['Link'],
                "savings": int(savings)
            })
        else:
            alternatives.append(None)
            
    df['BetterAlternative'] = alternatives
    df = df.drop(columns=['NumericRating'])
    return df

def get_top_recommendations(df):
    """
    Generate 3 "Top Smart Recommendations" for the dashboard.
    These are the absolute best value picks in the entire scraped dataset.
    """
    if df is None or df.empty:
        return []
        
    df = df.copy()
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
    df['NumericRating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0.0)
    valid_df = df.dropna(subset=['Price'])
    
    if len(valid_df) < 1:
        return []
        
    median_price = valid_df['Price'].median()
    
    value_picks = valid_df[
        (valid_df['Price'] <= median_price) & 
        (valid_df['NumericRating'] >= 4.0)
    ]
    
    if value_picks.empty:
        value_picks = valid_df[valid_df['NumericRating'] >= 3.5]
        if value_picks.empty:
             value_picks = valid_df
             
    top_picks = value_picks.sort_values(by=['NumericRating', 'Price'], ascending=[False, True]).head(3)
    
    recs = []
    for _, pick in top_picks.iterrows():
        recs.append(pick.to_dict())
        
    return recs

def add_similar_products(df):
    """
    Adds a 'SimilarProducts' column to the DataFrame that contains
    up to 3 similar products based on KNN, utilizing get_similar_products_knn.
    """
    if df is None or df.empty:
        return df
        
    df = df.copy()
    similar_list = []
    
    # Needs valid records for KNN
    valid_df = df.dropna(subset=['Price'])
    if len(valid_df) < 2:
        df['SimilarProducts'] = [[] for _ in range(len(df))]
        return df
        
    for _, row in df.iterrows():
        try:
            # We pass the full clean valid_df to give enough neighbors
            similar = get_similar_products_knn(valid_df, row, n_neighbors=3)
            similar_list.append(similar)
        except Exception:
            similar_list.append([])
            
    df['SimilarProducts'] = similar_list
    return df


# import pandas as pd
# import numpy as np

# def get_similar_products_knn(df, target_row, n_neighbors=3):
#     """Find similar products using price and rating"""
#     try:
#         # Ensure numeric values
#         df_valid = df.copy()
#         df_valid['Price'] = pd.to_numeric(df_valid['Price'], errors='coerce')
#         df_valid['Rating'] = pd.to_numeric(df_valid['Rating'], errors='coerce').fillna(0)
        
#         # Remove rows with NaN prices
#         df_valid = df_valid.dropna(subset=['Price'])
        
#         if len(df_valid) < 2:
#             return []
        
#         # Calculate price similarity
#         target_price = target_row['Price']
#         target_rating = target_row.get('Rating', 0)
#         if pd.isna(target_rating):
#             target_rating = 0
        
#         # Find similar products by price range (±30%)
#         price_range = target_price * 0.3
#         similar_mask = (df_valid['Price'] >= target_price - price_range) & \
#                        (df_valid['Price'] <= target_price + price_range) & \
#                        (df_valid['Title'] != target_row['Title'])
        
#         similar_products = df_valid[similar_mask].head(n_neighbors)
        
#         results = []
#         for _, row in similar_products.iterrows():
#             results.append(row.to_dict())
        
#         return results
#     except Exception as e:
#         print(f"KNN Error: {e}")
#         return []

# def add_better_alternatives(df):
#     """Find better alternatives (cheaper with similar rating)"""
#     if df is None or df.empty:
#         return df
    
#     df = df.copy()
#     df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
#     df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0)
#     df = df.dropna(subset=['Price'])
    
#     alternatives = []
    
#     for _, row in df.iterrows():
#         target_price = row['Price']
#         target_rating = row['Rating']
        
#         # Find cheaper products with similar or better rating
#         better_mask = (df['Price'] < target_price) & \
#                      (df['Rating'] >= target_rating - 0.5) & \
#                      (df['Title'] != row['Title'])
        
#         better_options = df[better_mask]
        
#         if not better_options.empty:
#             best = better_options.nsmallest(1, 'Price').iloc[0]
#             savings = target_price - best['Price']
            
#             alternatives.append({
#                 "title": best['Title'],
#                 "price": best['Price'],
#                 "rating": best['Rating'],
#                 "source": best['Source'],
#                 "link": best['Link'],
#                 "savings": int(savings)
#             })
#         else:
#             alternatives.append(None)
    
#     df['BetterAlternative'] = alternatives
#     return df

# def get_top_recommendations(df):
#     """Get top 3 recommendations"""
#     if df is None or df.empty:
#         return []
    
#     df = df.copy()
#     df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
#     df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0)
#     df = df.dropna(subset=['Price'])
    
#     # Calculate value score (higher rating / lower price)
#     df['ValueScore'] = (df['Rating'] / (df['Price'] / 1000)) * 10
    
#     # Sort by value score and get top 3
#     top_picks = df.nlargest(3, 'ValueScore')
    
#     return top_picks.to_dict(orient='records')

# def add_similar_products(df):
#     """Add similar products column"""
#     if df is None or df.empty:
#         return df
    
#     df = df.copy()
#     similar_list = []
    
#     for _, row in df.iterrows():
#         similar = get_similar_products_knn(df, row, n_neighbors=3)
#         similar_list.append(similar)
    
#     df['SimilarProducts'] = similar_list
#     return df

# components/recommendation_engine.py
# import pandas as pd
# import numpy as np

# def get_similar_products_knn(df, target_row, n_neighbors=3):
#     """Find similar products using price and rating"""
#     try:
#         df_valid = df.copy()
#         df_valid['Price'] = pd.to_numeric(df_valid['Price'], errors='coerce')
#         df_valid['Rating'] = pd.to_numeric(df_valid['Rating'], errors='coerce').fillna(0)
#         df_valid = df_valid.dropna(subset=['Price'])
        
#         if len(df_valid) < 2:
#             return []
        
#         target_price = target_row['Price']
#         target_rating = target_row.get('Rating', 0)
#         if pd.isna(target_rating):
#             target_rating = 0
        
#         price_range = target_price * 0.3
#         similar_mask = (df_valid['Price'] >= target_price - price_range) & \
#                        (df_valid['Price'] <= target_price + price_range) & \
#                        (df_valid['Title'] != target_row['Title'])
        
#         similar_products = df_valid[similar_mask].head(n_neighbors)
        
#         results = []
#         for _, row in similar_products.iterrows():
#             results.append(row.to_dict())
        
#         return results
#     except Exception as e:
#         print(f"KNN Error: {e}")
#         return []

# def add_better_alternatives(df):
#     """Find better alternatives (cheaper with similar rating)"""
#     if df is None or df.empty:
#         return df
    
#     df = df.copy()
#     df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
#     df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0)
#     df = df.dropna(subset=['Price'])
    
#     alternatives = []
    
#     for _, row in df.iterrows():
#         target_price = row['Price']
#         target_rating = row['Rating']
        
#         better_mask = (df['Price'] < target_price) & \
#                      (df['Rating'] >= target_rating - 0.5) & \
#                      (df['Title'] != row['Title'])
        
#         better_options = df[better_mask]
        
#         if not better_options.empty:
#             best = better_options.nsmallest(1, 'Price').iloc[0]
#             savings = target_price - best['Price']
            
#             alternatives.append({
#                 "title": best['Title'],
#                 "price": best['Price'],
#                 "rating": best['Rating'],
#                 "source": best['Source'],
#                 "link": best['Link'],
#                 "savings": int(savings)
#             })
#         else:
#             alternatives.append(None)
    
#     df['BetterAlternative'] = alternatives
#     return df

# def get_top_recommendations(df):
#     """Get top 3 recommendations"""
#     if df is None or df.empty:
#         return []
    
#     df = df.copy()
#     df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
#     df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0)
#     df = df.dropna(subset=['Price'])
    
#     # Calculate value score
#     df['ValueScore'] = (df['Rating'] / (df['Price'] / 1000)) * 10
#     df['ValueScore'] = df['ValueScore'].fillna(0)
    
#     top_picks = df.nlargest(3, 'ValueScore')
    
#     return top_picks.to_dict(orient='records')

# def add_similar_products(df):
#     """Add similar products column"""
#     if df is None or df.empty:
#         return df
    
#     df = df.copy()
#     similar_list = []
    
#     for _, row in df.iterrows():
#         similar = get_similar_products_knn(df, row, n_neighbors=3)
#         similar_list.append(similar)
    
#     df['SimilarProducts'] = similar_list
#     return df