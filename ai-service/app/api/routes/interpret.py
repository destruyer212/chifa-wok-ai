from fastapi import APIRouter
from app.chains.interpreter import interpretar as _interpretar
from app.schemas.voice import InterpretRequest, InterpretResponse

router = APIRouter(tags=["interpret"])


@router.post("/interpretar", response_model=InterpretResponse, response_model_by_alias=True)
def interpretar(req: InterpretRequest) -> InterpretResponse:
    '''Recibe la transcripcion + la carta y devuelve intencion, items y texto para TTS.'''
    return _interpretar(req)
