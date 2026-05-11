from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class ResourceCreate(BaseModel):
    url_links: HttpUrl


class ResourceUpdate(BaseModel):
    url_links: Optional[HttpUrl] = None


class ResourceResponse(BaseModel):
    resource_id: str
    user_id: str
    url_links: str
    created_at: datetime
