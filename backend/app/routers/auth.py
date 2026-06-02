"""
Router — Authentication
Endpoints del API Reference sección 1:

    POST /auth/login            (1.1) Autenticar y obtener tokens JWT
    POST /auth/logout           (1.2) Invalidar refresh token
    POST /auth/refresh          (1.3) Renovar access token
    POST /auth/forgot-password  (1.4) Solicitar reset de contraseña
    POST /auth/reset-password   (1.5) Establecer nueva contraseña

IMPORTANTE:
  - Estos endpoints NO llevan el prefijo /api/v1 porque son rutas públicas.
  - El proyecto usa Keycloak como proveedor de identidad (JWT RS256 via JWKS).
  - Los endpoints de /api/v1/* usan `get_current_user` de dependencies/auth.py.
  - Estos endpoints son la capa FastAPI que llama a Keycloak por debajo.

Flujo de autenticación:
  Frontend → POST /auth/login → este router → Keycloak token endpoint
           ← { accessToken, refreshToken, expiresIn, user }
  Frontend → GET /api/v1/books (Authorization: Bearer <token>)
           → dependencies/auth.py verify_token() → valida contra Keycloak JWKS
"""

import httpx
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import Response

from app.config import settings
from app.dependencies.auth import get_current_user, CurrentUser
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RefreshRequest,
    RefreshResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
    UserInfo,
)
"""Authentication router backed by Firestore users."""
from __future__ import annotations

from datetime import datetime, timezone


from app.schemas.auth import (
    RegisterRequest,
)
from app.services.auth_service import (
    create_access_token,
    hash_password,
    hash_token,
    new_opaque_token,
    public_user,
    refresh_expires_at,
    reset_expires_at,
    utc_now,
    verify_password,
)
from app.services.firestore_service import (
    password_reset_tokens_repo,
    refresh_tokens_repo,
    users_repo,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Helper: llamar al token endpoint de Keycloak ──────────────────────────────

async def _keycloak_token_request(data: dict) -> dict:
    """
    Hace una petición al token endpoint de Keycloak y devuelve la respuesta.
    Lanza HTTPException con el código apropiado si Keycloak responde con error.
    """
    url = (
        f"{settings.keycloak_url}/realms/{settings.keycloak_realm}"
        "/protocol/openid-connect/token"
    )
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(url, data=data)
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Keycloak no disponible: {exc}",
            ) from exc

    if resp.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Email o contraseña incorrectos."},
        )
    if resp.status_code == 400:
        body = resp.json()
        error = body.get("error", "bad_request")
        if error == "invalid_grant":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"code": "TOKEN_EXPIRED_OR_REVOKED", "message": "Token inválido o expirado."},
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "BAD_REQUEST", "message": body.get("error_description", error)},
        )
    if not resp.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_SERVER_ERROR", "message": "Error inesperado en Keycloak."},
        )

    return resp.json()


async def _keycloak_userinfo(access_token: str) -> dict:
    """Obtiene información del usuario desde el userinfo endpoint de Keycloak."""
    url = (
        f"{settings.keycloak_url}/realms/{settings.keycloak_realm}"
        "/protocol/openid-connect/userinfo"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, headers={"Authorization": f"Bearer {access_token}"})

    if not resp.is_success:
        return {}
    return resp.json()


# ─────────────────────────────────────────────────────────────────────────────
# 1.1  POST /auth/login
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Autenticar usuario y obtener tokens JWT",
    responses={
        400: {"description": "BAD_REQUEST — campos faltantes o malformados"},
        401: {"description": "INVALID_CREDENTIALS — email/contraseña incorrectos"},
        403: {"description": "ACCOUNT_DISABLED — cuenta suspendida"},
        429: {"description": "RATE_LIMIT_EXCEEDED — demasiados intentos fallidos"},
        500: {"description": "INTERNAL_SERVER_ERROR"},
    },
)
async def login(body: LoginRequest) -> LoginResponse:
    """
    Valida las credenciales contra Keycloak y devuelve:
    - `accessToken`: JWT de corta duración para incluir en Authorization header
    - `refreshToken`: token de larga duración para renovar el access token
    - `expiresIn`: segundos hasta que expira el access token
    - `user`: información básica del usuario autenticado

    El access token debe enviarse como `Authorization: Bearer <token>`
    en todas las peticiones a `/api/v1/*`.
    """
    token_data = await _keycloak_token_request({
        "grant_type":    "password",
        "client_id":     settings.keycloak_client_id,
        "client_secret": settings.keycloak_client_secret,
        "username":      body.email,
        "password":      body.password,
        "scope":         "openid email profile",
    })

    userinfo = await _keycloak_userinfo(token_data["access_token"])

    return LoginResponse(
        accessToken=token_data["access_token"],
        refreshToken=token_data["refresh_token"],
        expiresIn=token_data.get("expires_in", 300),
        user=UserInfo(
            id=userinfo.get("sub", ""),
            email=userinfo.get("email", body.email),
            name=userinfo.get("name", userinfo.get("preferred_username", "")),
            role=", ".join(
                userinfo.get("realm_access", {}).get("roles", ["user"])
            ),
        ),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 1.2  POST /auth/logout
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Invalidar refresh token y cerrar sesión",
    responses={
        400: {"description": "INVALID_TOKEN — refresh token malformado o ya expirado"},
        401: {"description": "UNAUTHORIZED — JWT faltante o inválido"},
        500: {"description": "INTERNAL_SERVER_ERROR"},
    },
)
def _is_expired(value) -> bool:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc) <= utc_now()
    return True


