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