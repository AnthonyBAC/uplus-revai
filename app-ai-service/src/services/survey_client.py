from typing import Any

import httpx


class SurveyServiceClient:
    def __init__(self, base_url: str, token: str = "") -> None:
        self.base_url = base_url.rstrip("/")
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    async def list_surveys(self, business_id: str) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/api/surveys",
                params={"businessId": business_id},
                headers=self.headers,
            )
            response.raise_for_status()
            payload = response.json()

        if isinstance(payload, list):
            return payload

        if isinstance(payload, dict) and isinstance(payload.get("items"), list):
            return payload["items"]

        return []

    async def fetch_responses(self, survey_id: str) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/api/surveys/{survey_id}/responses",
                headers=self.headers,
            )
            response.raise_for_status()
            payload = response.json()

        if isinstance(payload, list):
            return payload

        if isinstance(payload, dict) and isinstance(payload.get("items"), list):
            return payload["items"]

        return []
