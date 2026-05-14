from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class ResourceCreate(BaseModel):
    url_links: HttpUrl
    resource_title: Optional[str] = None


class ResourceUpdate(BaseModel):
    url_links: Optional[HttpUrl] = None
    resource_title: Optional[str] = None


class ResourceResponse(BaseModel):
    resource_id: str
    user_id: str
    url_links: str
    resource_title: Optional[str] = None
    created_at: datetime
