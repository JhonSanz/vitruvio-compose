from typing import List, Optional
from pydantic import BaseModel



class DataEntry(BaseModel):
    name: str
    data: List[dict]


class DataModel(BaseModel):
    data: List[DataEntry]


# ---

 
class ParamsSchema(BaseModel):
    name: str
    value: str


class RelationsSchema(BaseModel):
    related: str
    params: List[ParamsSchema]
    

class DataInsumos(BaseModel):
    name: str
    code: str
    type: str
    nodeParams: List[ParamsSchema]
    nodeRelations: List[RelationsSchema] | None


class NodeUpdateRelations(BaseModel):
    node: str
    relations: List[RelationsSchema] | None


class NodeDelete(BaseModel):
    node_code: str
