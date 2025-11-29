# YCLIENTS/app/main.py
from fastapi import FastAPI

# БЫЛО: from yclients.router import router as yclients_router
from YCLIENTS.yclients.router import router as yclients_router

app = FastAPI(title="YCLIENTS demo")

app.include_router(yclients_router, prefix="/yclients", tags=["yclients"])