from collections.abc import Mapping
from typing import Any

import httpx


class ReportServiceClient:
    """
    Cliente HTTP para app-report-service.

    Todos los endpoints requieren Authorization: Bearer <INTERNAL_SERVICE_TOKEN>.

    Métodos:
      - create_report  → POST /api/reports            (crea el reporte en estado PENDING)
      - create_analysis → POST /api/analysis          (persiste un AnalysisResult por ítem)
      - update_report  → PATCH /api/reports/<id>      (cierra el reporte en READY o FAILED)
    """

    def __init__(self, base_url: str, token: str = "") -> None:
        self.base_url = base_url.rstrip("/")
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    async def create_report(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Crea un reporte en estado PENDING. Retorna el objeto creado con su id."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/api/reports",
                json=dict(payload),
                headers=self.headers,
            )
            response.raise_for_status()
            data = response.json()

        if isinstance(data, dict):
            return data

        return {}

    async def create_analysis(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Persiste un AnalysisResult individual (por review o respuesta de encuesta)."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/api/analysis",
                json=dict(payload),
                headers=self.headers,
            )
            response.raise_for_status()
            data = response.json()

        if isinstance(data, dict):
            return data

        return {}

    async def update_report(self, report_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Actualiza el reporte (status READY/FAILED, content, generatedAt)."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                f"{self.base_url}/api/reports/{report_id}",
                json=dict(payload),
                headers=self.headers,
            )
            response.raise_for_status()
            data = response.json()

        if isinstance(data, dict):
            return data

        return {}
