from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # БАЗА YCLIENTS API
    YCLIENTS_BASE_URL: str = "https://api.yclients.com/api/v1"

    # Твои реальные данные — подставь сюда
    YCLIENTS_PARTNER_TOKEN: str = "r9rn6w6gufddwpd9t5wj"
    YCLIENTS_USER_TOKEN: str = "2f359d8010b2fee1f0ada624c31045ee"

    # ID компании (Пушкин Барон)
    YCLIENTS_COMPANY_ID: int = 1641078

    # ID формы онлайн-записи, которая работает в Postman
    YCLIENTS_FORM_ID: int = 1853076

    # Таймаут запросов к YCLIENTS
    HTTPX_TIMEOUT: float = 15.0

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()