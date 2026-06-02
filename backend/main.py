from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD

# Routers
from app.routers import (
    reports_mock,
    books_mock,
    customers_mock,
    templates_mock,
    proposals_mock,
)

# ── App ─────────────────────────────────────────────
app = FastAPI(
    title="MarketGen AI API",
    version="1.0.0",
    description="Backend API for MarketGen AI",
)

# ── CORS ────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],

)

# ── Root ────────────────────────────────────────────
@app.get("/")
def home():
    return {"message": "Backend MarketGen AI funcionando"}

# ── Routers ─────────────────────────────────────────
app.include_router(reports_mock.router)
app.include_router(books_mock.router)
app.include_router(customers_mock.router)
app.include_router(templates_mock.router)
app.include_router(proposals_mock.router)
=======
import os

from app.routers import proposals, books, customers, templates, settings

app = FastAPI(title="MarketGen AI API", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
def home():
    return {"message": "Backend MarketGen AI funcionando"}

# Routers reales
app.include_router(proposals.router, prefix="/api/v1")
app.include_router(books.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(templates.router, prefix="/api/v1")
app.include_router(settings.router, prefix="/api/v1")
>>>>>>> 298ebad (Actualizacion de datos)
