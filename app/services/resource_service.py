from app.db.supabase import supabase_admin
from datetime import datetime, timezone

TABLE = "resources"


def get_all_resources(user_id: str) -> list[dict]:
    """Return all saved resources for a user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data


def get_resource(resource_id: str, user_id: str) -> dict | None:
    """Return a single resource. Scoped to the user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("resource_id", resource_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    return response.data


def create_resource(user_id: str, data: dict) -> dict:
    """Insert a new resource entry."""
    payload = {
        **data,
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    response = supabase_admin.table(TABLE).insert(payload).execute()
    return response.data[0]


def update_resource(resource_id: str, user_id: str, data: dict) -> dict:
    """Update a resource entry. Scoped to the user."""
    response = (
        supabase_admin.table(TABLE)
        .update(data)
        .eq("resource_id", resource_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0]


def delete_resource(resource_id: str, user_id: str) -> None:
    """Delete a resource. Scoped to the user."""
    supabase_admin.table(TABLE).delete().eq(
        "resource_id", resource_id
    ).eq("user_id", user_id).execute()
