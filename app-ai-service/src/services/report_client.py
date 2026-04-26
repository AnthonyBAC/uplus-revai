from collections.abc import Mapping
from typing import Any

import httpx


class ReportServiceClient:
    def __init__(self, base_url: str, token: str = "") -> None:
        self.base_url = base_url.rstrip("/")
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    async def publish_analysis(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/api/internal/reports/analysis",
                json=dict(payload),
                headers=self.headers,
            )
            response.raise_for_status()
            data = response.json()

        if isinstance(data, dict):
            return data

        return {"delivered": True, "detail": "Report service accepted analysis payload."}
