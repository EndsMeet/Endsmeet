from typing import List, Dict, Any
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd

from ..db import get_db
from ..models import Transaction
from ..schemas import TxOut, TxPatchCategory

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=List[TxOut])
def list_transactions(db: Session = Depends(get_db)):
    txs = db.query(Transaction).limit(200).all()
    return [
        TxOut(
            id=t.id,
            booking_date=t.booking_date,
            amount=float(t.amount),
            currency=t.currency,
            counterparty_name=t.counterparty_name,
            description=t.description,
            category=t.category,
            category_conf=float(t.category_conf) if t.category_conf else None,
        )
        for t in txs
    ]


@router.patch("/{tx_id}")
def patch_category(tx_id: str, payload: TxPatchCategory, db: Session = Depends(get_db)):
    t = db.query(Transaction).get(tx_id)
    if not t:
        raise HTTPException(status_code=404, detail="tx not found")
    t.category = payload.category
    db.commit()
    return {"ok": True}


@router.post("/import/preview")
async def preview_import(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Neem een CSV / Excel met minimaal een kolom 'amount'.
    Optioneel:
      - 'date' (YYYY-MM-DD of dd-mm-yyyy)
      - 'category'

    Bedragen:
      - positief  -> inkomen
      - negatief  -> uitgave
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Bestand heeft geen naam.")

    filename = file.filename.lower()

    if not (
        filename.endswith(".csv")
        or filename.endswith(".xlsx")
        or filename.endswith(".xls")
    ):
        raise HTTPException(
            status_code=400,
            detail="Alleen .csv, .xls of .xlsx wordt nu ondersteund.",
        )

    content = await file.read()

    # Inlezen met pandas
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Kon het bestand niet lezen. Controleer of het een geldige CSV/Excel is.",
        )

    if df.empty:
        raise HTTPException(status_code=400, detail="Bestand bevat geen rijen.")

    # Kolomnamen normaliseren
    df.columns = [str(c).strip().lower() for c in df.columns]

    if "amount" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="Verwacht een kolom 'amount' in het bestand.",
        )

    # amount naar nummers
    amount = pd.to_numeric(df["amount"], errors="coerce")
    amount = amount.dropna()

    if amount.empty:
        raise HTTPException(
            status_code=400,
            detail="Geen geldige bedragen gevonden in de kolom 'amount'.",
        )

    total_income = float(amount[amount > 0].sum())
    total_expense = float(amount[amount < 0].sum())
    net = float(amount.sum())

    # Per categorie (als 'category' bestaat)
    by_category: List[Dict[str, Any]] = []
    if "category" in df.columns:
        tmp = df.copy()
        tmp["_amount"] = amount
        cat_group = tmp.groupby("category")["_amount"].sum().reset_index()

        by_category = [
            {
                "category": str(row["category"]),
                "total": float(row["_amount"]),
            }
            for _, row in cat_group.iterrows()
        ]

    # Per maand (als 'date' bestaat)
    by_month: List[Dict[str, Any]] = []
    if "date" in df.columns:
        dates = pd.to_datetime(df["date"], errors="coerce")
        mask = dates.notna()
        tmp = pd.DataFrame(
            {
                "date": dates[mask],
                "amount": amount[mask],
            }
        )
        tmp["year_month"] = tmp["date"].dt.to_period("M").astype(str)
        month_group = tmp.groupby("year_month")["amount"].sum().reset_index()

        by_month = [
            {
                "month": row["year_month"],
                "total": float(row["amount"]),
            }
            for _, row in month_group.iterrows()
        ]

    return {
        "row_count": int(len(df)),
        "total_income": total_income,
        "total_expense": total_expense,
        "net": net,
        "currency": "EUR",  # voorlopig hardcoded
        "by_category": by_category,
        "by_month": by_month,
    }