"""Content analysis router — SEO scoring, AI-detection, plagiarism check."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from app.dependencies.auth import CurrentUser, get_current_user
from app.services import gemini_service

router = APIRouter(prefix="/analysis", tags=["Content Analysis"])


class ContentAnalysisRequest(BaseModel):
    content:    str
    bookId:     Optional[str] = None
    chapterId:  Optional[str] = None
    language:   str = "es"


# ── SEO Analysis ──────────────────────────────────────────────────────────────
@router.post("/seo")
async def analyse_seo(
    body: ContentAnalysisRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Analyse content for SEO quality.
    Returns: keyword density, readability score, suggested improvements, meta tags.
    """
    result = await gemini_service.analyse_seo(
        content=body.content,
        language=body.language,
    )
    return result


# ── AI Detection ──────────────────────────────────────────────────────────────
@router.post("/ai-detection")
async def ai_detection(
    body: ContentAnalysisRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Estimate the probability that content was AI-generated.
    Uses heuristic analysis via Gemini (not a dedicated detector model).
    Returns: score 0-100, indicators, suggestions to humanise.
    """
    prompt = (
        "You are an AI content detection expert. Analyse the following text and estimate:\n"
        "1. AI probability score (0-100, where 100 = definitely AI-generated)\n"
        "2. Key indicators that suggest AI or human authorship\n"
        "3. Specific suggestions to make the text sound more human\n\n"
        f"Text to analyse:\n{body.content[:4000]}\n\n"
        'Return JSON: {"score": 0-100, "verdict": "...", '
        '"indicators": ["..."], "suggestions": ["..."]}'
    )
    raw = await gemini_service._generate_text(prompt)
    result = gemini_service._safe_json(raw)
    return result if isinstance(result, dict) else {"score": 0, "verdict": "analysis_failed", "indicators": [], "suggestions": []}


# ── Plagiarism Check ──────────────────────────────────────────────────────────
@router.post("/plagiarism")
async def plagiarism_check(
    body: ContentAnalysisRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Lightweight originality analysis using Gemini.
    Note: This is NOT a full web plagiarism check — it analyses structural
    patterns and common phrases that may indicate derivative content.
    Returns: originality_score, flagged_phrases, recommendations.
    """
    prompt = (
        "You are a content originality expert. Analyse the following text for:\n"
        "1. Originality score (0-100, where 100 = fully original)\n"
        "2. Any phrases that sound generic, clichéd, or potentially derivative\n"
        "3. Recommendations to improve originality\n\n"
        f"Text:\n{body.content[:4000]}\n\n"
        'Return JSON: {"originality_score": 0-100, "verdict": "...", '
        '"flagged_phrases": ["..."], "recommendations": ["..."]}'
    )
    raw = await gemini_service._generate_text(prompt)
    result = gemini_service._safe_json(raw)
    return result if isinstance(result, dict) else {
        "originality_score": 75, "verdict": "analysis_inconclusive",
        "flagged_phrases": [], "recommendations": [],
    }
