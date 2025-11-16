from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..services.analytics import summary_90d
from ..schemas import SummaryOut

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary", response_model=SummaryOut)
def summary(db: Session = Depends(get_db)):
    data = summary_90d(db, user_id=None)
    return data