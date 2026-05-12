from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    business_id: str = Field(..., alias="businessId")
    branch_id: str | None = Field(default=None, alias="branchId")
    start_date: str | None = Field(default=None, alias="startDate")
    end_date: str | None = Field(default=None, alias="endDate")

    model_config = {"populate_by_name": True}


class PublishResult(BaseModel):
    target_service: str = Field(..., alias="targetService")
    delivered: bool
    detail: str

    model_config = {"populate_by_name": True}


class AnalysisResponse(BaseModel):
    ok: bool
    business_id: str = Field(..., alias="businessId")
    branch_id: str | None = Field(default=None, alias="branchId")
    report_id: str | None = Field(default=None, alias="reportId")
    items_analyzed: int = Field(default=0, alias="itemsAnalyzed")
    aggregate_status: str = Field(default="PENDING", alias="aggregateStatus")
    publish_result: PublishResult = Field(..., alias="publishResult")

    model_config = {"populate_by_name": True}
