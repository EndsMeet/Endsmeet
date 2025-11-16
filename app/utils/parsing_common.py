# app/utils/parsing_common.py
import pandas as pd

def to_date_safe(s: pd.Series) -> pd.Series:
    return pd.to_datetime(s, errors="coerce").dt.date

def to_amount_safe(s: pd.Series) -> pd.Series:
    # Komma -> punt, spaties weg, converteer naar float
    return (
        s.astype(str)
         .str.replace(".", "", regex=False)      # duizendtallen weghalen (NL)
         .str.replace(",", ".", regex=False)     # decimaal
         .str.replace(" ", "", regex=False)
         .pipe(pd.to_numeric, errors="coerce")
    )