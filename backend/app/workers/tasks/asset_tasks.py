"""
Celery tasks for marketing asset generation.

Tasks:
  task_generate_one_pager     — PDF/HTML one-pager from book summary
  task_generate_whitepaper    — Full whitepaper PDF from book chapters
  task_generate_social_posts  — Social media posts (LinkedIn/Twitter/Instagram)
  task_generate_infographic   — Infographic JSON data structure
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional

from celery import Task

from app.workers.celery_app import celery_app
from app.services import gemini_service
from app.services.firestore_service import assets_repo, jobs_repo
from app.services.storage_service import storage_service

logger = logging.getLogger(__name__)


def _run(coro):
    """Run an async coroutine from a sync Celery task."""
    return asyncio.get_event_loop().run_until_complete(coro)


# ── One-Pager ─────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10, queue="llm")
def task_generate_one_pager(
    self: Task,
    job_id:   str,
    asset_id: str,
    book:     Dict[str, Any],
    options:  Dict[str, Any],
):
    """Generate a one-pager HTML document for the book, then export to PDF."""
    try:
        _run(jobs_repo.update_progress(job_id, 20, "processing"))
        _run(assets_repo.update(asset_id, {"status": "generating"}))

        # Use Gemini to write the one-pager copy
        prompt = (
            f"Write a professional one-pager for the following book:\n"
            f"Title: {book['title']}\n"
            f"Description: {book.get('description', '')}\n"
            f"Target audience: {book.get('targetAudience', '')}\n"
            f"Language: {options.get('language', 'es')}\n"
            f"Style: {options.get('style', 'professional')}\n\n"
            "Include: headline, problem statement, solution, key benefits (3-4 bullets), "
            "call to action. Return as clean HTML (no <html>/<body> wrapper, just inner content)."
        )
        html_content = _run(gemini_service._generate_text(prompt))

        _run(jobs_repo.update_progress(job_id, 60, "processing"))

        # Wrap in a styled HTML shell
        full_html = f"""
        <html><head><style>
          body {{ font-family: 'Helvetica Neue', sans-serif; margin: 40px; color: #1e293b; }}
          h1 {{ color: #6366f1; font-size: 2em; margin-bottom: 0.5em; }}
          h2 {{ color: #475569; font-size: 1.2em; }}
          ul {{ padding-left: 1.5em; }}
          li {{ margin-bottom: 0.5em; }}
          .cta {{ background: #6366f1; color: white; padding: 12px 24px;
                  border-radius: 8px; display: inline-block; margin-top: 20px; }}
        </style></head><body>
        {html_content}
        </body></html>
        """

        # Convert to PDF with WeasyPrint
        from weasyprint import HTML
        pdf_bytes = HTML(string=full_html).write_pdf()

        # Upload to Supabase Storage
        path = storage_service.asset_path(asset_id, "one-pager.pdf")
        _run(storage_service.upload_bytes(path, pdf_bytes, "application/pdf"))
        url = _run(storage_service.get_signed_url(path, expires_in=86400 * 7))

        _run(assets_repo.update(asset_id, {
            "status":      "ready",
            "content":     html_content,
            "storagePath": path,
            "downloadUrl": url,
            "mimeType":    "application/pdf",
        }))
        _run(jobs_repo.complete_job(job_id, {"assetId": asset_id, "url": url}))
        logger.info("one_pager done: job=%s asset=%s", job_id, asset_id)

    except Exception as exc:
        logger.exception("one_pager failed: job=%s", job_id)
        _run(assets_repo.update(asset_id, {"status": "error"}))
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ── Whitepaper ────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=2, default_retry_delay=30, queue="llm")
def task_generate_whitepaper(
    self:     Task,
    job_id:   str,
    asset_id: str,
    book:     Dict[str, Any],
    chapters: List[Dict[str, Any]],
    options:  Dict[str, Any],
):
    """Compile all chapter content into a whitepaper PDF."""
    try:
        _run(jobs_repo.update_progress(job_id, 10, "processing"))
        _run(assets_repo.update(asset_id, {"status": "generating"}))

        n = len(chapters)
        chapter_html_parts = []

        for i, ch in enumerate(chapters):
            content = ch.get("content", "")
            if not content:
                # Generate on-the-fly if missing
                content = _run(gemini_service.generate_chapter_content(
                    book_title=book["title"],
                    book_description=book.get("description", ""),
                    chapter_title=ch["title"],
                    chapter_description=ch.get("description", ""),
                    content_type=options.get("style", "academic"),
                    style=options.get("style", "academic"),
                ))
            chapter_html_parts.append(
                f"<h2>{i + 1}. {ch['title']}</h2>\n{content}"
            )
            progress = int(10 + ((i + 1) / n) * 70)
            _run(jobs_repo.update_progress(job_id, progress, "processing"))

        full_html = f"""
        <html><head><style>
          body {{ font-family: Georgia, serif; margin: 60px; color: #1e293b; line-height: 1.7; }}
          h1 {{ color: #6366f1; font-size: 2.4em; text-align: center; margin-bottom: 0.3em; }}
          h2 {{ color: #4f46e5; font-size: 1.5em; margin-top: 2em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }}
          p  {{ text-align: justify; }}
          .cover {{ text-align: center; padding: 80px 0; }}
          .cover p {{ font-size: 1.2em; color: #64748b; }}
        </style></head><body>
        <div class="cover">
          <h1>{book['title']}</h1>
          <p>{book.get('description', '')}</p>
        </div>
        <hr/>
        {''.join(chapter_html_parts)}
        </body></html>
        """

        from weasyprint import HTML
        pdf_bytes = HTML(string=full_html).write_pdf()

        path = storage_service.asset_path(asset_id, "whitepaper.pdf")
        _run(storage_service.upload_bytes(path, pdf_bytes, "application/pdf"))
        url = _run(storage_service.get_signed_url(path, expires_in=86400 * 7))

        _run(assets_repo.update(asset_id, {
            "status":      "ready",
            "storagePath": path,
            "downloadUrl": url,
            "mimeType":    "application/pdf",
        }))
        _run(jobs_repo.complete_job(job_id, {"assetId": asset_id, "url": url}))
        logger.info("whitepaper done: job=%s asset=%s", job_id, asset_id)

    except Exception as exc:
        logger.exception("whitepaper failed: job=%s", job_id)
        _run(assets_repo.update(asset_id, {"status": "error"}))
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ── Social Posts ──────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10, queue="llm")
def task_generate_social_posts(
    self:    Task,
    job_id:  str,
    asset_id: str,
    book:    Dict[str, Any],
    chapter: Optional[Dict[str, Any]],
    options: Dict[str, Any],
):
    """Generate platform-specific social media posts."""
    try:
        _run(jobs_repo.update_progress(job_id, 20, "processing"))
        _run(assets_repo.update(asset_id, {"status": "generating"}))

        content_ref = (
            chapter["content"] if chapter and chapter.get("content")
            else book.get("description", book["title"])
        )

        posts = _run(gemini_service.generate_social_posts(
            book_title=book["title"],
            content_summary=content_ref,
            platforms=options.get("platforms", ["linkedin", "twitter", "instagram"]),
            tone=options.get("tone", "professional"),
        ))

        _run(assets_repo.update(asset_id, {
            "status":  "ready",
            "content": json.dumps(posts, ensure_ascii=False),
            "mimeType": "application/json",
        }))
        _run(jobs_repo.complete_job(job_id, {"assetId": asset_id, "posts": posts}))
        logger.info("social_posts done: job=%s asset=%s", job_id, asset_id)

    except Exception as exc:
        logger.exception("social_posts failed: job=%s", job_id)
        _run(assets_repo.update(asset_id, {"status": "error"}))
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ── Infographic ───────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10, queue="llm")
def task_generate_infographic(
    self:    Task,
    job_id:  str,
    asset_id: str,
    book:    Dict[str, Any],
    options: Dict[str, Any],
):
    """
    Generate a structured JSON data payload for an infographic.
    The frontend renders this with a canvas or SVG library.
    """
    try:
        _run(jobs_repo.update_progress(job_id, 20, "processing"))
        _run(assets_repo.update(asset_id, {"status": "generating"}))

        prompt = (
            f"Create a structured JSON data payload for an infographic about:\n"
            f"Title: {book['title']}\n"
            f"Description: {book.get('description', '')}\n\n"
            "The JSON must have this structure:\n"
            '{"title": "...", "subtitle": "...", "sections": ['
            '{"heading": "...", "stat": "...", "description": "..."}], '
            '"keyPoints": ["...", ...], "callToAction": "..."}\n'
            "Return only the JSON, no markdown."
        )
        raw = _run(gemini_service._generate_text(prompt))
        infographic_data = gemini_service._safe_json(raw)

        content_str = json.dumps(infographic_data, ensure_ascii=False)

        _run(assets_repo.update(asset_id, {
            "status":  "ready",
            "content": content_str,
            "mimeType": "application/json",
        }))
        _run(jobs_repo.complete_job(job_id, {"assetId": asset_id, "data": infographic_data}))
        logger.info("infographic done: job=%s asset=%s", job_id, asset_id)

    except Exception as exc:
        logger.exception("infographic failed: job=%s", job_id)
        _run(assets_repo.update(asset_id, {"status": "error"}))
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)
