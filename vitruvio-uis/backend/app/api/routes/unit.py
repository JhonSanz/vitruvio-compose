from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.api.crud import unit as crud_unit
from backend.app.api.schemas.unit import UnitBase, UnitCreate, UnitInDB, UnitUpdate

router = APIRouter()


@router.get("/unit_by_type/{unit_type_id}", response_model=List[UnitBase])
def get_unit_by_type(unit_type_id: int, db: Session = Depends(get_db)):
    """ test
    """
    db_units = crud_unit.get_units_by_type(db=db, unit_type_id=unit_type_id)
    return db_units

@router.post("/units/", response_model=UnitInDB)
def create_unit(unit: UnitCreate, db: Session = Depends(get_db)):
    return crud_unit.create_unit(db=db, unit=unit)

@router.get("/units/{unit_id}", response_model=UnitInDB)
def read_unit(unit_id: int, db: Session = Depends(get_db)):
    db_unit = crud_unit.get_unit(db=db, unit_id=unit_id)
    if db_unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return db_unit

@router.get("/units/", response_model=List[UnitInDB])
def read_units(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_unit.get_units(db=db, skip=skip, limit=limit)

@router.put("/units/{unit_id}", response_model=UnitInDB)
def update_unit(unit_id: int, unit: UnitUpdate, db: Session = Depends(get_db)):
    db_unit = crud_unit.update_unit(db=db, unit_id=unit_id, unit=unit)
    if db_unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return db_unit

@router.delete("/units/{unit_id}", response_model=UnitInDB)
def delete_unit(unit_id: int, db: Session = Depends(get_db)):
    db_unit = crud_unit.delete_unit(db=db, unit_id=unit_id)
    if db_unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return db_unit
