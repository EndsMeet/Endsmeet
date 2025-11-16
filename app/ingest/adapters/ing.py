# app/ingest/adapters/ing.py
import pandas as pd
from ..adapters import rabo as _noop  # houd package import actief
from ...utils.parsing_common import to_date_safe, to_amount_safe

def looks_like(df: pd.DataFrame) -> bool:
    cols = set(c.lower() for c in df.columns)
    # ING export (NL) heeft meestal deze kolommen
    return {"datum", "naam/omschrijving"}.issubset(cols) or {"date", "name/description"}.issubset(cols)

def normalize(df: pd.DataFrame) -> pd.DataFrame:
    # Herken kolomnamen (NL/EN)
    cols = {c.lower(): c for c in df.columns}
    # datum
    date_col = cols.get("datum") or cols.get("date")
    # bedrag
    amount_col = cols.get("bedrag (eur)") or cols.get("amount (eur)") or cols.get("bedrag") or cols.get("amount")
    # valuta (soms niet aanwezig → EUR)
    currency_col = cols.get("valuta") or cols.get("currency")
    # naam/omschrijving
    name_col = cols.get("naam/omschrijving") or cols.get("name/description")
    # tegenrekening (optioneel)
    iban_col = cols.get("tegenrekening") or cols.get("counteraccount") or cols.get("iban/tegenrekening")

    if not date_col or not amount_col or not name_col:
        raise ValueError("CSV van ING mist verplichte kolommen (datum/bedrag/naam).")

    res = pd.DataFrame()
    res["booking_date"] = to_date_safe(df[date_col])
    res["amount"] = to_amount_safe(df[amount_col])
    res["currency"] = df[currency_col] if currency_col in df else "EUR"
    res["counterparty_name"] = df[name_col].astype(str)
    res["counterparty_iban"] = df[iban_col].astype(str) if iban_col in df else None
    res["description"] = df[name_col].astype(str)  # ING plakt vaak alles in één kolom
    res["raw_category_hint"] = None
    res["source_bank"] = "ING"
    return res