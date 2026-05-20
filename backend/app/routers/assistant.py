from fastapi import APIRouter

from app.config import settings
import google.generativeai as genai

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post("/chat")
async def assistant_chat(payload: dict):
    message = payload.get("message", "")

    if not message:
        return {"error": "Mensaje vacío"}

    model = genai.GenerativeModel(settings.gemini_default_model)
    response = await model.generate_content_async(message)

    return {
        "reply": response.text
    }