import pandas as pd
from sqlalchemy.exc import IntegrityError
from sqlalchemy import MetaData, Table
from app.database.connection import SessionLocal, engine
from app.database.models import UnitType


class ImportData:
    def __init__(self) -> None:
        self.df = None
    
    def read_csv(self, *, path) -> None:
        self.df = pd.read_csv(path)
    
    def get_related_table(self, *, unit_type_name: str):
        with SessionLocal() as db:
            unit_type_found = db.query(UnitType).filter(UnitType.name == unit_type_name).first()
            if not unit_type_found:
                print(f"Type {unit_type_name} does not exist and will be created")
                new_unit_type = UnitType(name=unit_type_name)
                db.add(new_unit_type)
                db.commit()
                unit_type_found = new_unit_type
            self.df["unit_type_id"] = unit_type_found.id
    
    @staticmethod
    def reset_table(*, table: str):
        metadata = MetaData()
        with SessionLocal() as session_:
            table_found = Table(table, metadata, autoload_with=engine)
            session_.execute(table_found.delete())
            session_.commit()
        
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
    { "unit_type_name": "Unidades visuales", "create_on": "scale", "file": "data/visual.csv" },
    # { "unit_type_name": "tiempo", "create_on": "unit", "file": "tiempo.csv" },
    # { "unit_type_name": "velocidad", "create_on": "unit", "file": "velocidad.csv" },
]

ImportData.reset_table(table="unit")
ImportData.reset_table(table="scale")
for file in FILES:
    importer_units = ImportData()
    importer_units.read_csv(path=file["file"])
    importer_units.get_related_table(unit_type_name=file["unit_type_name"])
    importer_units.create_data(table=file["create_on"])