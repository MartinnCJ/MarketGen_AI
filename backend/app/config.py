"""
<<<<<<< HEAD
Centralised application configuration using Pydantic Settings.
All values are loaded from environment variables (or .env file).
"""
from functools import lru_cache
from typing import List

=======
Application settings loaded from environment variables.
"""
from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import field_validator
>>>>>>> 298ebad (Actualizacion de datos)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

<<<<<<< HEAD
    # ── App ───────────────────────────────────────────────────────────────────
    app_name: str = "NoonDalton AI Marketing Suite"
    app_env: str = "development"
    app_debug: bool = True
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Keycloak ──────────────────────────────────────────────────────────────
=======
    app_name: str = "MarketGen AI"
    app_env: str = "development"
    app_debug: bool = True
    app_secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 14
    password_reset_token_expire_minutes: int = 60

    backend_cors_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://market-gen-ai-indol.vercel.app"
    )

    google_cloud_project: str = ""
    google_application_credentials: str = ""
    firebase_credentials_path: str = ""
    firebase_service_account_json: str = ""
    firestore_database: str = "(default)"

    gemini_api_key: str = ""
    gemini_default_model: str = "gemini-2.0-flash-lite"
    gemini_max_tokens: int = 8192
    gemini_temperature: float = 0.7

    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"

>>>>>>> 298ebad (Actualizacion de datos)
    keycloak_url: str = "http://localhost:8080"
    keycloak_realm: str = "nd-marketing"
    keycloak_client_id: str = "nd-backend"
    keycloak_client_secret: str = ""

<<<<<<< HEAD
=======
    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_storage_bucket: str = "nd-assets"

    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/1"

    @field_validator("backend_cors_origins")
    @classmethod
    def normalize_cors_origins(cls, value: str) -> str:
        return ",".join(origin.strip() for origin in value.split(",") if origin.strip())

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

>>>>>>> 298ebad (Actualizacion de datos)
    @property
    def keycloak_jwks_url(self) -> str:
        return (
            f"{self.keycloak_url}/realms/{self.keycloak_realm}"
            "/protocol/openid-connect/certs"
        )

    @property
    def keycloak_issuer(self) -> str:
        return f"{self.keycloak_url}/realms/{self.keycloak_realm}"

<<<<<<< HEAD
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
=======

@lru_cache()
def get_settings() -> Settings:
>>>>>>> 298ebad (Actualizacion de datos)
    return Settings()


settings = get_settings()
