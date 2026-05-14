from app.db.supabase import supabase_admin
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional

TABLE = "courses"


def get_all_courses(user_id: str) -> list[dict]:
    """Return all courses for a user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data


def get_course(course_id: str, user_id: str) -> dict | None:
    """Return a single course row. Scoped to the user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("id", course_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    return response.data


def create_course(user_id: str, data: dict) -> dict:
    """Insert a new course."""
    data["user_id"] = user_id
    response = supabase_admin.table(TABLE).insert(data).execute()
    return response.data[0]


def update_course(course_id: str, user_id: str, data: dict) -> dict:
    """Update a course row. Scoped to the user."""
    
    if "course_grade" in data:
        data["course_grade"] = float(data["course_grade"])
    
    response = (
        supabase_admin.table(TABLE)
        .update(data)
        .eq("id", course_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0]


def delete_course(course_id: str, user_id: str) -> None:
    """Delete a course. Scoped to the user."""
    supabase_admin.table(TABLE).delete().eq("id", course_id).eq(
        "user_id", user_id
    ).execute()


def calculate_gwa(user_id: str) -> tuple[Optional[Decimal], int]:
    """
    Compute the UP GWA using the weighted average formula:
        GWA = Σ(grade × units) / Σ(units)

    Returns (gwa_rounded_to_4_places, course_count).
    Returns (None, 0) if the user has no courses.
    """
    response = (
        supabase_admin.table(TABLE)
        .select("units, course_grade")
        .eq("user_id", user_id)
        .execute()
    )
    courses = response.data or []
    if not courses:
        return None, 0

    total_units = sum(Decimal(str(c["units"])) for c in courses)
    weighted_sum = sum(
        Decimal(str(c["course_grade"])) * Decimal(str(c["units"])) for c in courses
    )

    if total_units == 0:
        return None, len(courses)

    gwa = (weighted_sum / total_units).quantize(
        Decimal("0.0001"), rounding=ROUND_HALF_UP
    )
    return gwa, len(courses)
