from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ai_service_port: int = 8001
    llm_provider: str = "fake"          # openai | anthropic | fake
    llm_model: str = "gpt-4o-mini"
    llm_temperature: float = 0.1
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
