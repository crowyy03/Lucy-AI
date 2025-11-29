from fastapi import APIRouter, Depends
from .models import SlotsRequest, SlotsResponse, CreateRecordRequest
from .client import YclientsAPI
from .deps import get_yclients_api

router = APIRouter(prefix="/yclients", tags=["yclients"])


@router.post("/slots", response_model=SlotsResponse, summary="Получить свободные слоты")
async def slots_handler(
    payload: SlotsRequest,
    api: YclientsAPI = Depends(get_yclients_api),
) -> SlotsResponse:
    result = await api.get_slots(payload)
    return SlotsResponse(slots=result["slots"])


@router.post("/create_record", summary="Создать запись в YCLIENTS")
async def create_record_handler(
    payload: CreateRecordRequest,
    api: YclientsAPI = Depends(get_yclients_api),
):
    result = await api.create_record(payload.model_dump())
    return result