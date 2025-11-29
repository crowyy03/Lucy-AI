from pydantic import BaseModel, EmailStr, Field
from typing import List


# ====== СЛОТЫ ======

class SlotsRequest(BaseModel):
    day: str = Field(..., description="Дата в формате YYYY-MM-DD")
    service_id: int
    staff_id: int


class SlotsResponse(BaseModel):
    slots: List[str]


# ====== СОЗДАНИЕ ЗАПИСИ ======

class AppointmentItem(BaseModel):
    id: int
    services: List[int]
    staff_id: int
    # строка ISO, то есть то, что вернул /book_times (без превращения в datetime-объект)
    datetime: str


class CreateRecordRequest(BaseModel):
    phone: str
    fullname: str
    email: EmailStr
    appointments: List[AppointmentItem]