from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ResourceCreate(BaseModel):
    source_title: Optional[str] = None   # URL or title of the resource
    user_notes: Optional[str] = None


class ResourceUpdate(BaseModel):
    source_title: Optional[str] = None
    user_notes: Optional[str] = None


class ResourceResponse(BaseModel):
    resource_id: str
    user_id: str
    source_title: Optional[str] = None
    user_notes: Optional[str] = None
    created_at: datetime
