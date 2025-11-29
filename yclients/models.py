from typing import List
from pydantic import BaseModel


# ---------- SLOTS ----------

class SlotsRequest(BaseModel):
    day: str          # "YYYY-MM-DD"
    service_id: int   # внутренний id → см. SERVICE_MAP
    staff_id: int     # внутренний id → см. STAFF_MAP


class SlotsResponse(BaseModel):
    slots: List[str]


# ---------- CREATE RECORD ----------

class AppointmentItem(BaseModel):
    id: int                  # можно просто 1
    services: List[int]      # YCLIENTS service_id (напр. 24930498)
    staff_id: int            # YCLIENTS staff_id
    datetime: str            # ISO-строка, как ты уже отправлял


class CreateRecordRequest(BaseModel):
    phone: str
    fullname: str
    email: str
    appointments: List[AppointmentItem]