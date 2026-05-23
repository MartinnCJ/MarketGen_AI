from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    health,
    reports_mock,
    books_mock,
    customers_mock,
    templates_mock,
    proposals_mock,
)

app = FastAPI(
    title="MarketGen AI API",
    version="1.0.0",
    description="Backend API for MarketGen AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

@app.get("/")
def home():
    return {"message": "Backend MarketGen AI funcionando"}

app.include_router(health.router)
app.include_router(reports_mock.router, prefix=API_PREFIX)
app.include_router(books_mock.router, prefix=API_PREFIX)
app.include_router(customers_mock.router, prefix=API_PREFIX)
app.include_router(templates_mock.router, prefix=API_PREFIX)
app.include_router(proposals_mock.router, prefix=API_PREFIX)