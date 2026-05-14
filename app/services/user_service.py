from datetime import datetime, timezone
from app.db.supabase import supabase_admin
from app.schemas.user import UserCreate

TABLE = "users"


def get_user_by_id(user_id: str) -> dict | None:
    result = supabase_admin.table(TABLE).select("*").eq("id", user_id).maybe_single().execute()
    return result.data


def get_user_by_email(email: str) -> dict | None:
    result = supabase_admin.table(TABLE).select("*").eq("email", email).maybe_single().execute()
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


def create_user_with_id(user_id: str, data: UserCreate) -> dict:
    payload = data.model_dump()
    payload["id"] = user_id
    payload["created_at"] = datetime.now(timezone.utc).isoformat()
    for key, value in payload.items():
        if isinstance(value, datetime):
            payload[key] = value.isoformat()
    result = supabase_admin.table(TABLE).insert(payload).execute()
    return result.data[0]


def update_user(user_id: str, data: dict) -> dict:
    result = supabase_admin.table(TABLE).update(data).eq("id", user_id).execute()
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