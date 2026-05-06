import asyncio
import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from src.core.config import Settings
from src.schemas.analysis import AnalysisRequest, AnalysisResponse, PublishResult
from src.services.llm import get_llm_provider
from src.services.llm.base import ItemAnalysis, LLMProvider
from src.services.report_client import ReportServiceClient
from src.services.review_client import ReviewServiceClient
from src.services.survey_client import SurveyServiceClient

logger = logging.getLogger(__name__)

# Máximo de análisis concurrentes para no saturar los servicios Node
_CONCURRENCY = 5


class AnalysisService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.review_client = ReviewServiceClient(
            settings.review_service_url,
            settings.internal_service_token,
        )
        self.survey_client = SurveyServiceClient(settings.surveys_service_url)
        self.report_client = ReportServiceClient(
            settings.report_service_url,
            settings.internal_service_token,
        )
        self.llm: LLMProvider = get_llm_provider(settings)

    # ──────────────────────────────────────────────────────────────────────────
    # Punto de entrada principal
    # ──────────────────────────────────────────────────────────────────────────

    async def generate(self, request: AnalysisRequest) -> AnalysisResponse:
        now = datetime.now(timezone.utc)

        # ── Paso 1: Fetch reviews ─────────────────────────────────────────────
        reviews: list[dict[str, Any]] = []
        try:
            reviews = await self.review_client.fetch_reviews(
                business_id=request.business_id,
                branch_id=request.branch_id,
                start_date=request.start_date,
                end_date=request.end_date,
            )
            logger.info("Reviews obtenidas: %d", len(reviews))
        except httpx.HTTPError as exc:
            logger.warning("No se pudieron obtener reviews: %s", exc)

        # ── Paso 2: Fetch survey responses (dos pasos) ────────────────────────
        survey_responses: list[dict[str, Any]] = []
        try:
            surveys = await self.survey_client.list_surveys(request.business_id)
            logger.info("Encuestas encontradas: %d", len(surveys))

            for survey in surveys:
                survey_id = survey.get("id", "")
                if not survey_id:
                    continue

                responses = await self.survey_client.fetch_responses(survey_id)

                # Filtrado client-side por branchId si se especificó
                if request.branch_id:
                    responses = [
                        r for r in responses if r.get("branchId") == request.branch_id
                    ]

                survey_responses.extend(responses)

            logger.info("Respuestas de encuesta obtenidas: %d", len(survey_responses))
        except httpx.HTTPError as exc:
            logger.warning("No se pudieron obtener encuestas: %s", exc)

        # ── Paso 3: Crear reporte PENDING ─────────────────────────────────────
        period_start = request.start_date or now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()
        period_end = request.end_date or now.isoformat()

        report_id: str | None = None
        report_payload: dict[str, Any] = {
            "businessId": request.business_id,
            "title": f"Análisis IA — {now.strftime('%Y-%m-%d %H:%M')} UTC",
            "periodStart": period_start,
            "periodEnd": period_end,
        }
        if request.branch_id:
            report_payload["branchId"] = request.branch_id

        try:
            report = await self.report_client.create_report(report_payload)
            report_id = report.get("id")
            logger.info("Reporte PENDING creado: %s", report_id)
        except httpx.HTTPError as exc:
            logger.error("No se pudo crear el reporte: %s", exc)
            return AnalysisResponse(
                ok=False,
                businessId=request.business_id,
                branchId=request.branch_id,
                reportId=None,
                itemsAnalyzed=0,
                aggregateStatus="FAILED",
                publishResult=PublishResult(
                    targetService="app-report-service",
                    delivered=False,
                    detail=f"Error al crear reporte: {exc}",
                ),
            )

        # ── Pasos 4-5: Análisis per-ítem con concurrencia limitada ───────────
        semaphore = asyncio.Semaphore(_CONCURRENCY)
        all_analyses: list[ItemAnalysis] = []
        items_analyzed = 0

        async def _analyze_review(review: dict[str, Any]) -> None:
            nonlocal items_analyzed
            async with semaphore:
                text = review.get("content", "")
                rating = review.get("rating")
                item = self.llm.analyze_item(text, {"rating": rating, "source": "review"})
                all_analyses.append(item)
                items_analyzed += 1

                try:
                    analysis_payload: dict[str, Any] = {
                        "businessId": request.business_id,
                        "sourceType": "REVIEW",
                        "sourceId": review.get("id", ""),
                        "sentiment": item.sentiment,
                        "summary": item.summary,
                        "keywords": item.keywords,
                        "rawPayload": review,
                    }
                    if request.branch_id:
                        analysis_payload["branchId"] = request.branch_id
                    await self.report_client.create_analysis(analysis_payload)
                except httpx.HTTPError as exc:
                    logger.warning(
                        "No se pudo persistir análisis de review %s: %s",
                        review.get("id"),
                        exc,
                    )

        async def _analyze_survey_response(response: dict[str, Any]) -> None:
            nonlocal items_analyzed
            async with semaphore:
                answers = response.get("answers", [])
                # Concatenar pregunta + respuesta para dar contexto al LLM
                text = " | ".join(
                    f"{a.get('question', {}).get('text', 'Pregunta')}: {a.get('value', '')}"
                    for a in answers
                ) or "[respuesta vacía]"

                item = self.llm.analyze_item(text, {"source": "survey"})
                all_analyses.append(item)
                items_analyzed += 1

                try:
                    survey_analysis_payload: dict[str, Any] = {
                        "businessId": request.business_id,
                        "sourceType": "SURVEY",
                        "sourceId": response.get("id", ""),
                        "sentiment": item.sentiment,
                        "summary": item.summary,
                        "keywords": item.keywords,
                        "rawPayload": response,
                    }
                    if request.branch_id:
                        survey_analysis_payload["branchId"] = request.branch_id
                    await self.report_client.create_analysis(survey_analysis_payload)
                except httpx.HTTPError as exc:
                    logger.warning(
                        "No se pudo persistir análisis de survey response %s: %s",
                        response.get("id"),
                        exc,
                    )

        await asyncio.gather(
            *[_analyze_review(r) for r in reviews],
            *[_analyze_survey_response(r) for r in survey_responses],
        )

        logger.info("Total ítems analizados: %d", items_analyzed)

        # ── Paso 6-7: Agregar + PATCH reporte (3 intentos con fallback FAILED) ─
        period_label = f"{period_start[:10]} / {period_end[:10]}"
        aggregate_status = "FAILED"

        for attempt in range(1, 4):
            try:
                aggregated = self.llm.aggregate(all_analyses, period_label)
                # Zod iso.datetime() acepta máximo 3 decimales (ms), no 6 (µs)
                generated_at = now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{now.microsecond // 1000:03d}Z"
                await self.report_client.update_report(
                    report_id,  # type: ignore[arg-type]
                    {
                        "status": "READY",
                        "content": aggregated.model_dump(),
                        "generatedAt": generated_at,
                    },
                )
                aggregate_status = "READY"
                logger.info("Reporte %s marcado como READY (intento %d)", report_id, attempt)
                break
            except Exception as exc:  # noqa: BLE001
                logger.warning(
                    "Intento %d de finalizar reporte %s falló: %s",
                    attempt,
                    report_id,
                    exc,
                )
                if attempt == 3:
                    try:
                        await self.report_client.update_report(report_id, {"status": "FAILED"})  # type: ignore[arg-type]
                        logger.error("Reporte %s marcado como FAILED", report_id)
                    except Exception:  # noqa: BLE001
                        logger.error("No se pudo marcar el reporte como FAILED")

        delivered = aggregate_status == "READY"
        detail = (
            f"Reporte {report_id} — {aggregate_status}. "
            f"{items_analyzed} ítems analizados "
            f"({len(reviews)} reviews, {len(survey_responses)} respuestas de encuesta)."
        )

        return AnalysisResponse(
            ok=delivered,
            businessId=request.business_id,
            branchId=request.branch_id,
            reportId=report_id,
            itemsAnalyzed=items_analyzed,
            aggregateStatus=aggregate_status,
            publishResult=PublishResult(
                targetService="app-report-service",
                delivered=delivered,
                detail=detail,
            ),
        )
