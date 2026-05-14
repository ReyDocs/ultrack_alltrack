from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from enum import Enum


class TransactionType(str, Enum):
    fare = "Fare"
    food = "Food"
    others = "Others"
    housing = "Housing"
    transport = "Transport"


class TransactionCreate(BaseModel):
    expense_desc: Optional[str] = None   # e.g. "Ate Lings", "Grab"
    type: TransactionType                 # enforced dropdown values
    amount: Decimal                       # positive expense amount (subtracted from base_balance)


class TransactionUpdate(BaseModel):
    expense_desc: Optional[str] = None
    type: Optional[TransactionType] = None
    amount: Optional[Decimal] = None
    model_config = {
        "json_schema_extra": {
            "example": {}
        }
    }


class TransactionResponse(BaseModel):
    transaction_id: int
    user_id: str
    expense_desc: Optional[str] = None
    type: str
    amount: Decimal


class BalanceResponse(BaseModel):
    total_balance: Decimal
