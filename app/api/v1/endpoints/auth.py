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
    first_name: str | None = None
    last_name: str | None = None

@router.post("/signup")
def sign_up(body: SignUpRequest):
    """Register a new user with email and password via Supabase Auth."""
    response = supabase.auth.sign_up({"email": body.email, "password": body.password})

    if response.user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sign-up failed.")

@router.post("/login")
def login(body: EmailLoginRequest):
    """Sign in with email and password. Returns Supabase session tokens."""
    response = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})

    if response.session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    try:
        user_service.touch_last_login(response.user.id)
    except Exception as e:
        print(f"Error updating last login: {e}")

    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": {"id": response.user.id, "email": response.user.email},
    }

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
    return RedirectResponse(url=f"{settings.frontend_url}/dashboard")

@router.post("/logout")
def logout():
    """Signs the user out by invalidating the Supabase session."""
    supabase.auth.sign_out()
    return {"message": "Logged out successfully."}
