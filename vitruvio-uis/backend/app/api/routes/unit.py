from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.api.crud import unit as crud_unit
from backend.app.api.schemas.unit import Unit, UnitCreate

router = APIRouter()


@router.get("/{unit_id}", response_model=Unit)
def read_unit(unit_id: int, db: Session = Depends(get_db)):
    db_unit = crud_unit.get_unit(db=db, unit_id=unit_id)
    if db_unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return db_unit


@router.get("/{unit_type_id}", response_model=Unit)
def get_unit_by_type(unit_type_id: int, db: Session = Depends(get_db)):
    db_units = crud_unit.get_units_by_type(db=db, unit_type_id=unit_type_id)
    return db_units
