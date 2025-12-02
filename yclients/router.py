from fastapi import APIRouter, Depends
from .deps import get_yclients_api
from .models import SlotsRequest, CreateRecordRequest
from .client import YclientsAPI

router = APIRouter(prefix="/yclients", tags=["yclients"])


@router.post("/slots")
async def slots_handler(
    payload: SlotsRequest,
    api: YclientsAPI = Depends(get_yclients_api),
):
    return await api.get_slots(payload)


@router.post("/create_record")
async def create_record_handler(
    payload: CreateRecordRequest,
    api: YclientsAPI = Depends(get_yclients_api),
):
    return await api.create_record(payload)