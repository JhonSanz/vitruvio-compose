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


class Unit(Base):
    __tablename__ = "Unit"
    id: Mapped[int] = mapped_column(primary_key=True)
