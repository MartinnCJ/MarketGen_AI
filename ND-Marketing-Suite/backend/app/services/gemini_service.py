"""
Google Gemini LLM service.

Provides typed helpers for all AI operations in the application:
  - generate_chapters()      → chapter outline from book concept
  - generate_chapter_content() → full chapter body
  - refine_content()         → targeted refinement of existing content
  - generate_social_posts()  → platform-specific social media posts
  - generate_proposal_draft()→ full proposal from template + line items
  - translate_content()      → multilingual translation
  - summarize_for_asset()    → condensed content for one-pagers / whitepapers
  - chat_response()          → AI Marketing Strategist conversational response
"""
from __future__ import annotations

import json
import re
from typing import Any, Dict, List, Optional

import google.generativeai as genai

from app.config import settings

# ── Configure Gemini client once ──────────────────────────────────────────────
genai.configure(api_key=settings.gemini_api_key)

# ── Writing style prompts ─────────────────────────────────────────────────────
STYLE_PROMPTS = {
    "professional":    "Use a formal, authoritative, and polished tone.",
    "conversational":  "Use a friendly, approachable, and natural tone.",
    "academic":        "Use rigorous academic language with citations where appropriate.",
    "creative":        "Use vivid, engaging, and imaginative language.",
    "technical":       "Use precise technical language with clear definitions.",
    "persuasive":      "Use compelling, evidence-backed language designed to persuade.",
}

CONTENT_LENGTH = {
    "full":  "Write a comprehensive piece of 2000–4000 words.",
    "long":  "Write a detailed piece of 800–1500 words.",
    "short": "Write a concise piece of 100–280 characters.",
}

SOCIAL_LIMITS = {
    "linkedin":  {"chars": 3000, "note": "Professional tone, include 3–5 relevant hashtags."},
    "twitter":   {"chars": 280,  "note": "Punchy and conversational. One key insight."},
    "facebook":  {"chars": 2000, "note": "Engaging, encourage shares. Friendly tone."},
    "instagram": {"chars": 2200, "note": "Inspiring caption. Include 10–15 relevant hashtags."},
    "tiktok":    {"chars": 300,  "note": "Ultra-short hook. Trendy and energetic."},
    "medium":    {"chars": 5000, "note": "Long-form intro paragraph with a compelling hook."},
}


def _get_model(model_name: Optional[str] = None) -> genai.GenerativeModel:
    name = model_name or settings.gemini_default_model
    return genai.GenerativeModel(
        model_name=name,
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=settings.gemini_max_tokens,
            temperature=settings.gemini_temperature,
        ),
    )


def _safe_json(text: str) -> Any:
    """Extract and parse JSON from a Gemini response that may include markdown fences."""
    # Remove ```json ... ``` wrappers if present
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    return json.loads(cleaned)


async def _generate_text(prompt: str, model_name: Optional[str] = None) -> str:
    """Low-level helper: send a plain text prompt and return the response."""
    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return response.text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Chapter generation
# ─────────────────────────────────────────────────────────────────────────────
async def generate_chapters(
    title: str,
    description: str,
    keywords: List[str],
    chapter_count: int = 5,
    model_name: Optional[str] = None,
) -> List[Dict[str, str]]:
    """
    Ask Gemini to propose N chapters for a book concept.
    Returns list of { title, description } dicts.
    """
    keywords_str = ", ".join(keywords) if keywords else "none provided"

    prompt = f"""You are an expert content strategist.

Book title: {title}
Book description: {description}
Keywords: {keywords_str}

Generate exactly {chapter_count} chapters for this book.
Respond ONLY with a JSON array. Each element must have exactly two fields:
  "title"       – the chapter title (max 80 characters)
  "description" – a one-paragraph writing prompt for this chapter (100–200 words)

Example format:
[
  {{"title": "Chapter Title", "description": "Write a prompt here..."}},
  ...
]"""

    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return _safe_json(response.text)


# ─────────────────────────────────────────────────────────────────────────────
# Full chapter content generation
# ─────────────────────────────────────────────────────────────────────────────
async def generate_chapter_content(
    book_title: str,
    book_description: str,
    chapter_title: str,
    chapter_description: str,
    content_type: str = "long",
    style: str = "professional",
    model_name: Optional[str] = None,
) -> str:
    """Generate the full HTML body for a chapter."""
    length_instruction = CONTENT_LENGTH.get(content_type, CONTENT_LENGTH["long"])
    style_instruction  = STYLE_PROMPTS.get(style, STYLE_PROMPTS["professional"])

    prompt = f"""You are an expert content writer.

Book: {book_title}
Book context: {book_description}

Chapter: {chapter_title}
Chapter directive: {chapter_description}

Instructions:
- {length_instruction}
- {style_instruction}
- Format your response as clean HTML using <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em> tags.
- Do NOT include <html>, <head>, or <body> wrapper tags.
- Do NOT include any preamble or meta-commentary — output the chapter content directly.
"""

    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return response.text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Content refinement
# ─────────────────────────────────────────────────────────────────────────────
async def refine_content(
    existing_content: str,
    instruction: str,
    model_name: Optional[str] = None,
) -> str:
    """Apply a targeted refinement instruction to existing HTML content."""
    prompt = f"""You are an expert editor refining a piece of content.

INSTRUCTION FROM THE USER:
{instruction}

ORIGINAL CONTENT (HTML):
{existing_content}

Apply the instruction and return the REVISED HTML content.
Keep the same HTML structure and formatting.
Do NOT add explanations — output only the revised HTML.
"""

    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return response.text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Social media posts
