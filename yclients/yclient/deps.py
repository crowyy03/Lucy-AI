from .client import YclientsAPI


def get_yclients_api() -> YclientsAPI:
    """
    Dependency для FastAPI. На каждый запрос даём новый экземпляр клиента.
    """
    return YclientsAPI()