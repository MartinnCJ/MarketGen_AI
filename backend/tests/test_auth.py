"""
Tests for the Keycloak JWT authentication dependency.

These tests exercise the token verification logic in isolation, without
spinning up a real Keycloak instance.
"""
from __future__ import annotations

import time
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException


# ── Helper: minimal RSA-style JWT (not cryptographically valid, just structure) ─

FAKE_PAYLOAD = {
    "sub":                "user-abc-123",
    "email":              "user@example.com",
    "name":               "Test User",
    "preferred_username": "testuser",
    "realm_access":       {"roles": ["nd-user"]},
    "exp":                int(time.time()) + 3600,
    "iss":                "https://keycloak.example.com/realms/noondalton",
}

FAKE_JWKS = {
    "keys": [
        {
            "kty": "RSA",
            "kid": "test-kid",
            "use": "sig",
            "n":   "test-n",
            "e":   "AQAB",
        }
    ]
}


# ── Unit tests for _get_jwks caching ─────────────────────────────────────────

@pytest.mark.asyncio
async def test_jwks_is_fetched_on_first_call():
    """_get_jwks should make an HTTP request on the first call."""
    import app.dependencies.auth as auth_mod

    # Reset cache
    auth_mod._jwks_cache = {}
    auth_mod._jwks_fetched_at = 0.0

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = FAKE_JWKS

    mock_client = AsyncMock()
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__  = AsyncMock(return_value=False)
    mock_client.get        = AsyncMock(return_value=mock_response)

    with patch("app.dependencies.auth.httpx.AsyncClient", return_value=mock_client):
        result = await auth_mod._get_jwks()

    assert result == FAKE_JWKS
    mock_client.get.assert_awaited_once()


@pytest.mark.asyncio
async def test_jwks_is_cached_on_subsequent_calls():
    """_get_jwks should return cached data without making another HTTP call."""
    import app.dependencies.auth as auth_mod

    auth_mod._jwks_cache      = FAKE_JWKS
    auth_mod._jwks_fetched_at = time.monotonic()  # just fetched

    mock_client = AsyncMock()

    with patch("app.dependencies.auth.httpx.AsyncClient", return_value=mock_client):
        result = await auth_mod._get_jwks()

    assert result == FAKE_JWKS
    mock_client.get.assert_not_awaited()


# ── Unit tests for CurrentUser model ─────────────────────────────────────────

def test_current_user_defaults():
    """CurrentUser should have sensible defaults for optional fields."""
    from app.dependencies.auth import CurrentUser
    user = CurrentUser(sub="sub-123")
    assert user.sub == "sub-123"
    assert user.email is None
    assert user.roles == []
    assert user.raw == {}


def test_current_user_roles_populated():
    """CurrentUser.roles should contain the parsed Keycloak realm roles."""
    from app.dependencies.auth import CurrentUser
    user = CurrentUser(
        sub="sub-123",
        roles=["nd-user", "nd-admin"],
        raw=FAKE_PAYLOAD,
    )
    assert "nd-admin" in user.roles


# ── Unit tests for require_roles guard ────────────────────────────────────────

@pytest.mark.asyncio
async def test_require_roles_passes_with_correct_role():
    """require_roles should return the user when they have the required role."""
    from app.dependencies.auth import require_roles, CurrentUser

    user_with_role = CurrentUser(sub="sub", roles=["nd-admin"])
    guard = require_roles("nd-admin")

    result = await guard(current_user=user_with_role)
    assert result.sub == "sub"


@pytest.mark.asyncio
async def test_require_roles_raises_403_without_role():
    """require_roles should raise 403 when the user lacks the required role."""
    from app.dependencies.auth import require_roles, CurrentUser

    user_without_role = CurrentUser(sub="sub", roles=["nd-user"])
    guard = require_roles("nd-admin")

    with pytest.raises(HTTPException) as exc_info:
        await guard(current_user=user_without_role)
    assert exc_info.value.status_code == 403


# ── Integration: unauthenticated request is rejected ─────────────────────────

@pytest.mark.asyncio
async def test_protected_endpoint_requires_auth():
    """
    A request to a protected endpoint without a Bearer token should receive 403.

    Note: the shared `client` fixture already has auth overridden.
    We create a clean client here to test the real auth path.
    """
    from app.main import app as fastapi_app
    from httpx import AsyncClient, ASGITransport

    # Remove the test override to expose the real auth guard
    original_overrides = fastapi_app.dependency_overrides.copy()
    fastapi_app.dependency_overrides.clear()

    try:
        async with AsyncClient(
            transport=ASGITransport(app=fastapi_app),
            base_url="http://testserver",
        ) as ac:
            resp = await ac.get("/api/v1/books")
        # Without a Bearer token, HTTPBearer returns 403
        assert resp.status_code in (401, 403)
    finally:
        fastapi_app.dependency_overrides.update(original_overrides)