async def _issue_session(user: dict) -> LoginResponse:
    access_token = create_access_token(user)
    refresh_token = new_opaque_token()
    await refresh_tokens_repo.create_token(
        hash_token(refresh_token),
        {
            "userId": user["id"],
            "expiresAt": refresh_expires_at(),
            "revokedAt": None,
        },
    )
    await users_repo.touch_login(user["id"])
    public = public_user(user)
    return LoginResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        expiresIn=settings.access_token_expire_minutes * 60,
        user=UserInfo(**public),
    )


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest) -> LoginResponse:
    email = body.email.lower()
    existing = await users_repo.get_by_email(email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "EMAIL_ALREADY_REGISTERED", "message": "El email ya esta registrado."},
        )

    user = await users_repo.create_user(
        {
            "email": email,
            "name": body.name,
            "passwordHash": hash_password(body.password),
            "roles": ["user"],
            "status": "active",
        }
    )
    return await _issue_session(user)


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(body: LoginRequest) -> LoginResponse:
    user = await users_repo.get_by_email(body.email.lower())
    if not user or not verify_password(body.password, user.get("passwordHash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Email o contrasena incorrectos."},
        )
    if user.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "ACCOUNT_DISABLED", "message": "La cuenta esta deshabilitada."},
        )
    return await _issue_session(user)


@router.post("/refresh", response_model=RefreshResponse, status_code=status.HTTP_200_OK)
async def refresh_token(body: RefreshRequest) -> RefreshResponse:
    token_hash = hash_token(body.refresh_token)
    stored = await refresh_tokens_repo.get(token_hash)
    if not stored or stored.get("revokedAt") or _is_expired(stored.get("expiresAt")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_EXPIRED_OR_REVOKED", "message": "Refresh token invalido o expirado."},
        )

    user = await users_repo.get(stored["userId"])
    if not user or user.get("status") != "active":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable.")

    await refresh_tokens_repo.revoke(token_hash)
    new_session = await _issue_session(user)
    return RefreshResponse(
        accessToken=new_session.accessToken,
        expiresIn=new_session.expiresIn,
        refreshToken=new_session.refreshToken,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    body: LogoutRequest,
    current_user: CurrentUser = Depends(get_current_user),
) -> Response:
    """
    Añade el refresh token a la denylist de Keycloak para que no pueda
    usarse para obtener nuevos access tokens.

    El access token de corta duración expirará naturalmente.
    El cliente debe también descartarlo localmente.
    """
    url = (
        f"{settings.keycloak_url}/realms/{settings.keycloak_realm}"
        "/protocol/openid-connect/logout"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(url, data={
            "client_id":     settings.keycloak_client_id,
            "client_secret": settings.keycloak_client_secret,
            "refresh_token": body.refreshToken,
        })
    # Devolvemos 204 independientemente de si Keycloak aceptó o no
    # (el token puede ya haber expirado y eso es válido)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ─────────────────────────────────────────────────────────────────────────────
# 1.3  POST /auth/refresh
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/refresh",
    response_model=RefreshResponse,
    status_code=status.HTTP_200_OK,
    summary="Renovar access token con el refresh token",
    responses={
        400: {"description": "MISSING_TOKEN — campo refresh_token ausente"},
        401: {"description": "TOKEN_EXPIRED | TOKEN_REVOKED"},
        500: {"description": "INTERNAL_SERVER_ERROR"},
    },
)
async def refresh_token(body: RefreshRequest) -> RefreshResponse:
    """
    Intercambia un refresh token válido por un nuevo access token
    sin necesidad de que el usuario vuelva a ingresar sus credenciales.

    Llamado automáticamente por el interceptor de axios cuando el
    access token está próximo a expirar.
    """
    token_data = await _keycloak_token_request({
        "grant_type":    "refresh_token",
        "client_id":     settings.keycloak_client_id,
        "client_secret": settings.keycloak_client_secret,
        "refresh_token": body.refresh_token,
    })

    return RefreshResponse(
        accessToken=token_data["access_token"],
        expiresIn=token_data.get("expires_in", 300),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 1.4  POST /auth/forgot-password
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Solicitar enlace de reset de contraseña",
    responses={
        400: {"description": "INVALID_EMAIL — formato de email inválido"},
        429: {"description": "RATE_LIMIT_EXCEEDED — cooldown de 5 minutos por email"},
        500: {"description": "INTERNAL_SERVER_ERROR"},
    },
)
async def forgot_password(body: ForgotPasswordRequest) -> MessageResponse:
    """
    Genera un token de reset de contraseña de un solo uso y envía un email
    al usuario con el enlace de reset (válido por 1 hora).

    **La respuesta es idéntica independientemente de si el email existe**,
    para prevenir enumeración de usuarios (anti-enumeration).

    Keycloak maneja internamente el envío del email y la gestión del token.
    
    url = (
        f"{settings.keycloak_url}/realms/{settings.keycloak_realm}"
        "/protocol/openid-connect/reset-password-email"
    )
    """
    # Keycloak Admin API requiere un service account para esto.
    # Alternativa más simple: ejecutar la acción UPDATE_PASSWORD via Admin REST API.
    # Por ahora usamos el flujo estándar de Keycloak via Admin Client.
    # TODO: implementar con Keycloak Admin REST API usando service account.
    #
    # Independientemente del resultado, siempre devolvemos el mismo mensaje
    # para no revelar si el email existe en el sistema.
    return MessageResponse(
        message="Si el email existe en el sistema, recibirás un enlace de reset en breve."
    )


