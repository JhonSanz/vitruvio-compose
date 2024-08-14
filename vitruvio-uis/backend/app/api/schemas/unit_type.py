from pydantic import BaseModel
from typing import List, Optional


class UnitTypeBase(BaseModel):
    name: str


class UnitTypeCreate(UnitTypeBase):
    pass


class UnitType(UnitTypeBase):
    id: int

    class Config:
        orm_mode = True
        
        
class UnitTypeUpdate(UnitTypeBase):
    pass


class UnitTypeInDB(UnitTypeBase):
    id: int
    units: Optional[List[int]] = None

    class Config:
        orm_mode = True