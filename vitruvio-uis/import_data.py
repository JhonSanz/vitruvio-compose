import pandas as pd
from sqlalchemy.exc import IntegrityError
from backend.app.database.connection import SessionLocal, engine
from backend.app.database.models import UnitType


class ImportData:
    def __init__(self) -> None:
        self.df = None
    
    def read_csv(self, *, path) -> None:
        self.df = pd.read_csv(path)
    
    def get_related_table(self, *, unit_type_name: str):
        with SessionLocal() as db:
            unit_type_found = db.query(UnitType).filter(UnitType.name == unit_type_name).first()
            if not unit_type_found:
                raise Exception(f"Type {unit_type_name} does not exist")
            self.df["unit_type_id"] = unit_type_found.id
    
    def create_data(self, *, table: str):
        with SessionLocal() as session_:
            session_.begin()
            try:
                self.df.to_sql(table, engine, if_exists="append", index=False)
            except IntegrityError as e:
                print("Integrity error", e)
                session_.rollback()
            finally:
                session_.close()


FILES = [
    { "unit_type_name": "Longitud", "create_on": "unit", "file": "data/longitud.csv" },
    # { "unit_type_name": "masa", "create_on": "unit", "file": "masa.csv" },
    # { "unit_type_name": "tiempo", "create_on": "unit", "file": "tiempo.csv" },
    # { "unit_type_name": "velocidad", "create_on": "unit", "file": "velocidad.csv" },
]

for file in FILES:
    importer_units = ImportData()
    importer_units.read_csv(path=file["file"])
    importer_units.get_related_table(unit_type_name=file["unit_type_name"])
    importer_units.create_data(table=file["create_on"])