from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "app-ai-service"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    review_service_url: str = "http://localhost:3003"
    surveys_service_url: str = "http://localhost:3005"
    report_service_url: str = "http://localhost:3004"
    internal_service_token: str = ""
    ai_provider: str = "gemini"
    ai_model: str = "gemini-2.5-flash"
    ai_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
