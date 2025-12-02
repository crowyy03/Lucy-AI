# YCLIENTS/yclients/client.py

from typing import Any, Dict, List

import httpx
from fastapi import HTTPException

from YCLIENTS.app.config import settings
from .models import SlotsRequest
from .mappings import SERVICE_MAP, STAFF_MAP


class YclientsAPI:
    def __init__(self) -> None:
        # базовый URL и компания
        self.base_url = settings.YCLIENTS_BASE_URL.rstrip("/")  # типа https://api.yclients.com/api/v1
        self.company_id = settings.YCLIENTS_COMPANY_ID          # 1641078

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": (
                f"Bearer {settings.YCLIENTS_PARTNER_TOKEN}, "
                f"User {settings.YCLIENTS_USER_TOKEN}"
            ),
            "Accept": "application/vnd.yclients.v2+json",
            "Content-Type": "application/json",
        }

    # ========= СЛОТЫ =========
    async def get_slots(self, payload: SlotsRequest) -> Dict[str, Any]:
        try:
            print("SLOTS REQUEST BODY:", payload.model_dump())

            if payload.service_id not in SERVICE_MAP:
                raise HTTPException(status_code=400, detail="Unknown service_id")
            if payload.staff_id not in STAFF_MAP:
                raise HTTPException(status_code=400, detail="Unknown staff_id")

            y_service_id = SERVICE_MAP[payload.service_id]
            y_staff_id = STAFF_MAP[payload.staff_id]

            # ВАЖНО: путь как в письме поддержки
            # /book_times/{company_id}/{staff_id}/{date}
            url = (
                f"{self.base_url}/book_times/"
                f"{self.company_id}/{y_staff_id}/{payload.day}"
            )

            # service_id передаём как параметр (если нужно фильтровать по услуге)
            params = {"service_id": y_service_id}

            async with httpx.AsyncClient(timeout=settings.HTTPX_TIMEOUT) as client:
                resp = await client.get(url, params=params, headers=self._headers())

            print("SLOTS RAW RESPONSE:", resp.status_code, resp.text)

            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)

            data = resp.json()
            slots = [t["time"] for t in data.get("data", [])]

            return {"slots": slots}

        except HTTPException:
            raise
        except Exception as e:
            print("SLOTS ERROR:", repr(e))
            raise HTTPException(status_code=400, detail=f"YCLIENTS slots error: {e}")

    # ========= СОЗДАНИЕ ЗАПИСИ =========
    async def create_record(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ожидает payload формата (то, что отправляет Retell):

        {
          "datetime": "2025-11-30T13:00:00",
          "service_id": 1,
          "staff_id": 10,
          "client_name": "Илья",
          "client_phone": "+7911..."
        }

        Здесь тоже мапим внутренние id -> реальные id YCLIENTS
        и собираем JSON под /book_record/{company_id}.
        """
        try:
            print("CREATE REQUEST BODY (from Retell):", payload)

            # проверки
            for key in ("datetime", "service_id", "staff_id", "client_name", "client_phone"):
                if key not in payload:
                    raise HTTPException(status_code=422, detail=f"Missing field: {key}")

            internal_service_id = int(payload["service_id"])
            internal_staff_id = int(payload["staff_id"])

            if internal_service_id not in SERVICE_MAP:
                raise HTTPException(status_code=400, detail="Unknown service_id")
            if internal_staff_id not in STAFF_MAP:
                raise HTTPException(status_code=400, detail="Unknown staff_id")

            y_service_id = SERVICE_MAP[internal_service_id]
            y_staff_id = STAFF_MAP[internal_staff_id]

            datetime_str = payload["datetime"]
            client_name = payload["client_name"]
            client_phone = payload["client_phone"]

            # JSON в формате YCLIENTS
            yclients_body: Dict[str, Any] = {
                "phone": client_phone,
                "fullname": client_name,
                "email": "no-reply@example.com",  # можно потом заменить на реальную почту, если спросишь
                "comment": "Запись через голосового ассистента Lucy AI",
                "type": "mobile",
                "notify_by_sms": 0,
                "notify_by_email": 0,
                "appointments": [
                    {
                        "id": 1,
                        "services": [y_service_id],
                        "staff_id": y_staff_id,
                        "datetime": datetime_str,
                    }
                ],
            }

            url = f"{self.base_url}/book_record/{self.company_id}"

            async with httpx.AsyncClient(timeout=settings.HTTPX_TIMEOUT) as client:
                resp = await client.post(url, json=yclients_body, headers=self._headers())

            print("CREATE RAW RESPONSE:", resp.status_code, resp.text)

            if resp.status_code not in (200, 201):
                # пробрасываем текст ошибки YCLIENTS наружу
                raise HTTPException(status_code=resp.status_code, detail=resp.text)

            data = resp.json()
            return {"success": True, "data": data.get("data")}

        except HTTPException:
            raise
        except Exception as e:
            print("CREATE ERROR:", repr(e))
            raise HTTPException(status_code=400, detail=f"YCLIENTS create_record error: {e}")