from typing import Any

import httpx


class SurveyServiceClient:
    """
    Cliente HTTP para app-surveys-service.

    Usa los endpoints públicos (sin autenticación):
      - GET /api/surveys?businessId=<id>        → lista de encuestas
      - GET /api/surveys/<id>/responses         → respuestas de una encuesta
    """

    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")

    async def list_surveys(self, business_id: str) -> list[dict[str, Any]]:
        """Retorna todas las encuestas de un negocio."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/api/surveys",
                params={"businessId": business_id},
            )
            response.raise_for_status()
            payload = response.json()

        if isinstance(payload, list):
            return payload

        if isinstance(payload, dict) and isinstance(payload.get("items"), list):
            return payload["items"]

        return []

    async def fetch_responses(self, survey_id: str) -> list[dict[str, Any]]:
        """Retorna todas las respuestas de una encuesta específica."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/api/surveys/{survey_id}/responses",
            )
            response.raise_for_status()
            payload = response.json()

        if isinstance(payload, list):
            return payload

        if isinstance(payload, dict) and isinstance(payload.get("items"), list):
            return payload["items"]

        return []
