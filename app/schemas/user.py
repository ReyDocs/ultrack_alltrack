from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    auth_provider: str = "email"
    provider_id: str
    email_verified: bool = False

class UserUpdate(BaseModel):
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    auth_provider: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True