from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, tasks, finances, resources, grades

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router,      prefix="/auth",      tags=["Auth"])
router.include_router(users.router,     prefix="/users",     tags=["Users"])
router.include_router(tasks.router,     prefix="/tasks",     tags=["Tasks"])
router.include_router(finances.router,  prefix="/finances",  tags=["Finances"])
router.include_router(resources.router, prefix="/resources", tags=["Resources"])
router.include_router(grades.router,    prefix="/grades",    tags=["Grades"])
