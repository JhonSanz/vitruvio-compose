from pydantic import BaseModel


class EntityBase(BaseModel):
    name: str


class EntityCreate(EntityBase):
    pass


class EntityUpdate(EntityBase):
    pass


class Entity(EntityBase):
    class Config:
        orm_mode = True
