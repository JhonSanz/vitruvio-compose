from typing import List
from fastapi import APIRouter, HTTPException
from backend.app.api.crud import entity as crud_entity
from backend.app.api.schemas.entity import (
    EntityBase,
    EntityCreate,
    EntityUpdate,
    Entity,
)

router = APIRouter()


@router.get("/", response_model=List[Entity])
def get_entities(skip: int = 0, limit: int = 10):
    entities = crud_entity.get_entities(skip=skip, limit=limit)
    return entities
