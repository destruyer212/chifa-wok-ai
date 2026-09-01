from fastapi import APIRouter
from app.core.llm import nombre_modelo

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {"status": "ok", "modelo": nombre_modelo()}
