from sqlalchemy import (
    Integer,
    String,
    Float,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import relationship, mapped_column, relationship, Mapped
from typing import List
from .connection import Base


class UnitType(Base):
    __tablename__ = "unit_type"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    unit: Mapped[List["Unit"]] = relationship(back_populates="unit_type")
    scale: Mapped[List["Scale"]] = relationship(back_populates="unit_type")
    

class Unit(Base):
    __tablename__ = "unit"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    symbol: Mapped[str] = mapped_column(String(100))
    unit_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("unit_type.id"))
    unit_type: Mapped["UnitType"] = relationship("UnitType", back_populates="unit")


class Scale(Base):
    __tablename__ = "scale"
    id: Mapped[int] = mapped_column(primary_key=True)
    value: Mapped[str] = mapped_column(String(100))
    order: Mapped[int] = mapped_column(Integer)
    unit_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("unit_type.id"))
    unit_type: Mapped["UnitType"] = relationship("UnitType", back_populates="scale")
