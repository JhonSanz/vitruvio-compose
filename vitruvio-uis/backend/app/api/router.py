from fastapi import APIRouter

from backend.app.api.routes import unit

api_router = APIRouter()

api_router.include_router(unit.router, prefix="/units", tags=["units"])