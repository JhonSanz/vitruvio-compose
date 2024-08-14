from fastapi import APIRouter

from backend.app.api.routes import unit
from backend.app.api.routes import unit_type

api_router = APIRouter()

api_router.include_router(unit.router, prefix="/units", tags=["units"])
api_router.include_router(unit_type.router, prefix="/unit_type", tags=["unit_type"])