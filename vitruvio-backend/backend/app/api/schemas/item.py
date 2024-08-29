from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class ItemBase(BaseModel):
    labels: List[str]
    properties: Dict[str, Any]
    is_leaf: Optional[bool] = None


class ItemCreate(BaseModel):
    label: str
    code: str
    name: str | None
    properties: Dict[str, Any]


class ItemUpdate(ItemBase):
    pass


class Item(ItemBase):
    class Config:
        orm_mode = True
