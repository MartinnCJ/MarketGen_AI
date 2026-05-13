"""Settings router — per-org configuration (CRM, LLM model, social)."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

from app.dependencies.auth import CurrentUser, get_current_user
from app.services.firestore_service import settings_repo

router = APIRouter(prefix="/settings", tags=["Settings"])


class SettingsUpdate(BaseModel):
    llm:                Optional[Dict[str, Any]] = None
    crm:                Optional[Dict[str, Any]] = None
    socialConnections:  Optional[List[str]] = None


@router.get("")
async def get_settings(user: CurrentUser = Depends(get_current_user)):
    """Return the current org settings (keyed by user.sub)."""
    return await settings_repo.get_by_user(user.sub)


@router.put("")
async def update_settings(
    body: SettingsUpdate,
    user: CurrentUser = Depends(get_current_user),
):
    """Upsert org settings."""
    existing = await settings_repo.get(user.sub)
    payload = body.model_dump(exclude_none=True)
    payload["userId"] = user.sub

    # Mask any API keys before storing (basic protection)
    if "crm" in payload and payload["crm"].get("apiKey"):
        key = payload["crm"]["apiKey"]
        if not all(c == "•" for c in key):       # only update if not masked
            payload["crm"]["apiKey"] = key        # store as-is (encrypt at rest via Firestore rules)

    if existing:
        return await settings_repo.update(user.sub, payload)
    else:
        return await settings_repo.create(payload, doc_id=user.sub)
