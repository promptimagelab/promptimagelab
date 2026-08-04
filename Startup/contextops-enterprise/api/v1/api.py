from fastapi import APIRouter
from .endpoints import incidents

api_router = APIRouter()
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
