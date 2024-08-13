from sqlalchemy.orm import Session
from backend.app.database.models import Unit


def get_unit(*, db: Session, unit_id: int):
    return db.query(Unit).filter(Unit.id == unit_id).first()
