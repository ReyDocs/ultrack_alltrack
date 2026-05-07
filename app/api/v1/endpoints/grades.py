from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.schemas.grade import CourseCreate, CourseUpdate, CourseResponse, GWAResponse
import app.services.grade_service as grade_service
from typing import List

router = APIRouter()


@router.get("/", response_model=List[CourseResponse], summary="List all courses")
def list_courses(current_user: dict = Depends(get_current_user)):
    """Return all course entries for the authenticated user."""
    return grade_service.get_all_courses(current_user["user_id"])


@router.get("/gwa", response_model=GWAResponse, summary="Compute GWA")
def get_gwa(current_user: dict = Depends(get_current_user)):
    """
    Compute and return the UP GWA using the weighted average formula:
        GWA = Σ(grade × units) / Σ(units)
    """
    gwa, count = grade_service.calculate_gwa(current_user["user_id"])
    return {"gwa": gwa, "course_count": count}


@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED, summary="Add a course")
def create_course(
    body: CourseCreate,
    current_user: dict = Depends(get_current_user),
):
    """Add a course entry for the authenticated user."""
    data = body.model_dump()
    return grade_service.create_course(current_user["user_id"], body)


@router.get("/{course_id}", response_model=CourseResponse, summary="Get a course")
def get_course(course_id: str, current_user: dict = Depends(get_current_user)):
    """Return a single course entry owned by the authenticated user."""
    course = grade_service.get_course(course_id, current_user["user_id"])
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
    return course


@router.patch("/{course_id}", response_model=CourseResponse, summary="Update a course")
def update_course(
    course_id: str,
    body: CourseUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update a course entry owned by the authenticated user."""
    course = grade_service.get_course(course_id, current_user["user_id"])
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
    payload = body.model_dump(exclude_none=True)
    return grade_service.update_course(course_id, current_user["user_id"], payload)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a course")
def delete_course(course_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a course entry owned by the authenticated user."""
    course = grade_service.get_course(course_id, current_user["user_id"])
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
    grade_service.delete_course(course_id, current_user["user_id"])
