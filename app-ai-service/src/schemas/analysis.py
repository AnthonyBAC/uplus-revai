from typing import Any

from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    business_id: str = Field(..., alias="businessId")
    branch_id: str | None = Field(default=None, alias="branchId")
    start_date: str | None = Field(default=None, alias="startDate")
    end_date: str | None = Field(default=None, alias="endDate")


class SourceSnapshot(BaseModel):
    source: str
    total_items: int = Field(..., alias="totalItems")
    preview: list[dict[str, Any]] = Field(default_factory=list)


class AnalysisResult(BaseModel):
    provider: str
    model: str
    summary: str
    recommended_actions: list[str] = Field(default_factory=list, alias="recommendedActions")
    source_snapshots: list[SourceSnapshot] = Field(default_factory=list, alias="sourceSnapshots")


class PublishResult(BaseModel):
    target_service: str = Field(..., alias="targetService")
    delivered: bool
    detail: str


class AnalysisResponse(BaseModel):
    ok: bool
    business_id: str = Field(..., alias="businessId")
    branch_id: str | None = Field(default=None, alias="branchId")
    analysis: AnalysisResult
    publish_result: PublishResult = Field(..., alias="publishResult")
