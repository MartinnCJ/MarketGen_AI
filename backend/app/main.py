"""
NoonDalton AI Marketing Suite — FastAPI application entry point.
"""
# app.include_router(books.router,             prefix=API_PREFIX)
# app.include_router(jobs.router,              prefix=API_PREFIX)
# app.include_router(proposals.router,         prefix=API_PREFIX)
# app.include_router(customers.router,         prefix=API_PREFIX)
# app.include_router(settings_router.router,   prefix=API_PREFIX)
# app.include_router(chat.router,              prefix=API_PREFIX)
# app.include_router(reports.router,           prefix=API_PREFIX)
# app.include_router(assets.router,            prefix=API_PREFIX)
# app.include_router(templates.router,         prefix=API_PREFIX)
# app.include_router(analysis.router,          prefix=API_PREFIX)
# app.include_router(publishing.router,        prefix=API_PREFIX)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    health, auth
)

# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Backend API for the NoonDalton AI Marketing Suite.",
    docs_url="/docs" if settings.app_debug else None,
    redoc_url="/redoc" if settings.app_debug else None,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth.router)

# Health (no prefix — used by Cloud Run health checks)
app.include_router(health.router)

# Core feature routers
# app.include_router(books.router,             prefix=API_PREFIX)
# app.include_router(jobs.router,              prefix=API_PREFIX)
# app.include_router(proposals.router,         prefix=API_PREFIX)
# app.include_router(customers.router,         prefix=API_PREFIX)
# app.include_router(settings_router.router,   prefix=API_PREFIX)
# app.include_router(chat.router,              prefix=API_PREFIX)
# app.include_router(reports.router,           prefix=API_PREFIX)
# app.include_router(assets.router,            prefix=API_PREFIX)
# app.include_router(templates.router,         prefix=API_PREFIX)
# app.include_router(analysis.router,          prefix=API_PREFIX)
# app.include_router(publishing.router,        prefix=API_PREFIX)
