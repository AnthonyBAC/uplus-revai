from fastapi import APIRouter, Depends, Request

from src.core.config import Settings, get_settings
from src.schemas.analysis import AnalysisRequest, AnalysisResponse
from src.services.analysis_service import AnalysisService

router = APIRouter(prefix="/api/v1/analysis", tags=["analysis"])


def build_service(
    request: Request,
    settings: Settings = Depends(get_settings),
) -> AnalysisService:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else ""
    return AnalysisService(settings, auth_token=token)


@router.post("/generate", response_model=AnalysisResponse, response_model_by_alias=True)
async def generate_analysis(
    payload: AnalysisRequest,
    service: AnalysisService = Depends(build_service),
) -> AnalysisResponse:
    return await service.generate(payload)
