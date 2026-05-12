from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MarketGen AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend MarketGen AI funcionando"}

@app.get("/api/dashboard")
def dashboard():
    return {
        "detected": 999,
        "researched": 214,
        "contacted": 156,
        "pending_review": 12,
        "replied": 18,
        "won": 7
    }