from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.schemas.finance import TransactionCreate, TransactionUpdate, TransactionResponse, BalanceResponse
import app.services.finance_service as finance_service
from typing import List

router = APIRouter()


@router.get("/", response_model=List[TransactionResponse], summary="List all transactions")
def list_transactions(current_user: dict = Depends(get_current_user)):
    """Return all transactions for the authenticated user."""
    return finance_service.get_all_transactions(current_user["user_id"])


@router.get("/balance", response_model=BalanceResponse, summary="Get total balance")
def get_balance(current_user: dict = Depends(get_current_user)):
    """
    Return the total balance computed from summing all transaction amounts.
    Positive = net income, negative = net expense.
    """
    total = finance_service.get_total_balance(current_user["user_id"])
    return {"total_balance": total}


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED, summary="Create a transaction")
def create_transaction(
    body: TransactionCreate,
    current_user: dict = Depends(get_current_user),
):
    """Log a new transaction for the authenticated user."""
    data = body.model_dump()
    return finance_service.create_transaction(current_user["user_id"], data)


@router.get("/{transaction_id}", response_model=TransactionResponse, summary="Get a transaction")
def get_transaction(transaction_id: int, current_user: dict = Depends(get_current_user)):
    """Return a single transaction owned by the authenticated user."""
    txn = finance_service.get_transaction(transaction_id, current_user["user_id"])
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
    return txn


@router.patch("/{transaction_id}", response_model=TransactionResponse, summary="Update a transaction")
def update_transaction(
    transaction_id: int,
    body: TransactionUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update a transaction owned by the authenticated user."""
    txn = finance_service.get_transaction(transaction_id, current_user["user_id"])
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
    data = body.model_dump(exclude_none=True)
    return finance_service.update_transaction(transaction_id, current_user["user_id"], data)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a transaction")
def delete_transaction(transaction_id: int, current_user: dict = Depends(get_current_user)):
    """Delete a transaction owned by the authenticated user."""
    txn = finance_service.get_transaction(transaction_id, current_user["user_id"])
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
    finance_service.delete_transaction(transaction_id, current_user["user_id"])
