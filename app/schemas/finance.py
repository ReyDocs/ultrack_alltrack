from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class TransactionCreate(BaseModel):
    expense_desc: Optional[str] = None   # e.g. "Ate Lings", "Grab"
    type: str                             # e.g. "Fare", "Food", "Others"
    amount: Decimal                       # positive = income, negative = expense


class TransactionUpdate(BaseModel):
    expense_desc: Optional[str] = None
    type: Optional[str] = None
    amount: Optional[Decimal] = None


class TransactionResponse(BaseModel):
    transaction_id: int
    user_id: str
    expense_desc: Optional[str] = None
    type: str
    amount: Decimal


class BalanceResponse(BaseModel):
    total_balance: Decimal
