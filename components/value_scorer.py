import re
import pandas as pd

def calculate_value_score(df):
    """
    Dynamically scores products out of 100 based on Specs-to-Price ratio.
    Extracts RAM, Storage, and Battery from the title if available.
    """
    if df is None or df.empty:
        return df
        
    df = df.copy()
    scores = []
    extracted_data = []
    
    for _, row in df.iterrows():
        title = str(row['Title']).upper()
        price = row['Price']
        rating = row.get('Rating', 0)
        try:
            rating = float(rating)
            if pd.isna(rating):
                rating = 0.0
        except:
            rating = 0.0
            
        if pd.isna(price) or price <= 0:
            extracted_data.append({'ram': 0, 'storage': 0, 'battery': 0, 'price': 0, 'rating': rating})
            continue
            
        # Regex to find GB values
        gb_matches = re.findall(r'(\d+)\s*GB', title)
        gb_values = sorted([int(x) for x in gb_matches])
        
        ram = 0
        storage = 0
        if len(gb_values) == 1:
            val = gb_values[0]
            if val <= 16: ram = val
            else: storage = val
        elif len(gb_values) >= 2:
            ram = gb_values[0] # smallest
            storage = gb_values[-1] # largest
            
        # Battery mAh
        mah_match = re.search(r'(\d+)\s*MAH', title)
        battery = int(mah_match.group(1)) if mah_match else 0
        
        extracted_data.append({
            'ram': ram, 
            'storage': storage, 
            'battery': battery, 
            'price': float(price),
            'rating': rating
        })
        
    # Relative scoring based on max specs in this specific search
    valid_data = [d for d in extracted_data if d['price'] > 0]
    if not valid_data:
        df['ValueScore'] = 0
        return df
        
    max_ram = max((d['ram'] for d in valid_data), default=1) or 1
    max_storage = max((d['storage'] for d in valid_data), default=1) or 1
    max_battery = max((d['battery'] for d in valid_data), default=1) or 1
    min_price = min((d['price'] for d in valid_data), default=1) or 1
    
    for d in extracted_data:
        if d['price'] <= 0:
            scores.append(0)
            continue
            
        # Normalize features (0 to 1 scale relative to top specs found)
        n_ram = d['ram'] / max_ram
        n_storage = d['storage'] / max_storage
        n_battery = d['battery'] / max_battery
        n_rating = d['rating'] / 5.0
        n_price = min_price / d['price'] # Highest for cheapest
        
        has_specs = (d['ram'] > 0 or d['storage'] > 0 or d['battery'] > 0)
        
        if has_specs:
            # Emphasize specs if they exist in this product category
            raw_score = (n_ram * 0.25) + (n_storage * 0.25) + (n_battery * 0.1) + (n_rating * 0.1) + (n_price * 0.3)
        else:
            # Fallback for shoes/clothes/etc
            raw_score = (n_rating * 0.4) + (n_price * 0.6)
            
        final_score = int(min(raw_score * 100, 100))
        scores.append(final_score)
        
    df['ValueScore'] = scores
    return df
