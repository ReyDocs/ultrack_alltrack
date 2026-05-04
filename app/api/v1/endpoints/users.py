from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.schemas.user import UserUpdate, UserResponse
from app import services
import app.services.user_service as user_service

router = APIRouter()


@router.get("/me", response_model=UserResponse, summary="Get current user profile")
def get_me(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    user = user_service.get_user_by_id(current_user["user_id"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user


@router.patch("/me", response_model=UserResponse, summary="Update current user profile")
def update_me(
    body: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update the authenticated user's editable profile fields."""
    data = body.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
    updated = user_service.update_user(current_user["user_id"], data)
    return updated