# ─────────────────────────────────────────────────────────────────────────────
# 1.5  POST /auth/reset-password
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/reset-password",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Establecer nueva contraseña con token de reset",
    responses={
        400: {"description": "INVALID_TOKEN | TOKEN_EXPIRED | WEAK_PASSWORD"},
        500: {"description": "INTERNAL_SERVER_ERROR"},
    },
)
async def reset_password(body: ResetPasswordRequest) -> MessageResponse:
    """
    Valida el token de reset recibido por email (máximo 1 hora de vigencia),
    actualiza la contraseña del usuario e invalida todos los refresh tokens
    existentes para esa cuenta.

    Keycloak maneja la validación del token y el cambio de contraseña
    a través de su flujo estándar de reset.

    TODO: completar integración con Keycloak Admin REST API.
    """
    # Flujo con Keycloak Admin REST API:
    # 1. GET /admin/realms/{realm}/users?email=... → obtener userId
    # 2. Verificar que el token sea válido (Keycloak lo gestiona internamente)
    # 3. PUT /admin/realms/{realm}/users/{userId}/reset-password
    #    body: { type: "password", value: body.new_password, temporary: false }
    # 4. DELETE /admin/realms/{realm}/users/{userId}/sessions → invalidar sesiones
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail={
            "code": "NOT_IMPLEMENTED",
            "message": "Reset de contraseña pendiente de integración con Keycloak Admin API.",
        },
    )
    token_hash = hash_token(body.refreshToken)
    stored = await refresh_tokens_repo.get(token_hash)
    if stored and stored.get("userId") == current_user.sub and not stored.get("revokedAt"):
        await refresh_tokens_repo.revoke(token_hash)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/forgot-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def forgot_password(body: ForgotPasswordRequest) -> MessageResponse:
    user = await users_repo.get_by_email(body.email.lower())
    if user:
        reset_token = new_opaque_token()
        await password_reset_tokens_repo.create_token(
            hash_token(reset_token),
            {
                "userId": user["id"],
                "expiresAt": reset_expires_at(),
                "usedAt": None,
            },
        )
        # MVP note: wire this token into email delivery before production.
    return MessageResponse(
        message="Si el email existe en el sistema, recibiras un enlace de reset en breve."
    )


@router.post("/reset-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def reset_password(body: ResetPasswordRequest) -> MessageResponse:
    token_hash = hash_token(body.token)
    stored = await password_reset_tokens_repo.get(token_hash)
    if not stored or stored.get("usedAt") or _is_expired(stored.get("expiresAt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_TOKEN", "message": "Token invalido o expirado."},
        )

    user = await users_repo.get(stored["userId"])
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token.")

    await users_repo.update(user["id"], {"passwordHash": hash_password(body.new_password)})
    await password_reset_tokens_repo.mark_used(token_hash)
    return MessageResponse(message="Contrasena actualizada correctamente.")
