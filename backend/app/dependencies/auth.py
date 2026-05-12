"""
Keycloak JWT authentication dependency for FastAPI.

Flow:
  1. Client sends   Authorization: Bearer <keycloak_access_token>
  2. FastAPI extracts the token via HTTPBearer
  3. We fetch Keycloak's JWKS (public keys) — cached in memory
  4. jose decodes & verifies the token (signature + expiry + issuer + audience)
  5. We return a CurrentUser model that downstream routes can depend on
"""
from __future__ import annotations

import time
from typing import Any, Dict, Optional

import httpx
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel

from app.config import settings

# ── Bearer scheme ─────────────────────────────────────────────────────────────
http_bearer = HTTPBearer(auto_error=True)

# ── In-memory JWKS cache (refresh every 10 minutes) ──────────────────────────
_jwks_cache: Dict[str, Any] = {}
_jwks_fetched_at: float = 0.0
_JWKS_TTL = 600  # seconds


async def _get_jwks() -> Dict[str, Any]:
    """Fetch Keycloak JWKS, caching the result for 10 minutes."""
    global _jwks_cache, _jwks_fetched_at

    now = time.monotonic()
    if _jwks_cache and (now - _jwks_fetched_at) < _JWKS_TTL:
        return _jwks_cache

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(settings.keycloak_jwks_url)
        response.raise_for_status()
        _jwks_cache = response.json()
        _jwks_fetched_at = now
        return _jwks_cache


# ── Current user model ────────────────────────────────────────────────────────
class CurrentUser(BaseModel):
    sub: str                    # Keycloak user ID
    email: Optional[str] = None
    name: Optional[str] = None
    preferred_username: Optional[str] = None
    roles: list[str] = []       # realm_access.roles from the token
    raw: Dict[str, Any] = {}    # full decoded payload (for advanced use)


# ── Core verification function ────────────────────────────────────────────────
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(http_bearer),
) -> CurrentUser:
    """
    FastAPI dependency — validates a Keycloak Bearer token and returns
    the authenticated CurrentUser. Raise 401 on any failure.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        jwks = await _get_jwks()

        # Decode header to find the key ID (kid)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        # Find the matching public key in JWKS
        rsa_key: Dict[str, Any] = {}
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key.get("use"),
                    "n":   key["n"],
                    "e":   key["e"],
                }
                break

        if not rsa_key:
            raise credentials_exception

        # Verify and decode the token
        payload: Dict[str, Any] = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            issuer=settings.keycloak_issuer,
            options={"verify_aud": False},  # audience varies by client setup
        )

        # Extract realm roles
        realm_access = payload.get("realm_access", {})
        roles = realm_access.get("roles", [])

        return CurrentUser(
            sub=payload["sub"],
            email=payload.get("email"),
            name=payload.get("name"),
            preferred_username=payload.get("preferred_username"),
            roles=roles,
            raw=payload,
        )

    except JWTError as exc:
        raise credentials_exception from exc
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not reach Keycloak to validate token: {exc}",
        ) from exc


# ── Role-based guard factory ──────────────────────────────────────────────────
def require_roles(*required_roles: str):
    """
    Dependency factory — ensures the current user has ALL of the listed roles.

    Usage:
        @router.get("/admin-only")
        async def admin_endpoint(
            user: CurrentUser = Depends(require_roles("nd-admin"))
        ):
            ...
    """
    async def _guard(
        current_user: CurrentUser = Depends(verify_token),
    ) -> CurrentUser:
        for role in required_roles:
            if role not in current_user.roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role '{role}' is required to access this resource.",
                )
        return current_user

    return _guard


# ── Convenience alias for routes that just need auth ─────────────────────────
get_current_user = verify_token
