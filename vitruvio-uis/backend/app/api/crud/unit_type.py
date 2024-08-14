from sqlalchemy.orm import Session
# from backend.app.database.models import Unit


def get_unit_types(*, db: Session):
    # return db.query(Unit).filter(Unit.id == unit_id).first()
    return [
        { "id": 1, "name": "Longitud" },
        { "id": 2, "name": "Masa" },
        { "id": 3, "name": "Tiempo" },
    ]