# ─────────────────────────────────────────────────────────────────────────────
async def generate_social_posts(
    book_title: str,
    content_summary: str,
    platforms: List[str],
    tone: str = "professional",
    model_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Generate one social post per platform."""
    results = []
    model = _get_model(model_name)

    for platform in platforms:
        meta = SOCIAL_LIMITS.get(platform, {"chars": 1000, "note": ""})
        prompt = f"""Write a single social media post for {platform.upper()}.

Book/Content: {book_title}
Summary: {content_summary}
Tone: {tone}
Platform rules: Max {meta['chars']} characters. {meta['note']}

Output ONLY the post text. No labels, no quotes, no commentary.
"""
        response = await model.generate_content_async(prompt)
        text = response.text.strip()
        results.append({
            "platform":       platform,
            "content":        text,
            "characterCount": len(text),
        })

    return results


# ─────────────────────────────────────────────────────────────────────────────
# Proposal draft generation
# ─────────────────────────────────────────────────────────────────────────────
async def generate_proposal_draft(
    template_content: str,
    proposal_name: str,
    customer_name: str,
    customer_company: str,
    proposal_date: str,
    line_items: List[Dict[str, Any]],
    subtotal: float,
    discount: float,
    tax_rate: float,
    total: float,
    business_process: str = "",
    model_name: Optional[str] = None,
) -> str:
    """
    Merge the proposal template with business data and generate
    a polished HTML draft, replacing all {{placeholder}} variables.
    """
    items_text = "\n".join(
        f"- {item['name']}: {item['quantity']} × ${item['unitPrice']:.2f} = ${item['subtotal']:.2f}  — {item.get('description','')}"
        for item in line_items
    )

    prompt = f"""You are a professional proposal writer.

TEMPLATE STRUCTURE (fill in all {{{{placeholder}}}} variables):
{template_content}

PROPOSAL DATA:
- Proposal Name: {proposal_name}
- Customer Name: {customer_name}
- Customer Company: {customer_company}
- Date: {proposal_date}
- Business Context: {business_process or 'Not specified'}

LINE ITEMS:
{items_text}

FINANCIAL SUMMARY:
- Subtotal:  ${subtotal:.2f}
- Discount:  ${discount:.2f}
- Tax ({tax_rate}%): ${(subtotal - discount) * tax_rate / 100:.2f}
- TOTAL:     ${total:.2f}

Generate a complete, professional proposal by:
1. Filling in all {{{{placeholder}}}} variables with the appropriate data.
2. Writing compelling, customised text for each section based on the business context.
3. Formatting the output as clean HTML.
4. Including a formatted services table with all line items.

Output ONLY the HTML content. No preamble or commentary.
"""

    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return response.text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Translation
# ─────────────────────────────────────────────────────────────────────────────
async def translate_content(
    content: str,
    target_language: str,
    adapt_cultural_nuances: bool = True,
    model_name: Optional[str] = None,
) -> str:
    """Translate HTML content to the target language."""
    cultural_note = (
        "Adapt idioms and cultural references to be natural in the target culture."
        if adapt_cultural_nuances
        else "Translate literally, preserving the original phrasing as closely as possible."
    )

    prompt = f"""Translate the following HTML content to {target_language}.

Rules:
- Preserve all HTML tags and structure exactly.
- Only translate the text content inside the tags.
- {cultural_note}
- Output ONLY the translated HTML. No commentary.

CONTENT:
{content}
"""

    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return response.text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# AI Marketing Chat
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are an expert AI Marketing Strategist for NoonDalton AI Marketing Suite.
Your role is to help marketing managers and content creators with:
- Content strategy and planning
- Marketing performance analysis
- Publishing schedule optimisation
- Audience targeting and engagement
- B2B proposal best practices

Be concise, actionable, and data-driven in your responses.
When referencing specific content or proposals from the context provided, use them to give personalised advice."""


async def chat_response(
    message: str,
    history: List[Dict[str, str]],
    context: Optional[Dict[str, Any]] = None,
    model_name: Optional[str] = None,
) -> str:
    """Generate a conversational AI marketing strategist response."""
    context_block = ""
    if context:
        context_block = f"\n\nCONTEXT:\n{json.dumps(context, indent=2)}"

    # Build conversation history for multi-turn
    model = _get_model(model_name)
    chat = model.start_chat(history=[
        {"role": msg["role"], "parts": [msg["content"]]}
        for msg in history
    ])

    full_message = f"{SYSTEM_PROMPT}{context_block}\n\nUSER: {message}"
    response = await chat.send_message_async(full_message)
    return response.text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# SEO Analysis
# ─────────────────────────────────────────────────────────────────────────────
async def analyse_seo(
    content: str,
    title: str = "",
    keywords: Optional[List[str]] = None,
    model_name: Optional[str] = None,
) -> Dict[str, Any]:
    """Return an SEO score and actionable recommendations."""
    kw_str = ", ".join(keywords) if keywords else "none provided"

    prompt = f"""You are an SEO expert. Analyse the following content and return a JSON object.

Title: {title}
Target Keywords: {kw_str}

CONTENT:
{content[:8000]}

Return ONLY a JSON object with this exact structure:
{{
  "score": <integer 0-100>,
  "breakdown": {{
    "keywordDensity": <integer 0-100>,
    "readability": <integer 0-100>,
    "headingStructure": <integer 0-100>,
    "metaQuality": <integer 0-100>
  }},
  "recommendations": [
    "<actionable recommendation in Spanish>",
    ...
  ]
}}"""

    model = _get_model(model_name)
    response = await model.generate_content_async(prompt)
    return _safe_json(response.text)
