from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from app.core.auth import get_current_user
from app.schemas.user import UserUpdate, UserResponse
from app import services
import app.services.user_service as user_service

router = APIRouter()


@router.get("/me", response_model=UserResponse, summary="Get current user profile")
def get_me(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile. Syncs with Supabase Auth if needed."""
    user = user_service.get_user_by_id(current_user["user_id"])
    
    if not user:
        # Strategy A: Auto-create user record on first visit/login
        # Pull avatar from metadata if it exists (Google Auth)
        metadata = current_user.get("user_metadata") or {}
        avatar_url = metadata.get("avatar_url") or metadata.get("picture")
        
        from app.schemas.user import UserCreate
        new_user = UserCreate(
            email=current_user["email"],
            auth_provider="google" if "google" in current_user["email"] else "email", # Simple heuristic
            provider_id=current_user["user_id"],
            avatar_url=avatar_url
        )
        # We need a way to pass the ID to create_user or ensure it uses the same ID
        # Let's check user_service.create_user
        user = user_service.create_user_with_id(current_user["user_id"], new_user)
        
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


@router.post("/me/avatar", summary="Upload a new profile avatar")
async def upload_my_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload an image to Supabase Storage and set it as the user's avatar."""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image."
        )

    # Read file content
    content = await file.read()

    try:
        public_url = user_service.upload_avatar(
            user_id=current_user["user_id"],
            file_content=content,
            filename=file.filename,
            content_type=file.content_type
        )
        return {"avatar_url": public_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {str(e)}"
        )
