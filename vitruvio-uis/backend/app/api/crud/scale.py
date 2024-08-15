from sqlalchemy.orm import Session
from backend.app.database.models import Scale
from backend.app.api.schemas.scale import ScaleCreate, ScaleUpdate


def get_scales_by_type(*, db: Session, unit_type_id: int):
    return db.query(Scale).filter(Scale.unit_type_id == unit_type_id).all()

def create_scale(db: Session, scale: ScaleCreate) -> Scale:
    db_scale = Scale(**scale.dict())
    db.add(db_scale)
    db.commit()
    db.refresh(db_scale)
    return db_scale

def get_scale(db: Session, scale_id: int) -> Scale:
    return db.query(Scale).filter(Scale.id == scale_id).first()

def get_scales(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Scale).order_by(Scale.order).offset(skip).limit(limit).all()

def update_scale(db: Session, scale_id: int, scale_update: ScaleUpdate) -> Scale:
    db_scale = db.query(Scale).filter(Scale.id == scale_id).first()
    if db_scale:
        for key, value in scale_update.dict(exclude_unset=True).items():
            setattr(db_scale, key, value)
        db.commit()
        db.refresh(db_scale)
    return db_scale

def delete_scale(db: Session, scale_id: int) -> bool:
    db_scale = db.query(Scale).filter(Scale.id == scale_id).first()
    if db_scale:
        db.delete(db_scale)
        db.commit()
        return True
    return False
