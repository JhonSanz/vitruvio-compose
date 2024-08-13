from typing import List, Optional
from fastapi import APIRouter, HTTPException
from backend.app.api.crud import relation as crud_relation
from backend.app.api.schemas.item import Item
from backend.app.api.schemas.relation import (
    RelationBase,
    RelationCreate,
    RelationUpdate,
    Relation,
    RelationGet
)

router = APIRouter()


@router.post("/")
def create_relation(relation: RelationCreate):
    created_relation = crud_relation.create_relation(relation=relation)
    if created_relation:
        return True
    else:
        raise HTTPException(status_code=500, detail="Failed to create relation")


@router.get("/", response_model=List[Item])
def get_related_nodes(origin_code: str):
    related_nodes = crud_relation.get_related_nodes(origin_code=origin_code)
    return related_nodes
