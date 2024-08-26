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
    type: List[str]
    nodeParams: List[ParamsSchema]
    nodeRelations: List[RelationsSchema] | None


class NodeDetails(BaseModel):
    name: str
    value: str


class NodeUpdateRelations(BaseModel):
    node: str
    details: List[NodeDetails] | None
    labels: List[str] | None
    relations: List[RelationsSchema] | None


class NodeDelete(BaseModel):
    node_code: str


class NodeFiltering(BaseModel):
    label: str | None
    name: str | None
    param_name: str | None
    param_value: str | None
