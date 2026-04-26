from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def healthcheck() -> dict[str, str | bool]:
    return {
        "ok": True,
        "service": "app-ai-service",
        "message": "FastAPI AI service is running.",
    }
