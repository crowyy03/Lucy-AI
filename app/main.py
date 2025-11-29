from fastapi import FastAPI
from YCLIENTS.yclients.router import router as yclients_router


app = FastAPI(
    title="Lucy AI — YCLIENTS bridge",
    version="1.0.0",
)


@app.get("/health")
async def health():
    return {"status": "ok"}


# Подключаем роутер /yclients/...
app.include_router(yclients_router)