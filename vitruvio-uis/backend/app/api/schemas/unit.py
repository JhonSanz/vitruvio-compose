from pydantic import BaseModel


class UnitBase(BaseModel):
    name: str
    symbol: str


class UnitCreate(UnitBase):
    pass


class Unit(UnitBase):
    id: int

    class Config:
        orm_mode = True