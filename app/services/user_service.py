from datetime import datetime, timezone
from decimal import Decimal
from app.db.supabase import supabase_admin
from app.schemas.user import UserCreate

TABLE = "users"


def _serialize_payload(payload: dict) -> dict:
    serialized = {}
    for key, value in payload.items():
        if isinstance(value, Decimal):
            serialized[key] = float(value)
        elif isinstance(value, datetime):
            serialized[key] = value.isoformat()
        else:
            serialized[key] = value
    return serialized


def get_user_by_id(user_id: str) -> dict | None:
    print(f"DEBUG: get_user_by_id({user_id})")
    result = supabase_admin.table(TABLE).select("*").eq("id", user_id).maybe_single().execute()
    print(f"DEBUG: result = {result}, data = {result.data if result else None}")
    return result.data if result else None


def get_user_by_email(email: str) -> dict | None:
    result = supabase_admin.table(TABLE).select("*").eq("email", email).maybe_single().execute()
    return result.data if result else None


def create_user(data: UserCreate) -> dict:
    payload = data.model_dump(exclude_none=True)
    # Strip fields that are not in the DB schema to prevent PostgREST errors
    db_fields = {"email", "auth_provider", "provider_id", "email_verified", "avatar_url"}
    payload = {k: v for k, v in payload.items() if k in db_fields}
    payload["created_at"] = datetime.now(timezone.utc)
    payload = _serialize_payload(payload)
    result = supabase_admin.table(TABLE).insert(payload).execute()
    return result.data[0]


def create_user_with_id(user_id: str, data: UserCreate) -> dict:
    print(f"DEBUG: create_user_with_id({user_id}, {data})")
    payload = data.model_dump(exclude_none=True)
    db_fields = {"email", "auth_provider", "provider_id", "email_verified", "avatar_url", "username", "base_balance"}
    payload = {k: v for k, v in payload.items() if k in db_fields}
    payload["id"] = user_id
    payload["created_at"] = datetime.now(timezone.utc)
    payload = _serialize_payload(payload)
    print(f"DEBUG: payload = {payload}")
    # Use upsert to be idempotent
    result = supabase_admin.table(TABLE).upsert(payload).execute()
    print(f"DEBUG: upsert result = {result}, data = {result.data}")
    return result.data[0]


def update_user(user_id: str, data: dict) -> dict:
    db_fields = {"email", "auth_provider", "provider_id", "email_verified", "avatar_url", "username", "base_balance"}
    payload = {k: v for k, v in data.items() if k in db_fields and v is not None}
    if not payload:
        return {}
    payload = _serialize_payload(payload)
    result = supabase_admin.table(TABLE).update(payload).eq("id", user_id).execute()
    return result.data[0]


def touch_last_login(user_id: str) -> None:
    supabase_admin.table(TABLE).update(
        {"last_login": datetime.now(timezone.utc).isoformat()}
    ).eq("id", user_id).execute()


def upload_avatar(user_id: str, file_content: bytes, filename: str, content_type: str) -> str:
    """
    Upload an avatar to Supabase Storage and update the user's avatar_url.
    Bucket name is assumed to be 'avatars'.
    """
    bucket_name = "avatars"
    file_path = f"{user_id}/{filename}"

    # Upload to Supabase Storage
    supabase_admin.storage.from_(bucket_name).upload(
        path=file_path,
        file=file_content,
        file_options={"content-type": content_type, "upsert": "true"}
    )

    # Get public URL
    public_url = supabase_admin.storage.from_(bucket_name).get_public_url(file_path)

    # Update user record in DB
    update_user(user_id, {"avatar_url": public_url})

    return public_url
