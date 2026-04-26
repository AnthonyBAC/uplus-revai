from typing import Any

import httpx


class SurveyServiceClient:
    def __init__(self, base_url: str, token: str = "") -> None:
        self.base_url = base_url.rstrip("/")
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    async def fetch_surveys(
        self,
        *,
        business_id: str,
        branch_id: str | None,
        start_date: str | None,
        end_date: str | None,
    ) -> list[dict[str, Any]]:
        params = {
            "businessId": business_id,
            "branchId": branch_id,
            "startDate": start_date,
            "endDate": end_date,
        }
        clean_params = {key: value for key, value in params.items() if value is not None}

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/api/internal/surveys",
                params=clean_params,
                headers=self.headers,
            )
            response.raise_for_status()
            payload = response.json()

        if isinstance(payload, dict) and isinstance(payload.get("items"), list):
            return payload["items"]

        if isinstance(payload, list):
            return payload

        return []
