from typing import Any, Dict
import httpx
from fastapi import HTTPException

from YCLIENTS.app.config import settings
from .models import SlotsRequest
from .mappings import SERVICE_MAP, STAFF_MAP


class YclientsAPI:
    def __init__(self) -> None:
        self.base_url = settings.YCLIENTS_BASE_URL
        self.company_id = settings.YCLIENTS_COMPANY_ID
        self.form_id = settings.YCLIENTS_FORM_ID

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

            url = f"{self.base_url}/book_times/{self.company_id}/{self.form_id}"
            params = {
                "staff_id": y_staff_id,
                "service_id": y_service_id,
                "date": payload.day,
            }

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
        POST /book_record/{company_id}
        payload — в том же формате, что ты уже проверял через Postman.
        """
        url = f"{self.base_url}/book_record/{self.company_id}"

        async with httpx.AsyncClient(timeout=settings.HTTPX_TIMEOUT) as client:
            resp = await client.post(url, json=payload, headers=self._headers())

        print("CREATE RAW RESPONSE:", resp.status_code, resp.text)

        if resp.status_code not in (200, 201):
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        data = resp.json()
        return {"success": True, "data": data.get("data")}