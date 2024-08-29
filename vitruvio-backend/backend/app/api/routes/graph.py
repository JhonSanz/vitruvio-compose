from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.app.api.crud import graph as crud_graph
from backend.app.api.schemas.graph import (
    DataModel,
    DataInsumos,
    NodeUpdateRelations,
    NodeDelete,
    NodeFiltering,
    Direction
)
from backend.app.api.crud.item import Item


router = APIRouter()


@router.post("/")
def receive_data(data_model: DataModel):
    try:
        crud_graph.create_graph(data_model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create graph {e}")


@router.get("/", response_model=List[Item])
def get_items(direction: str | None = None):
    items = crud_graph.show_nodes(direction="")
    return items


@router.get("/node-children", response_model=List[Item])
def get_node_children(node_code: str, direction: Direction):
    return crud_graph.get_node_children(code=node_code, direction=direction)


@router.get("/node-incoming-edges")
def get_node_incoming_edges(node_code: str):
    return crud_graph.get_node_incoming_edges(code=node_code)


@router.post("/insumo")
def create_insumo(data_model: DataInsumos):
    try:
        return crud_graph.create_insumo(data_model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create graph {e}")


@router.post("/update-node-relations")
def update_node_relations(data_model: NodeUpdateRelations):
    try:
        crud_graph.update_node_relations(data_model=data_model)
        return 200
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create graph {e}")



@router.post("/delete-node")
def delete_node(data_model: NodeDelete):
    items = crud_graph.delete_node(node_code=data_model.node_code)
    return items


@router.get("/filter-nodes")
def filter_nodes(
    label: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    param_name: Optional[str] = Query(None),
    param_value: Optional[str] = Query(None),
):
    params = NodeFiltering(label=label, name=name, param_name=param_name, param_value=param_value)
    return crud_graph.filter_nodes(params=params)
