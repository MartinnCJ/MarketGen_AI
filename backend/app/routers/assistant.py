<<<<<<< HEAD
from fastapi import APIRouter

from app.config import settings
import google.generativeai as genai
=======
from fastapi import APIRouter, Body
from openai import OpenAI

from app.config import settings
>>>>>>> 298ebad (Actualizacion de datos)

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post("/chat")
<<<<<<< HEAD
async def assistant_chat(payload: dict):
    message = payload.get("message", "")

    if not message:
        return {"error": "Mensaje vacío"}

    model = genai.GenerativeModel(settings.gemini_default_model)
    response = await model.generate_content_async(message)

    return {
        "reply": response.text
    }
=======
async def assistant_chat(payload: dict = Body(default={})):
    message = payload.get("message", "")

    if not message:
        return {"reply": "Escribe un mensaje para poder ayudarte."}

    client_ai = OpenAI(
        api_key=settings.deepseek_api_key,
        base_url=settings.deepseek_base_url,
    )

    response = client_ai.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {
                "role": "system",
                "content": """
Eres el asistente IA de NoonDalton AI Marketing Suite.

Responde siempre en español.

Ayuda con:
- propuestas comerciales
- automatización con IA
- marketing
- outreach
- BPO
- ventas
- contenido comercial

Responde con estructura clara, párrafos cortos y bullets cuando sea útil.
NO uses markdown excesivo.
""",
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        temperature=0.7,
    )

    return {"reply": response.choices[0].message.content}
>>>>>>> 298ebad (Actualizacion de datos)
