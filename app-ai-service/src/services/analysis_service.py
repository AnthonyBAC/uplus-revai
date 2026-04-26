from collections.abc import Mapping
from typing import Any

import httpx

from src.core.config import Settings
from src.schemas.analysis import AnalysisRequest, AnalysisResponse, AnalysisResult, PublishResult, SourceSnapshot
from src.services.report_client import ReportServiceClient
from src.services.review_client import ReviewServiceClient
from src.services.survey_client import SurveyServiceClient


class AnalysisService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.review_client = ReviewServiceClient(settings.review_service_url, settings.internal_service_token)
        self.survey_client = SurveyServiceClient(settings.surveys_service_url, settings.internal_service_token)
        self.report_client = ReportServiceClient(settings.report_service_url, settings.internal_service_token)

    async def generate(self, request: AnalysisRequest) -> AnalysisResponse:
        reviews: list[dict[str, Any]] = []
        surveys: list[dict[str, Any]] = []

        try:
            reviews = await self.review_client.fetch_reviews(
                business_id=request.business_id,
                branch_id=request.branch_id,
                start_date=request.start_date,
                end_date=request.end_date,
            )
        except httpx.HTTPError:
            reviews = []

        try:
            surveys = await self.survey_client.fetch_surveys(
                business_id=request.business_id,
                branch_id=request.branch_id,
                start_date=request.start_date,
                end_date=request.end_date,
            )
        except httpx.HTTPError:
            surveys = []

        analysis = self._build_analysis(reviews=reviews, surveys=surveys)
        report_payload = self._build_report_payload(request=request, analysis=analysis)

        try:
            delivery = await self.report_client.publish_analysis(report_payload)
            publish_result = PublishResult(
                targetService="app-report-service",
                delivered=bool(delivery.get("delivered", True)),
                detail=str(delivery.get("detail", "Analysis delivered to report service.")),
            )
        except httpx.HTTPError as error:
            publish_result = PublishResult(
                targetService="app-report-service",
                delivered=False,
                detail=f"Report delivery pending: {error.__class__.__name__}",
            )

        return AnalysisResponse(
            ok=True,
            businessId=request.business_id,
            branchId=request.branch_id,
            analysis=analysis,
            publishResult=publish_result,
        )

    def _build_analysis(
        self,
        *,
        reviews: list[dict[str, Any]],
        surveys: list[dict[str, Any]],
    ) -> AnalysisResult:
        total_reviews = len(reviews)
        total_surveys = len(surveys)

        summary = (
            "FastAPI AI service scaffold ready. "
            f"Received {total_reviews} reviews and {total_surveys} survey responses to prepare an analysis payload for report service."
        )

        return AnalysisResult(
            provider=self.settings.ai_provider,
            model=self.settings.ai_model,
            summary=summary,
            recommendedActions=[
                "Definir contrato interno estable para review y surveys.",
                "Implementar proveedor LLM real detras de una abstraccion.",
                "Persistir el resultado estructurado en app-report-service.",
            ],
            sourceSnapshots=[
                SourceSnapshot(source="reviews", totalItems=total_reviews, preview=reviews[:3]),
                SourceSnapshot(source="surveys", totalItems=total_surveys, preview=surveys[:3]),
            ],
        )

    def _build_report_payload(
        self,
        *,
        request: AnalysisRequest,
        analysis: AnalysisResult,
    ) -> Mapping[str, Any]:
        return {
            "businessId": request.business_id,
            "branchId": request.branch_id,
            "source": "app-ai-service",
            "provider": analysis.provider,
            "model": analysis.model,
            "summary": analysis.summary,
            "recommendedActions": analysis.recommended_actions,
            "sourceSnapshots": [snapshot.model_dump(by_alias=True) for snapshot in analysis.source_snapshots],
        }
