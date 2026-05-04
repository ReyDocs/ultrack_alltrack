from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
import app.services.task_service as task_service
from typing import List

router = APIRouter()


@router.get("/", response_model=List[TaskResponse], summary="List all tasks")
def list_tasks(current_user: dict = Depends(get_current_user)):
    """Return all tasks for the authenticated user."""
    return task_service.get_all_tasks(current_user["user_id"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, summary="Create a task")
def create_task(
    body: TaskCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a new task for the authenticated user."""
    data = body.model_dump()
    return task_service.create_task(current_user["user_id"], body)


@router.get("/{task_id}", response_model=TaskResponse, summary="Get a single task")
def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Return a specific task owned by the authenticated user."""
    task = task_service.get_task(task_id, current_user["user_id"])
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    return task


@router.patch("/{task_id}", response_model=TaskResponse, summary="Update a task")
def update_task(
    task_id: str,
    body: TaskUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update fields of a task owned by the authenticated user."""
    task = task_service.get_task(task_id, current_user["user_id"])
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    data = body.model_dump(exclude_none=True)
    return task_service.update_task(task_id, current_user["user_id"], body)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a task owned by the authenticated user."""
    task = task_service.get_task(task_id, current_user["user_id"])
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    task_service.delete_task(task_id, current_user["user_id"])
