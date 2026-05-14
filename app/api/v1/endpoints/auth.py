from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.db.supabase import supabase
from app.services import user_service
from app.schemas.user import UserCreate
from app.core.config import settings
from fastapi.responses import RedirectResponse

router = APIRouter()

class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def sign_up(body: SignUpRequest):
    """Register a new user with email and password via Supabase Auth."""
    response = supabase.auth.sign_up({"email": body.email, "password": body.password})

    if response.user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sign-up failed.")

@router.post("/login")
def login(body: EmailLoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})

        if response.session is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

        try:
            user_service.touch_last_login(response.user.id)
        except Exception as e:
            print(f"Error updating last login: {e}")

        # Fetch user profile from our DB to get the avatar_url
        user_profile = user_service.get_user_by_id(response.user.id)
        avatar_url = user_profile.get("avatar_url") if user_profile else None

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": {
                "id": response.user.id, 
                "email": response.user.email,
                "avatar_url": avatar_url
            },
        }
    except Exception as e:
        import traceback
        import sys
        print("\n\n=== LOGIN CRASH ===", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        print("===================\n\n", file=sys.stderr)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/google")
def google_login():
    response = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {"redirect_to": f"{settings.backend_url}/api/v1/auth/google/callback"},
    })
    return {"url": response.url}

@router.get("/google/callback")
def google_callback(code: str | None = None, error: str | None = None):
    if error:
        return RedirectResponse(url=f"{settings.frontend_url}/login?error={error}")
    
    if code:
        try:
            res = supabase.auth.exchange_code_for_session({"auth_code": code})
            session = res.session
            if session:
                # Redirect to frontend callback with tokens so supabase-js can hydrate
                redirect_url = f"{settings.frontend_url}/auth/callback#access_token={session.access_token}&refresh_token={session.refresh_token}"
                return RedirectResponse(url=redirect_url)
        except Exception as e:
            print(f"OAuth code exchange failed: {e}")
            return RedirectResponse(url=f"{settings.frontend_url}/login?error=exchange_failed")

    return RedirectResponse(url=f"{settings.frontend_url}/dashboard")

@router.post("/logout")
def logout():
    """Signs the user out by invalidating the Supabase session."""
    supabase.auth.sign_out()
    return {"message": "Logged out successfully."}
