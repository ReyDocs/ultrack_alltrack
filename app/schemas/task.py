from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class TaskPriority(str, Enum):
    chill = "Chill"
    moderate = "Moderate"
    critical = "Critical"


class TaskCreate(BaseModel):
    title: str
    priority: TaskPriority = TaskPriority.moderate


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    priority: Optional[TaskPriority] = None
    model_config = {
        "json_schema_extra": {
            "example": {}
        }
    }


class TaskResponse(BaseModel):
    task_id: str
    user_id: str
    title: str
    priority: str
    created_at: datetime
    updated_at: datetime
