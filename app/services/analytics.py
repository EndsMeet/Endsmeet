# app/services/analytics.py
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from ..models import Transaction

def _to_float(x):
    try:
        return float(x) if x is not None else 0.0
    except Exception:
        return 0.0

def summary_90d(db: Session, user_id: Optional[str]) -> Dict[str, Any]:
    """
    Simpele 90-dagen samenvatting:
    - som per categorie
    - income som (amount > 0)
    - net_flow = income + uitgaven (negatief)
    """
    today = date.today()
    start = today - timedelta(days=90)

    q = (
        db.query(
            Transaction.category.label("category"),
            func.count(Transaction.id).label("tx_count"),
            func.coalesce(func.sum(Transaction.amount), 0).label("sum_amount"),
        )
        .filter(Transaction.booking_date >= start)
        .group_by(Transaction.category)
    )
    rows = q.all()

    by_category = []
    income_sum = 0.0
    for r in rows:
        s = _to_float(r.sum_amount)
        if (r.category or "").lower() == "income":
            income_sum += s
        by_category.append({
            "category": r.category or "Other",
            "sum": s,
            "tx_count": int(r.tx_count),
            "trend_pct_vs_prev": None,  # MVP laat leeg
        })

    # Als geen category labeling: splits ruw op teken
    if not by_category:
        q2 = (
            db.query(
                func.count(Transaction.id),
                func.coalesce(func.sum(Transaction.amount), 0),
            )
            .filter(Transaction.booking_date >= start)
        )
        cnt, s = q2.first()
        by_category = [{"category": "All", "sum": _to_float(s), "tx_count": int(cnt), "trend_pct_vs_prev": None}]

    total_sum = sum(c["sum"] for c in by_category)
    net_flow = total_sum  # income + expenses (expenses negatief)

    return {
        "window_days": 90,
        "by_category": by_category,
        "income_sum": income_sum,
        "net_flow": net_flow,
        "slips": [],  # placeholder voor slip-detectie
    }