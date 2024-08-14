from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.api.crud import unit_type as crud_unit_type
from backend.app.api.schemas.unit_type import UnitType

router = APIRouter()


@router.get("/", response_model=List[UnitType])
def read_unit_type(db: Session = Depends(get_db)):
    db_unit = crud_unit_type.get_unit_types(db=db)
    return db_unit
