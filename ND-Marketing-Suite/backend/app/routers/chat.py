"""Chat router — stateless AI conversation endpoint backed by Gemini."""
from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies.auth import CurrentUser, get_current_user
from app.services.gemini_service import chat_response

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    role:    str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    session_id: str
    message:    str
    history:    Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response:   str
    session_id: str


@router.post("", response_model=ChatResponse)
async def send_chat_message(
    body: ChatRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Send a message to the AI assistant and return the reply.
    History is passed by the client (last N messages) — no server-side state.
    """
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    history = [{"role": m.role, "content": m.content} for m in (body.history or [])]
    reply = await chat_response(body.message, history)

    return ChatResponse(response=reply, session_id=body.session_id)
