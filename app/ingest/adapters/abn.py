# app/ingest/adapters/abn.py
import pandas as pd
from ...utils.parsing_common import to_date_safe, to_amount_safe

def looks_like(df: pd.DataFrame) -> bool:
    cols = set(c.lower() for c in df.columns)
    # ABN export vaak 'Transaction date' / 'Omschrijving' / 'Tegenrekening'
    return "transaction date" in cols or "omschrijving" in cols or "tegenrekening" in cols

def normalize(df: pd.DataFrame) -> pd.DataFrame:
    cols = {c.lower(): c for c in df.columns}
    date_col = cols.get("transaction date") or cols.get("datum") or cols.get("boekingsdatum")
    amount_col = cols.get("amount") or cols.get("bedrag")
    currency_col = cols.get("currency") or cols.get("valuta")
    name_col = cols.get("name") or cols.get("naam") or cols.get("omschrijving")
    iban_col = cols.get("counter account") or cols.get("tegenrekening") or cols.get("iban")

    if not date_col or not amount_col or not name_col:
        raise ValueError("CSV van ABN mist verplichte kolommen (datum/bedrag/naam).")

    res = pd.DataFrame()
    res["booking_date"] = to_date_safe(df[date_col])
    res["amount"] = to_amount_safe(df[amount_col])
    res["currency"] = df[currency_col] if currency_col in df else "EUR"
    res["counterparty_name"] = df[name_col].astype(str)
    res["counterparty_iban"] = df[iban_col].astype(str) if iban_col in df else None
    # Omschrijving apart als beschikbaar
    desc_col = cols.get("omschrijving") or cols.get("description") or name_col
    res["description"] = df[desc_col].astype(str)
    res["raw_category_hint"] = None
    res["source_bank"] = "ABN"
    return res