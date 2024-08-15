from sqlalchemy.orm import Session
# from backend.app.database.models import Unit
from backend.app.database.models import UnitType
from backend.app.api.schemas.unit_type import UnitTypeCreate, UnitTypeUpdate



def get_unit_type(db: Session, unit_type_id: int):
    return db.query(UnitType).filter(UnitType.id == unit_type_id).first()

def get_unit_types(db: Session, filter_by: bool, skip: int = 0, limit: int = 10):
    if filter_by:
        return db.query(UnitType).filter(
            UnitType.unit.any()  
        ).offset(skip).limit(limit).all()

    return db.query(UnitType).filter(
        UnitType.scale.any()  
    ).offset(skip).limit(limit).all()

def create_unit_type(db: Session, unit_type: UnitTypeCreate):
    db_unit_type = UnitType(name=unit_type.name)
    db.add(db_unit_type)
    db.commit()
    db.refresh(db_unit_type)
    return db_unit_type

def update_unit_type(db: Session, unit_type_id: int, unit_type: UnitTypeUpdate):
    db_unit_type = db.query(UnitType).filter(UnitType.id == unit_type_id).first()
    if db_unit_type:
        db_unit_type.name = unit_type.name
        db.commit()
        db.refresh(db_unit_type)
    return db_unit_type

def delete_unit_type(db: Session, unit_type_id: int):
    db_unit_type = db.query(UnitType).filter(UnitType.id == unit_type_id).first()
    if db_unit_type:
        db.delete(db_unit_type)
        db.commit()
    return db_unit_type
