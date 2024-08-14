from sqlalchemy.orm import Session
from backend.app.database.models import Unit


def get_unit(*, db: Session, unit_id: int):
    return db.query(Unit).filter(Unit.id == unit_id).first()


def get_units_by_type(*, db: Session, unit_type_id: int):
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
