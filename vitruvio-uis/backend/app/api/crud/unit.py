from sqlalchemy.orm import Session
from backend.app.database.models import Unit
from backend.app.api.schemas.unit import UnitCreate, UnitUpdate


def get_units_by_type(*, db: Session, unit_type_id: int):
    return db.query(Unit).filter(Unit.unit_type_id == unit_type_id).all()
  
    if (unit_type_id == 1):
      return [
        { "id": 1, "name": "metro", "symbol": "m" },
        { "id": 2, "name": "decimetro", "symbol": "dm" },
        { "id": 3, "name": "kilometro", "symbol": "km" },
      ]

    if (unit_type_id == 2):
      return [
        { "id": 4, "name": "gramo", "symbol": "g" },
        { "id": 5, "name": "decigramo", "symbol": "dg" },
        { "id": 6, "name": "kilogramo", "symbol": "kg" },
      ]

    if (unit_type_id == 3):
      return [
        { "id": 7, "name": "milisegundo", "symbol": "ms" },
        { "id": 8, "name": "segundo", "symbol": "s" },
        { "id": 9, "name": "microsegundo", "symbol": "μs" },
      ]


def get_unit(db: Session, unit_id: int):
    return db.query(Unit).filter(Unit.id == unit_id).first()

def get_units(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Unit).offset(skip).limit(limit).all()

def create_unit(db: Session, unit: UnitCreate):
    db_unit = Unit(
        name=unit.name,
        symbol=unit.symbol,
        unit_type_id=unit.unit_type_id
    )
    db.add(db_unit)
    db.commit()
    db.refresh(db_unit)
    return db_unit

def update_unit(db: Session, unit_id: int, unit: UnitUpdate):
    db_unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if db_unit:
        db_unit.name = unit.name
        db_unit.symbol = unit.symbol
        db_unit.unit_type_id = unit.unit_type_id
        db.commit()
        db.refresh(db_unit)
    return db_unit

def delete_unit(db: Session, unit_id: int):
    db_unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if db_unit:
        db.delete(db_unit)
        db.commit()
    return db_unit