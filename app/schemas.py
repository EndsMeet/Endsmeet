# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from uuid import UUID

# ---------- Auth ----------
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: Optional[str] = None

class UserOut(BaseModel):
    id: UUID
    email: EmailStr

# ---------- Fixed Costs ----------
class FixedCostIn(BaseModel):
    name: str
    monthly_amount: float
    category: str

class FixedCostOut(FixedCostIn):
    id: UUID

# ---------- Files / Upload ----------
class FileUploadOut(BaseModel):
    source_file_id: UUID
    bank: Optional[str] = None
    original_name: str

# ---------- Transactions ----------
class TxOut(BaseModel):
    id: UUID
    booking_date: date
    amount: float
    currency: str
    counterparty_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    category_conf: Optional[float] = None

class TxPatchCategory(BaseModel):
    category: str

# ---------- Analytics ----------
class SummaryCategory(BaseModel):
    category: str
    sum: float
    tx_count: int
    trend_pct_vs_prev: Optional[float] = None

class SummaryOut(BaseModel):
    window_days: int
    by_category: List[SummaryCategory]
    income_sum: float
    net_flow: float
    slips: List[dict]