from typing import List, Optional
from fastapi import APIRouter, HTTPException
from backend.app.api.crud import item as crud_item
from backend.app.api.schemas.item import (
    ItemBase,
    ItemCreate,
    ItemUpdate,
    Item,
)

router = APIRouter()


# @router.get("/{item_id}", response_model=Item)
# def get_item(item_label: str, item_id: str):
#     try:
#         item = crud_item.get_item(item_id=item_id, item_label=item_label)
#         if not item:
#             raise HTTPException(status_code=404, detail=f"Item with ID {item_id} not found for type {item_label}")
#         return item
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to fetch item: {str(e)}")



@router.get("/by_code", response_model=List[Item])
def get_items_by_code_or_name(item_label: str = "", item_id: str = ""):
    try:
        item = crud_item.get_items_by_code_or_name(item_id=item_id, item_name=item_label)
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch item: {str(e)}")


@router.get("/", response_model=List[Item])
def get_items(entity: str, code: str | None = None):
    items = crud_item.get_items(entity=entity, code=code)
    return items


# @router.post("/", response_model=Item)
# def create_item(item: ItemCreate):
#     created_item = crud_item.create_item(item=item)
#     if created_item:
#         return created_item
#     else:
#         raise HTTPException(status_code=500, detail="Failed to create item")


# @router.delete("/{item_id}", response_model=bool)
# def delete_item(item_id: int):
#     success = crud_item.delete_item(item_id=item_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return success
