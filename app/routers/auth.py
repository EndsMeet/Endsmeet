from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..db import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, TokenOut
from passlib.hash import pbkdf2_sha256 as hasher
from ..core.security import create_access_token
import logging

logger = logging.getLogger("endsmeet")

# LET OP: prefix="/auth"  -> samen met API_PREFIX "/api" wordt dit /api/auth/...
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        # E-mail al bekend?
        if db.query(User).filter(User.email == payload.email).first():
            raise HTTPException(status_code=400, detail="E-mail is al geregistreerd")

        u = User(
            email=payload.email,
            password_hash=hasher.hash(payload.password),
        )
        db.add(u)
        db.commit()
        db.refresh(u)
        return UserOut(id=u.id, email=u.email)

    except HTTPException:
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="E-mail is al geregistreerd")
    except Exception:
        db.rollback()
        logger.exception("signup failed")
        raise HTTPException(status_code=500, detail="Signup mislukt")


@router.post("/login", response_model=TokenOut)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == payload.email).first()
    if not u or not hasher.verify(payload.password, u.password_hash or ""):
        raise HTTPException(status_code=401, detail="Ongeldige inloggegevens")

    token = create_access_token(str(u.id))
    return TokenOut(access_token=token, token_type="bearer")