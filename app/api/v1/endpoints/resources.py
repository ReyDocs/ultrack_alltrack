from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse
import app.services.resource_service as resource_service
from typing import List

router = APIRouter()


@router.get("/", response_model=List[ResourceResponse], summary="List saved resources")
def list_resources(current_user: dict = Depends(get_current_user)):
    """Return all saved resources (Resource Vault) for the authenticated user."""
    return resource_service.get_all_resources(current_user["user_id"])


@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED, summary="Save a resource")
def create_resource(
    body: ResourceCreate,
    current_user: dict = Depends(get_current_user),
):
    """Save a new link or resource for the authenticated user."""
    data = body.model_dump()
    return resource_service.create_resource(current_user["user_id"], body)


@router.get("/{resource_id}", response_model=ResourceResponse, summary="Get a resource")
def get_resource(resource_id: str, current_user: dict = Depends(get_current_user)):
    """Return a single saved resource owned by the authenticated user."""
    resource = resource_service.get_resource(resource_id, current_user["user_id"])
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found.")
    return resource


@router.patch("/{resource_id}", response_model=ResourceResponse, summary="Update a resource")
def update_resource(
    resource_id: str,
    body: ResourceUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update a saved resource owned by the authenticated user."""
    resource = resource_service.get_resource(resource_id, current_user["user_id"])
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found.")
    payload = body.model_dump(exclude_none=True)
    return resource_service.update_resource(resource_id, current_user["user_id"], payload)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a resource")
def delete_resource(resource_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a saved resource owned by the authenticated user."""
    resource = resource_service.get_resource(resource_id, current_user["user_id"])
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found.")
    resource_service.delete_resource(resource_id, current_user["user_id"])
