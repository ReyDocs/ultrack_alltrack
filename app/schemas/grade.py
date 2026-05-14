from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class CourseCreate(BaseModel):
    course_code: str          # e.g. "CMSC 126"
    units: Decimal            # Range: 0.25–10
    course_grade: Decimal     # e.g. 1.0, 1.25, 2.5, 3.0, 5.0


class CourseUpdate(BaseModel):
    course_code: Optional[str] = None
    units: Optional[Decimal] = None
    course_grade: Optional[Decimal] = None
    model_config = {
        "json_schema_extra": {
            "example": {}
        }
    }


class CourseResponse(BaseModel):
    id: str
    user_id: str
    course_code: str
    units: Decimal
    course_grade: Decimal


class GWAResponse(BaseModel):
    gwa: Optional[Decimal]   # None if no courses yet
    course_count: int


class GWAComputeItem(BaseModel):
    course_code: Optional[str] = ""
    units: Decimal
    course_grade: Decimal


class GWAComputeRequest(BaseModel):
    courses: list[GWAComputeItem]
