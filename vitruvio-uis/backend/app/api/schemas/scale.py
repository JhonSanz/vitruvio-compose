from pydantic import BaseModel
from typing import Optional

class ScaleBase(BaseModel):
    value: str
    order: int
    unit_type_id: int

class ScaleCreate(ScaleBase):
    pass

class ScaleUpdate(BaseModel):
    value: Optional[str] = None
    order: Optional[int] = None
    unit_type_id: Optional[int] = None

class ScaleInDB(ScaleBase):
    id: int

    class Config:
        orm_mode = True
