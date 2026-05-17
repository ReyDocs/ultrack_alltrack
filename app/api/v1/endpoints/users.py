from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from app.core.auth import get_current_user
from app.schemas.user import UserUpdate, UserResponse
from app import services
import app.services.user_service as user_service

router = APIRouter()


@router.get("/me", response_model=UserResponse, summary="Get current user profile")
def get_me(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile. Syncs with Supabase Auth if needed."""
    try:
        print(f"DEBUG: current_user = {current_user}")
        user = user_service.get_user_by_id(current_user["user_id"])
        print(f"DEBUG: user from DB = {user}")
        
        if not user:
            # Pull avatar from metadata if it exists (Google Auth)
            metadata = current_user.get("user_metadata") or {}
            avatar_url = metadata.get("avatar_url") or metadata.get("picture")
            name = metadata.get("name") or metadata.get("full_name") or current_user["email"].split('@')[0]
            provider = metadata.get("provider") or "email"
            print(f"DEBUG: metadata = {metadata}, avatar_url = {avatar_url}, name = {name}, provider = {provider}")
            
            from app.schemas.user import UserCreate
            new_user = UserCreate(
                email=current_user["email"],
                auth_provider=provider,
                provider_id=current_user["user_id"],
                avatar_url=avatar_url,
                username=name,
                base_balance=0
            )
            print(f"DEBUG: creating user with data = {new_user.model_dump()}")
            user = user_service.create_user_with_id(current_user["user_id"], new_user)
            print(f"DEBUG: created user = {user}")
            
        return user
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"DEBUG: Exception in /me: {e}\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e) + "\n" + error_trace)


@router.patch("/me", response_model=UserResponse, summary="Update current user profile")
def update_me(
    body: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update the authenticated user's editable profile fields."""
    data = body.model_dump(exclude_unset=True)
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
