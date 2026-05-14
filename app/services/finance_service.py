from app.db.supabase import supabase_admin
from decimal import Decimal

TABLE = "transactions"


def get_all_transactions(user_id: str) -> list[dict]:
    """Return all transactions for a user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("user_id", user_id)
        .order("transaction_id", desc=True)
        .execute()
    )
    return response.data


def get_transaction(transaction_id: int, user_id: str) -> dict | None:
    """Return a single transaction. Scoped to the user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("transaction_id", transaction_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    return response.data


def create_transaction(user_id: str, data: dict) -> dict:
    """Insert a new transaction."""
    data["user_id"] = user_id
    response = supabase_admin.table(TABLE).insert(data).execute()
    return response.data[0]


def update_transaction(transaction_id: int, user_id: str, data: dict) -> dict:
    """Update a transaction. Scoped to the user."""
    
    if "amount" in data:
        data["amount"] = float(data["amount"])
        
    response = (
        supabase_admin.table(TABLE)
        .update(data)
        .eq("transaction_id", transaction_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0]


def delete_transaction(transaction_id: int, user_id: str) -> None:
    """Delete a transaction. Scoped to the user."""
    supabase_admin.table(TABLE).delete().eq(
        "transaction_id", transaction_id
    ).eq("user_id", user_id).execute()


def get_total_balance(user_id: str) -> Decimal:
    """
    Calculate total balance: base_balance (from users) - sum(all transaction amounts)
    Transactions are now considered purely as expenses (positive numbers).
    """
    # 1. Get base balance from users table
    user_response = (
        supabase_admin.table("users")
        .select("base_balance")
        .eq("id", user_id)
        .maybe_single()
        .execute()
    )
    
    base_balance = Decimal("0.00")
    if user_response.data and user_response.data.get("base_balance") is not None:
        base_balance = Decimal(str(user_response.data["base_balance"]))

    # 2. Get all transactions
    response = (
        supabase_admin.table(TABLE)
        .select("amount")
        .eq("user_id", user_id)
        .execute()
    )
    rows = response.data or []
    total_expenses = sum(Decimal(str(row["amount"])) for row in rows)
    
    # 3. Calculate new balance
    return base_balance - total_expenses
