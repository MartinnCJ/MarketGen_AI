from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    allow_credentials=True,
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