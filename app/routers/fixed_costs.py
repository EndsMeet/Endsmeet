from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import FixedCost
from ..schemas import FixedCostIn, FixedCostOut
from typing import List
from uuid import uuid4

router = APIRouter(prefix="/fixed-costs", tags=["fixed-costs"])

@router.post("/", response_model=FixedCostOut)
def create_fixed(payload: FixedCostIn, db: Session = Depends(get_db)):
    fc = FixedCost(id=uuid4(), user_id=None, name=payload.name, monthly_amount=payload.monthly_amount, category=payload.category)
    db.add(fc); db.commit(); db.refresh(fc)
    return FixedCostOut(id=fc.id, **payload.model_dump())

@router.get("/", response_model=List[FixedCostOut])
def list_fixed(db: Session = Depends(get_db)):
    rows = db.query(FixedCost).all()
    return [FixedCostOut(id=r.id, name=r.name, monthly_amount=float(r.monthly_amount), category=r.category) for r in rows]