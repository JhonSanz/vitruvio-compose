from pydantic import BaseModel
from typing import Any, Dict, List
from backend.app.api.schemas.graph import ParamsSchema


class RelationBase(BaseModel):
    name: str
    

class RelationGet(BaseModel):
    origin_code: str


class RelationCreate(BaseModel):
    relation_name: str
    origin_code: str
    origin_label: str
    target_label: str
    target_code: str
    properties: Dict[str, Any]


class RelationCreateInsumo(BaseModel):
    relation_name: str
    origin_code: str
    target_code: str
    properties: List[ParamsSchema]


class RelationUpdate(RelationBase):
    pass


class Relation(RelationBase):
    class Config:
        orm_mode = True
