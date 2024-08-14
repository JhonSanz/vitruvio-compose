from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.api.crud import unit_type as crud_unit_type
from backend.app.api.schemas.unit_type import UnitType, UnitTypeInDB, UnitTypeCreate, UnitTypeUpdate

router = APIRouter()


@router.post("/", response_model=UnitTypeInDB)
def create_unit_type(unit_type: UnitTypeCreate, db: Session = Depends(get_db)):
    return crud_unit_type.create_unit_type(db=db, unit_type=unit_type)

@router.get("/{unit_type_id}", response_model=UnitTypeInDB)
def read_unit_type(unit_type_id: int, db: Session = Depends(get_db)):
    db_unit_type = crud_unit_type.get_unit_type(db=db, unit_type_id=unit_type_id)
    if db_unit_type is None:
        raise HTTPException(status_code=404, detail="UnitType not found")
    return db_unit_type

@router.get("/", response_model=List[UnitTypeInDB])
def read_unit_types(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_unit_type.get_unit_types(db=db, skip=skip, limit=limit)

@router.put("/{unit_type_id}", response_model=UnitTypeInDB)
def update_unit_type(unit_type_id: int, unit_type: UnitTypeUpdate, db: Session = Depends(get_db)):
    db_unit_type = crud_unit_type.update_unit_type(db=db, unit_type_id=unit_type_id, unit_type=unit_type)
    if db_unit_type is None:
        raise HTTPException(status_code=404, detail="UnitType not found")
    return db_unit_type

@router.delete("/{unit_type_id}", response_model=UnitTypeInDB)
def delete_unit_type(unit_type_id: int, db: Session = Depends(get_db)):
    db_unit_type = crud_unit_type.delete_unit_type(db=db, unit_type_id=unit_type_id)
    if db_unit_type is None:
        raise HTTPException(status_code=404, detail="UnitType not found")
    return db_unit_type