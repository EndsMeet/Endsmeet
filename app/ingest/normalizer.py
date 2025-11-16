# app/ingest/normalizer.py
import pandas as pd
from .adapters import ing as ing_adapter
from .adapters import rabo as rabo_adapter
from .adapters import abn as abn_adapter

BANKS = [
    ("ING", ing_adapter),
    ("RABO", rabo_adapter),
    ("ABN", abn_adapter),
]

def detect_bank(df: pd.DataFrame) -> str:
    for name, adapter in BANKS:
        try:
            if adapter.looks_like(df):
                return name
        except Exception:
            continue
    return "UNKNOWN"

def normalize(df: pd.DataFrame, bank: str) -> pd.DataFrame:
    bank = (bank or "").upper()
    if bank == "ING":
        return ing_adapter.normalize(df)
    if bank == "RABO":
        return rabo_adapter.normalize(df)
    if bank == "ABN":
        return abn_adapter.normalize(df)
    # fallback: beste gok (probeer adapters totdat er geen exception is)
    for _, adapter in BANKS:
        try:
            return adapter.normalize(df)
        except Exception:
            continue
    # als alles faalt: minimale shape om app niet te crashen
    out = pd.DataFrame()
    out["booking_date"] = pd.to_datetime(pd.Series([]), errors="coerce").dt.date
    out["amount"] = pd.Series([], dtype="float")
    out["currency"] = "EUR"
    out["counterparty_name"] = None
    out["counterparty_iban"] = None
    out["description"] = None
    out["raw_category_hint"] = None
    out["source_bank"] = bank or "UNKNOWN"
    return out