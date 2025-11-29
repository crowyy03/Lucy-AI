from fastapi import APIRouter, HTTPException
from .models import SlotsRequest, SlotsResponse, CreateRecordRequest
from .client import YclientsAPI

router = APIRouter()
yclients_api = YclientsAPI()


@router.post("/slots", response_model=SlotsResponse)
async def slots_handler(payload: SlotsRequest):
    """
    Эндпоинт для ассистента:
    ожидает { day, service_id, staff_id } и отдаёт { "slots": [...] }.
    """
    try:
        slots = await yclients_api.get_slots(
            day=payload.day,
            service_id=payload.service_id,
            staff_id=payload.staff_id,
        )
        return SlotsResponse(slots=slots)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        # Пробрасываем ошибки от YCLIENTS API с деталями
        error_msg = str(e)
        # Если это 404, возвращаем 404, иначе 502
        if "404" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=502, detail=error_msg)
    except Exception as e:
        # Логируем неожиданные ошибки
        print(f"SLOTS ERROR: {repr(e)}")
        raise HTTPException(status_code=502, detail=f"YCLIENTS slots error: {str(e)}")


@router.post("/create_record")
async def create_record_handler(payload: CreateRecordRequest):
    """
    Эндпоинт для ассистента:
    принимает удобный для тебя формат, сам собирает JSON под /book_record.
    """
    try:
        # пока берём только первую запись из appointments (один сеанс)
        appt = payload.appointments[0]

        book_record_body = {
            "phone": payload.phone,
            "fullname": payload.fullname,
            "email": payload.email,
            "type": "phone",
            "comment": "Запись через Lucy AI",
            "appointments": [
                {
                    "id": appt.id,
                    "services": appt.services,
                    "staff_id": appt.staff_id,
                    # ВАЖНО: строка из /book_times, без конвертации в datetime
                    "datetime": appt.datetime,
                }
            ],
        }

        data = await yclients_api.create_record(book_record_body)
        return data

    except RuntimeError as e:
        # Пробрасываем ошибки от YCLIENTS API с деталями
        error_msg = str(e)
        if "404" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=502, detail=error_msg)
    except Exception as e:
        # Логируем неожиданные ошибки
        print(f"CREATE_RECORD ERROR: {repr(e)}")
        raise HTTPException(status_code=502, detail=f"YCLIENTS create_record error: {str(e)}")