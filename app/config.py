# YCLIENTS/app/config.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # базовый URL API YCLIENTS
    YCLIENTS_BASE_URL: str = "https://api.yclients.com/api/v1"

    # твоя компания
    YCLIENTS_COMPANY_ID: int = 1641078

    # form_id, который работает в Postman
    YCLIENTS_FORM_ID: int = 1853076

    # токены (можешь вынести в .env, но пока можно захардкодить)
    YCLIENTS_PARTNER_TOKEN: str = "r9rn6w6gufddwpd9t5wj"
    YCLIENTS_USER_TOKEN: str = "571c03a460a201cd52ebdcd32cc23c8"

    # таймаут для httpx
    HTTPX_TIMEOUT: float = 15.0


settings = Settings()