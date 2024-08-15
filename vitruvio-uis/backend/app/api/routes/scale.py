from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.connection import get_db
from backend.app.api.schemas.scale import ScaleInDB, ScaleUpdate, ScaleCreate
from backend.app.api.crud import scale as crud_scale


router = APIRouter()

@router.post("/scales/", response_model=ScaleInDB)
def create_scale(scale: ScaleCreate, db: Session = Depends(get_db)):
    return crud_scale.create_scale(db, scale)

@router.get("/scales/{scale_id}", response_model=ScaleInDB)
def read_scale(scale_id: int, db: Session = Depends(get_db)):
    db_scale = crud_scale.get_scale(db, scale_id)
    if db_scale is None:
        raise HTTPException(status_code=404, detail="Scale not found")
    return db_scale

@router.get("/scales/", response_model=List[ScaleInDB])
def read_scales(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    scales = crud_scale.get_scales(db, skip=skip, limit=limit)
    return scales

@router.put("/scales/{scale_id}", response_model=ScaleInDB)
def update_scale(scale_id: int, scale_update: ScaleUpdate, db: Session = Depends(get_db)):
    db_scale = crud_scale.update_scale(db, scale_id, scale_update)
    if db_scale is None:
        raise HTTPException(status_code=404, detail="Scale not found")
    return db_scale

@router.delete("/scales/{scale_id}", response_model=dict)
def delete_scale(scale_id: int, db: Session = Depends(get_db)):
    if crud_scale.delete_scale(db, scale_id):
        return {"ok": True}
    raise HTTPException(status_code=404, detail="Scale not found")
