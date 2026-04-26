from fastapi import FastAPI

from src.api.routes.analysis import router as analysis_router
from src.api.routes.health import router as health_router
from src.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Servicio de IA para combinar datos de reviews y surveys y enviar el resultado al servicio de reportes.",
)

app.include_router(health_router)
app.include_router(analysis_router)
