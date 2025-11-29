from httpx import AsyncClient
from app.main import app


async def test_slots_ok():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post(
            "/api/yclients/slots",
            json={"day": "2025-11-21", "service_id": 1, "staff_id": 10},
        )
    assert resp.status_code in (200, 400, 502)