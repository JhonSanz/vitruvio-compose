from pydantic import BaseModel


class UnitTypeBase(BaseModel):
    name: str


class UnitTypeCreate(UnitTypeBase):
    pass


class UnitType(UnitTypeBase):
    id: int

    class Config:
        orm_mode = True