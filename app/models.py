# app/models.py
from sqlalchemy import Column, String, Date, Numeric, Boolean, Text, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from .db import Base  # <-- IMPORTANT: import Base from app.db

class User(Base):
    __tablename__ = "app_user"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=True)
    created_at = Column(TIMESTAMP)

    transactions = relationship("Transaction", back_populates="user")

class FixedCost(Base):
    __tablename__ = "fixed_cost"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("app_user.id"))
    name = Column(String)
    monthly_amount = Column(Numeric(12, 2))
    category = Column(String)
    created_at = Column(TIMESTAMP)

class SourceFile(Base):
    __tablename__ = "source_file"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("app_user.id"))
    bank = Column(String)
    original_name = Column(String)
    stored_path = Column(String)
    uploaded_at = Column(TIMESTAMP)

class Transaction(Base):
    __tablename__ = "transaction_norm"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("app_user.id"))
    source_file_id = Column(UUID(as_uuid=True), ForeignKey("source_file.id"))
    booking_date = Column(Date)
    amount = Column(Numeric(12, 2))
    currency = Column(String, default="EUR")
    counterparty_name = Column(String)
    counterparty_iban = Column(String)
    description = Column(Text)
    raw_category_hint = Column(String)
    source_bank = Column(String)
    category = Column(String)
    category_conf = Column(Numeric(4, 3))
    is_fixed = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP)

    user = relationship("User", back_populates="transactions")

class CategoryOverride(Base):
    __tablename__ = "category_override"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("app_user.id"))
    pattern = Column(Text)
    category = Column(String)
    priority = Column(String, default=100)  # simple string OK for now
    created_at = Column(TIMESTAMP)