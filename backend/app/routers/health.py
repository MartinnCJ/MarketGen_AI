"""Health check endpoint — no auth required."""
from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(tags=["Health"])

APP_VERSION = "1.0.0"


@router.get("/health")
async def health_check():
    return {
        "status":    "ok",
        "version":   APP_VERSION,
        "service":   "NoonDalton AI Marketing Suite API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
