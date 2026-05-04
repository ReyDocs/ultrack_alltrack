from datetime import datetime, timezone
from app.db.supabase import supabase_admin
from app.schemas.user import UserCreate, UserUpdate

TABLE = "users"


def get_user_by_id(user_id: str) -> dict | None:
    result = supabase_admin.table(TABLE).select("*").eq("id", user_id).single().execute()
    return result.data


def get_user_by_email(email: str) -> dict | None:
    result = supabase_admin.table(TABLE).select("*").eq("email", email).single().execute()
    return result.data


def create_user(data: UserCreate) -> dict:
    payload = data.model_dump()
    payload["created_at"] = datetime.now(timezone.utc).isoformat()
    # Convert any remaining datetime objects to ISO strings
    for key, value in payload.items():
        if isinstance(value, datetime):
            payload[key] = value.isoformat()
    result = supabase_admin.table(TABLE).insert(payload).execute()
    return result.data[0]


def update_user(user_id: str, data: UserUpdate) -> dict:
    payload = data.model_dump(exclude_none=True)
    result = supabase_admin.table(TABLE).update(payload).eq("id", user_id).execute()
    return result.data[0]


def record_last_login(user_id: str) -> None:
    supabase_admin.table(TABLE).update(
        {"last_login": datetime.now(timezone.utc).isoformat()}
    ).eq("id", user_id).execute()