# app/ingest/adapters/rabo.py
import pandas as pd
from ...utils.parsing_common import to_date_safe, to_amount_safe

def looks_like(df: pd.DataFrame) -> bool:
    cols = set(c.lower() for c in df.columns)
    # Rabo export heeft vaak 'Boekingsdatum' en 'Tegenrekening nummer' of 'Naam tegenpartij'
    return "boekingsdatum" in cols or "naam tegenpartij" in cols

def normalize(df: pd.DataFrame) -> pd.DataFrame:
    cols = {c.lower(): c for c in df.columns}
    date_col = cols.get("boekingsdatum") or cols.get("datum")
    amount_col = cols.get("bedrag") or cols.get("amount") or cols.get("bedrag (eur)")
    currency_col = cols.get("munt") or cols.get("valuta") or cols.get("currency")
    name_col = cols.get("naam tegenpartij") or cols.get("naam") or cols.get("omschrijving")
    iban_col = cols.get("tegenrekening nummer") or cols.get("iban")

    if not date_col or not amount_col or not name_col:
        raise ValueError("CSV van Rabobank mist verplichte kolommen (datum/bedrag/naam).")

    res = pd.DataFrame()
    res["booking_date"] = to_date_safe(df[date_col])
    res["amount"] = to_amount_safe(df[amount_col])
    res["currency"] = df[currency_col] if currency_col in df else "EUR"
    res["counterparty_name"] = df[name_col].astype(str)
    res["counterparty_iban"] = df[iban_col].astype(str) if iban_col in df else None
    # Rabo heeft vaak aparte 'Omschrijving'
    desc_col = cols.get("omschrijving") or name_col
    res["description"] = df[desc_col].astype(str)
    res["raw_category_hint"] = None
    res["source_bank"] = "RABO"
    return res