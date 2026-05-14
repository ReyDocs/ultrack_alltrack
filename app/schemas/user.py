from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from decimal import Decimal

class UserCreate(BaseModel):
    email: EmailStr
    auth_provider: str = "email"
    provider_id: str
    email_verified: bool = False
    avatar_url: Optional[str] = None
    username: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    base_balance: Optional[Decimal] = None
    model_config = {
        "json_schema_extra": {
            "example": {}
        }
    }

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    auth_provider: str
    created_at: datetime
    avatar_url: Optional[str] = None
    last_login: Optional[datetime] = None
    username: Optional[str] = None
    base_balance: Optional[Decimal] = None

    class Config:
        from_attributes = True