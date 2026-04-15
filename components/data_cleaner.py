import pandas as pd

def remove_outliers(df, column='Price'):
    """
    Cleans up the scraped DataFrame by removing statistical outliers using 
    the Interquartile Range (IQR) method. This deletes fake '₹1' listings 
    or absurdly overpriced bundle listings that pollute the dataset.
    """
    if df is None or df.empty or column not in df.columns:
        return df
        
    df = df.copy()
    
    # Calculate IQR
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    # Strictly filter items, guaranteeing at least a ₹50 minimum price 
    # to naturally filter out fake accessory/placeholder strings
    clean_df = df[(df[column] >= max(lower_bound, 50)) & (df[column] <= upper_bound)]
    
    # Safety Check: If the dataset gets wiped out too much (e.g. only 3 items exist),
    # fallback and return original data to prevent breaking the UI
    if len(clean_df) < len(df) * 0.4:
        return df
        
    return clean_df
