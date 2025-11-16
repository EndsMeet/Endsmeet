from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Transaction
from ..services.categorizer import rule_category

router = APIRouter(prefix="/categorize", tags=["categorize"])

@router.post("/{source_file_id}")
def categorize(source_file_id: str, db: Session = Depends(get_db)):
    txs = db.query(Transaction).filter(Transaction.source_file_id == source_file_id).all()
    if not txs:
        raise HTTPException(status_code=404, detail="no transactions for file")
    updated = 0
    for t in txs:
        label, conf = rule_category(t.counterparty_name, t.description)
        if label:
            t.category = label
            t.category_conf = conf
            updated += 1
    db.commit()
    return {"updated": updated, "total": len(txs)}