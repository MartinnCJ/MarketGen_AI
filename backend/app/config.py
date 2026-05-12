"""
Centralised application configuration using Pydantic Settings.
All values are loaded from environment variables (or .env file).
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────────
    app_name: str = "NoonDalton AI Marketing Suite"
    app_env: str = "development"
    app_debug: bool = True
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Keycloak ──────────────────────────────────────────────────────────────
    keycloak_url: str = "http://localhost:8080"
    keycloak_realm: str = "nd-marketing"
    keycloak_client_id: str = "nd-backend"
    keycloak_client_secret: str = ""

    @property
    def keycloak_jwks_url(self) -> str:
        return (
            f"{self.keycloak_url}/realms/{self.keycloak_realm}"
            "/protocol/openid-connect/certs"
        )

    @property
    def keycloak_issuer(self) -> str:
        return f"{self.keycloak_url}/realms/{self.keycloak_realm}"

    # ── Google Cloud / Firestore ──────────────────────────────────────────────
    google_cloud_project: str = ""
    google_application_credentials: str = ""
    firestore_database: str = "(default)"

    # ── Gemini ────────────────────────────────────────────────────────────────
    gemini_api_key: str = ""
    gemini_default_model: str = "gemini-2.0-flash"
    gemini_max_tokens: int = 8192
    gemini_temperature: float = 0.7

    # ── Supabase Storage ──────────────────────────────────────────────────────
    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_storage_bucket: str = "nd-assets"

    # ── Redis / Celery ────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/1"


@lru_cache()
def get_settings() -> Settings:
    """Return cached Settings instance (singleton)."""
    return Settings()


settings = get_settings()
