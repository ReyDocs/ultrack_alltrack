from app.db.supabase import supabase_admin
import decimal
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional, List

TABLE = "courses"


def get_all_courses(user_id: str) -> List[dict]:
    """Fetch all courses for a specific user. Ordered by creation."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("user_id", user_id)
        .order("id") # Stable ordering
        .execute()
    )
    return response.data or []


def get_course(course_id: str, user_id: str) -> Optional[dict]:
    """Fetch a single course entry. Scoped to the user."""
    response = (
        supabase_admin.table(TABLE)
        .select("*")
        .eq("id", course_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0] if response.data else None


def create_course(user_id: str, data: dict) -> dict:
    """Create a new course entry for a user."""
    data["user_id"] = user_id
    # Ensure id is NOT provided so Supabase generates one
    if "id" in data:
        del data["id"]
        
    response = supabase_admin.table(TABLE).insert(data).execute()
    if not response.data:
        raise Exception("Failed to create course in Supabase.")
    return response.data[0]


def update_course(course_id: str, user_id: str, data: dict) -> dict:
    """Update a course row. Scoped to the user."""
    # Ensure numeric fields are correctly typed for Supabase insertion
    if "units" in data:
        data["units"] = float(data["units"])
    if "course_grade" in data:
        try:
            data["course_grade"] = float(data["course_grade"])
        except (ValueError, TypeError):
            # If it's something like "INC", we can't convert it to float for a DECIMAL column.
            # However, if the column is DECIMAL, it MUST be numeric.
            # If the user selected "INC", we might want to store a special value or handle it.
            # For now, we'll assume the frontend only sends numeric values for DECIMAL updates.
            pass
    
    response = (
        supabase_admin.table(TABLE)
        .update(data)
        .eq("id", course_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not response.data:
        raise Exception("Failed to update course or unauthorized.")
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

    Excludes non-numeric grades (e.g., 'INC') and zero-unit courses from computation.
    Returns (gwa_rounded_to_4_places, course_count).
    Returns (None, 0) if no valid courses found.
    """
    response = (
        supabase_admin.table(TABLE)
        .select("units, course_grade")
        .eq("user_id", user_id)
        .execute()
    )
    raw_courses = response.data or []
    if not raw_courses:
        return None, 0

    valid_courses = []
    for c in raw_courses:
        try:
            # We convert to string first to avoid float precision issues when initializing Decimal
            grade_val = Decimal(str(c["course_grade"]))
            unit_val = Decimal(str(c["units"]))
            
            # UP GWA calculation typically only includes numeric grades.
            # 5.0 is the failing grade, so it IS included.
            # INC/DRP are usually excluded.
            if unit_val > 0:
                valid_courses.append((grade_val, unit_val))
        except (ValueError, TypeError, decimal.InvalidOperation):
            # Skip rows with malformed or non-numeric grades
            continue

    if not valid_courses:
        return None, len(raw_courses)

    total_units = sum(u for g, u in valid_courses)
    weighted_sum = sum(g * u for g, u in valid_courses)

    if total_units == 0:
        return None, len(raw_courses)

    gwa = (weighted_sum / total_units).quantize(
        Decimal("0.0001"), rounding=ROUND_HALF_UP
    )
    return gwa, len(raw_courses)


def compute_gwa_from_list(courses_data: list[dict]) -> tuple[Optional[Decimal], int]:
    """
    Compute GWA from a provided list of course objects (stateless).
    Each dict should have 'units' and 'course_grade'.
    """
    if not courses_data:
        return None, 0

    valid_courses = []
    for c in courses_data:
        try:
            grade_val = Decimal(str(c["course_grade"]))
            unit_val = Decimal(str(c["units"]))
            if unit_val > 0:
                valid_courses.append((grade_val, unit_val))
        except (ValueError, TypeError, decimal.InvalidOperation):
            continue

    if not valid_courses:
        return None, len(courses_data)

    total_units = sum(u for g, u in valid_courses)
    weighted_sum = sum(g * u for g, u in valid_courses)

    if total_units == 0:
        return None, len(courses_data)

    gwa = (weighted_sum / total_units).quantize(
        Decimal("0.0001"), rounding=ROUND_HALF_UP
    )
    return gwa, len(courses_data)
