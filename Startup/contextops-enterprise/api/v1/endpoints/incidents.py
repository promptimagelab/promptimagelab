from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_incidents():
    return [{"id": "INC001", "title": "Database connection failed", "status": "Open"}]
