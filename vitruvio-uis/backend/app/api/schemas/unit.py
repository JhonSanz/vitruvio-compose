from pydantic import BaseModel


class UnitBase(BaseModel):
    name: str
    symbol: str
    unit_type_id: int


class UnitCreate(UnitBase):
    pass


class UnitUpdate(UnitBase):
    pass


class UnitInDB(UnitBase):
    id: int

    class Config:
        orm_mode = True
