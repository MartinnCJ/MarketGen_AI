from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import assistant
from app.routers import (
    analysis,
    analysis_mock,
    assets,
    assets_mock,
    auth,
    book_assets_mock,
    books,
    books_mock,
    chapters_mock,
    chat,
    chat_mock,
    content_mock,
    customers,
    customers_mock,
    health,
    jobs,
    jobs_mock,
    proposals,
    proposals_mock,
    publishing,
    publishing_mock,
    reports,
    reports_mock,
    settings as settings_router,
    settings_mock,
    social_mock,
    templates,
    templates_mock,
)

app = FastAPI(
    title="MarketGen AI API",
    version="1.0.0",
    description="Backend API for MarketGen AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend MarketGen AI funcionando"}

app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
app.include_router(books.router, prefix="/api/v1")
app.include_router(books_mock.router)
app.include_router(customers.router, prefix="/api/v1")
app.include_router(customers_mock.router)
app.include_router(templates.router, prefix="/api/v1")
app.include_router(templates_mock.router)
app.include_router(assets.router, prefix="/api/v1")
app.include_router(assets_mock.router)
app.include_router(book_assets_mock.router)
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(jobs_mock.router)
app.include_router(reports.router, prefix="/api/v1")
app.include_router(reports_mock.router)
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(analysis_mock.router)
app.include_router(publishing.router, prefix="/api/v1")
app.include_router(publishing_mock.router)
app.include_router(settings_router.router, prefix="/api/v1")
app.include_router(settings_mock.router)
app.include_router(chat.router, prefix="/api/v1")
app.include_router(chat_mock.router)
app.include_router(content_mock.router)
app.include_router(proposals.router, prefix="/api/v1")
app.include_router(proposals_mock.router)
app.include_router(chapters_mock.router)
app.include_router(social_mock.router, prefix="/api/v1")
app.include_router(assistant.router, prefix="/api/v1")
