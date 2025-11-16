from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import SourceFile, Transaction
import pandas as pd
from ..ingest.normalizer import detect_bank, normalize

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("/{source_file_id}/parse")
def parse(source_file_id: str, db: Session = Depends(get_db)):
    sf = db.query(SourceFile).get(source_file_id)
    if not sf:
        raise HTTPException(status_code=404, detail="file not found")
    df = pd.read_csv(sf.stored_path)
    bank = detect_bank(df)
    norm = normalize(df, bank)
    sf.bank = bank
    db.add(sf); db.commit()
    for _, row in norm.iterrows():
        t = Transaction(
            user_id=None,
            source_file_id=sf.id,
            booking_date=row["booking_date"],
            amount=row["amount"],
            currency=row["currency"],
            counterparty_name=row.get("counterparty_name"),
            counterparty_iban=row.get("counterparty_iban"),
            description=row.get("description"),
            raw_category_hint=row.get("raw_category_hint"),
            source_bank=row.get("source_bank"),
        )
        db.add(t)
    db.commit()
    return {"bank": bank, "rows": len(norm)}