from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

<<<<<<< HEAD
from app.routers import assistant
from app.routers import (
    auth,
    health,
    reports_mock,
    settings_mock,
    chat_mock,
    jobs_mock,
    content_mock, 
    analysis_mock,
    assets_mock,
    book_assets_mock,
    books_mock,
    publishing_mock,
    chapters_mock,
    customers_mock,
    templates_mock,
    proposals_mock,
    social_mock,
=======
from app.config import settings
from app.routers import (
    analysis,
    assets,
    assistant,
    auth,
    books,
    chat,
    customers,
    health,
    jobs,
    proposals,
    publishing,
    reports,
    settings as settings_router,
    social_mock,
    templates,
>>>>>>> 298ebad (Actualizacion de datos)
)

app = FastAPI(
    title="MarketGen AI API",
    version="1.0.0",
    description="Backend API for MarketGen AI",
)

app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=[
        "https://market-gen-ai-indol.vercel.app",
        "https://market-gen-ai-git-main-patyy1964s-projects.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
=======
    allow_origins=settings.cors_origins,
>>>>>>> 298ebad (Actualizacion de datos)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
=======

>>>>>>> 298ebad (Actualizacion de datos)
@app.get("/")
def home():
    return {"message": "Backend MarketGen AI funcionando"}

<<<<<<< HEAD
app.include_router(auth.router) 
app.include_router(health.router)
app.include_router(reports_mock.router)
app.include_router(settings_mock.router)
app.include_router(chat_mock.router)
app.include_router(jobs_mock.router)
app.include_router(content_mock.router)
app.include_router(analysis_mock.router)
app.include_router(assets_mock.router)
app.include_router(book_assets_mock.router)
app.include_router(books_mock.router)
app.include_router(publishing_mock.router)
app.include_router(chapters_mock.router)
app.include_router(customers_mock.router)
app.include_router(templates_mock.router)
app.include_router(proposals_mock.router)
app.include_router(social_mock.router)
app.include_router(assistant.router)
=======

app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
app.include_router(books.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(templates.router, prefix="/api/v1")
app.include_router(assets.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(publishing.router, prefix="/api/v1")
app.include_router(settings_router.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(proposals.router, prefix="/api/v1")
app.include_router(social_mock.router, prefix="/api/v1")
app.include_router(assistant.router, prefix="/api/v1")
>>>>>>> 298ebad (Actualizacion de datos)
