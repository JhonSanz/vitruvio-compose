import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from collections.abc import Generator
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./my_database.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session