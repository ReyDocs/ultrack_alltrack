from datetime import datetime, timezone
from app.db.supabase import supabase_admin
from app.schemas.task import TaskCreate, TaskUpdate

TABLE = "tasks"


def get_all_tasks(user_id: str) -> list:
    result = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def get_task(task_id: str, user_id: str) -> dict | None:
    result = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("task_id", task_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return result.data


def create_task(user_id: str, data: TaskCreate) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    payload = data.model_dump()
    # Convert datetime fields to ISO strings so they are JSON serializable
    if payload.get("due_date"):
        payload["due_date"] = payload["due_date"].isoformat()
    payload.update({"user_id": user_id, "created_at": now, "updated_at": now})
    result = supabase_admin.table(TABLE).insert(payload).execute()
    return result.data[0]


def update_task(task_id: str, user_id: str, data: TaskUpdate) -> dict:
    payload = data.model_dump(exclude_none=True)
    if payload.get("due_date"):
        payload["due_date"] = payload["due_date"].isoformat()
    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = (
        supabase_admin.table(TABLE)
        .update(payload)
        .eq("task_id", task_id)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0]


def delete_task(task_id: str, user_id: str) -> None:
    supabase_admin.table(TABLE).delete().eq("task_id", task_id).eq("user_id", user_id).execute()