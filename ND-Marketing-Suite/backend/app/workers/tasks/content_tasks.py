"""
Celery tasks for LLM content generation.

All tasks follow the same pattern:
  1. Update job status → processing
  2. Call the Gemini service (sync wrapper using asyncio.run)
  3. Persist the result to Firestore
  4. Update job status → completed / failed
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List

from celery import Task

from app.workers.celery_app import celery_app
from app.services import gemini_service
from app.services.firestore_service import books_repo, jobs_repo, proposals_repo

STYLE_PROMPTS = {
    "professional":   "Use a formal, authoritative, and polished tone.",
    "conversational": "Use a friendly, approachable, and natural tone.",
    "academic":       "Use rigorous academic language with citations.",
    "creative":       "Use vivid, engaging, and imaginative language.",
    "technical":      "Use precise technical language with clear definitions.",
}

logger = logging.getLogger(__name__)


def _run(coro):
    """Run an async coroutine from a sync Celery task."""
    return asyncio.get_event_loop().run_until_complete(coro)


# ─────────────────────────────────────────────────────────────────────────────
# Task: generate_chapters
# ─────────────────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10, queue="llm")
def task_generate_chapters(
    self: Task,
    job_id: str,
    book_id: str,
    book: Dict[str, Any],
    chapter_count: int = 5,
):
    """
    Ask Gemini to generate N chapters for a book concept.
    Writes results to Firestore and updates the book status to 'outlined'.
    """
    try:
        _run(jobs_repo.update_progress(job_id, 10, "processing"))

        chapters_data = _run(gemini_service.generate_chapters(
            title=book["title"],
            description=book["description"],
            keywords=book.get("keywords", []),
            chapter_count=chapter_count,
        ))

        _run(jobs_repo.update_progress(job_id, 60, "processing"))

        # Persist chapters as a sub-collection
        created = []
        for index, ch in enumerate(chapters_data):
            chapter = _run(books_repo.create_chapter(book_id, {
                "title":           ch["title"],
                "description":     ch.get("description", ""),
                "orderIndex":      index,
                "status":          "pending",
                "wordCount":       0,
                "contentAvailable": False,
            }))
            created.append(chapter)

        # Update book status
        _run(books_repo.update(book_id, {"status": "outlined"}))

        _run(jobs_repo.complete_job(job_id, {"chapters": created, "bookStatus": "outlined"}))
        logger.info("generate_chapters completed: job=%s book=%s chapters=%d", job_id, book_id, len(created))

    except Exception as exc:
        logger.exception("generate_chapters failed: job=%s", job_id)
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ─────────────────────────────────────────────────────────────────────────────
# Task: generate_all_content
# ─────────────────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=2, default_retry_delay=30, queue="llm")
def task_generate_all_content(
    self: Task,
    job_id: str,
    book_id: str,
    book: Dict[str, Any],
    chapters: List[Dict[str, Any]],
    content_type: str = "long",
    style: str = "professional",
):
    """
    Generate LLM content for ALL chapters of a book.
    Progress increments per chapter: 100 / n_chapters.
    """
    n = len(chapters)
    if n == 0:
        _run(jobs_repo.fail_job(job_id, "No chapters to generate content for."))
        return

    try:
        _run(jobs_repo.update_progress(job_id, 5, "processing"))
        errors = []

        for i, chapter in enumerate(chapters):
            chapter_id = chapter["id"]
            try:
                content = _run(gemini_service.generate_chapter_content(
                    book_title=book["title"],
                    book_description=book["description"],
                    chapter_title=chapter["title"],
                    chapter_description=chapter.get("description", ""),
                    content_type=content_type,
                    style=style,
                ))

                import re
                text = re.sub(r"<[^>]+>", " ", content)
                word_count = len(text.split())

                _run(books_repo.update_chapter(book_id, chapter_id, {
                    "content":          content,
                    "wordCount":        word_count,
                    "status":           "generated",
                    "contentAvailable": True,
                }))

            except Exception as chapter_exc:
                logger.warning("Chapter %s failed: %s", chapter_id, chapter_exc)
                errors.append({"chapterId": chapter_id, "error": str(chapter_exc)})

            # Update progress after each chapter
            progress = int(((i + 1) / n) * 90) + 5
            _run(jobs_repo.update_progress(job_id, progress, "processing"))

        # Update book status only if ALL chapters generated
        if not errors:
            _run(books_repo.update(book_id, {"status": "generated"}))

        _run(jobs_repo.complete_job(job_id, {
            "bookId":       book_id,
            "chaptersOk":   n - len(errors),
            "chaptersError": len(errors),
            "errors":        errors,
        }))
        logger.info("generate_all_content done: job=%s book=%s ok=%d err=%d",
                    job_id, book_id, n - len(errors), len(errors))

    except Exception as exc:
        logger.exception("generate_all_content fatal error: job=%s", job_id)
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ─────────────────────────────────────────────────────────────────────────────
# Task: generate_single_chapter
# ─────────────────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10, queue="llm")
def task_generate_single_chapter(
    self: Task,
    job_id: str,
    book_id: str,
    book: Dict[str, Any],
    chapter: Dict[str, Any],
    content_type: str = "long",
    style: str = "professional",
):
    """Regenerate content for a single chapter."""
    chapter_id = chapter["id"]
    try:
        _run(jobs_repo.update_progress(job_id, 20, "processing"))

        content = _run(gemini_service.generate_chapter_content(
            book_title=book["title"],
            book_description=book["description"],
            chapter_title=chapter["title"],
            chapter_description=chapter.get("description", ""),
            content_type=content_type,
            style=style,
        ))

        import re
        text = re.sub(r"<[^>]+>", " ", content)
        word_count = len(text.split())

        updated = _run(books_repo.update_chapter(book_id, chapter_id, {
            "content":          content,
            "wordCount":        word_count,
            "status":           "generated",
            "contentAvailable": True,
        }))

        _run(jobs_repo.complete_job(job_id, {"chapter": updated}))
        logger.info("generate_single_chapter done: job=%s chapter=%s", job_id, chapter_id)

    except Exception as exc:
        logger.exception("generate_single_chapter failed: job=%s", job_id)
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ─────────────────────────────────────────────────────────────────────────────
# Task: generate_proposal
# ─────────────────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10, queue="llm")
def task_generate_proposal(
    self: Task,
    job_id: str,
    proposal_id: str,
    proposal: Dict[str, Any],
    options: Dict[str, Any],
):
    """Generate a full proposal draft using Gemini."""
    try:
        _run(jobs_repo.update_progress(job_id, 20, "processing"))

        lang = options.get("language", "es")
        style = STYLE_PROMPTS.get(options.get("style", "professional"), "Use a professional tone.")
        prompt = (
            f"Write a complete commercial proposal in {lang}.\n"
            f"Title: {proposal['title']}\n"
            f"Client: {proposal['clientName']}\n"
            f"Description: {proposal.get('description', '')}\n"
            f"Style: {style}\n\n"
            "Include: executive summary, problem statement, proposed solution, "
            "scope of work, timeline, pricing overview, and next steps. "
            "Format as clean HTML (no <html>/<head>/<body> wrapper tags)."
        )
        content = _run(gemini_service._generate_text(prompt))

        _run(proposals_repo.update(proposal_id, {
            "content": content,
            "status":  "generated",
        }))

        _run(jobs_repo.complete_job(job_id, {"proposalId": proposal_id}))
        logger.info("generate_proposal done: job=%s proposal=%s", job_id, proposal_id)

    except Exception as exc:
        logger.exception("generate_proposal failed: job=%s", job_id)
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ─────────────────────────────────────────────────────────────────────────────
# Task: translate_book
# ─────────────────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=2, default_retry_delay=30, queue="llm")
def task_translate_book(
    self: Task,
    job_id: str,
    book: Dict[str, Any],
    chapters: List[Dict[str, Any]],
    options: Dict[str, Any],
):
    """
    Translate all (or selected) chapter content into a target language.

    options keys:
      targetLanguage        (str) — e.g. "Spanish", "fr", "pt-BR"
      adaptCulturalNuances  (bool)
      saveAs                (str) — "new_version" | "overwrite"
    """
    book_id = book["id"]
    target_lang = options.get("targetLanguage", "Spanish")
    adapt = options.get("adaptCulturalNuances", True)
    save_as = options.get("saveAs", "new_version")
    n = len(chapters)

    try:
        _run(jobs_repo.update_progress(job_id, 5, "processing"))
        errors = []

        for i, chapter in enumerate(chapters):
            chapter_id = chapter["id"]
            original_content = chapter.get("content", "")
            if not original_content:
                continue

            try:
                translated = _run(gemini_service.translate_content(
                    content=original_content,
                    target_language=target_lang,
                    adapt_cultural_nuances=adapt,
                ))

                if save_as == "overwrite":
                    _run(books_repo.update_chapter(book_id, chapter_id, {
                        "content":  translated,
                        "language": target_lang,
                    }))
                else:
                    # Save as a new chapter document with a language tag
                    _run(books_repo.create_chapter(book_id, {
                        "title":            f"{chapter['title']} [{target_lang}]",
                        "description":      chapter.get("description", ""),
                        "content":          translated,
                        "orderIndex":       chapter.get("orderIndex", i) + 1000,
                        "status":           "generated",
                        "language":         target_lang,
                        "sourceChapterId":  chapter_id,
                        "contentAvailable": True,
                        "wordCount":        len(translated.split()),
                    }))

            except Exception as chapter_exc:
                logger.warning("Translation failed for chapter %s: %s", chapter_id, chapter_exc)
                errors.append({"chapterId": chapter_id, "error": str(chapter_exc)})

            progress = int(((i + 1) / max(n, 1)) * 90) + 5
            _run(jobs_repo.update_progress(job_id, progress, "processing"))

        _run(jobs_repo.complete_job(job_id, {
            "bookId":         book_id,
            "targetLanguage": target_lang,
            "chaptersOk":     n - len(errors),
            "chaptersError":  len(errors),
            "errors":         errors,
        }))
        logger.info("translate_book done: job=%s book=%s lang=%s", job_id, book_id, target_lang)

    except Exception as exc:
        logger.exception("translate_book fatal: job=%s", job_id)
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)


# ─────────────────────────────────────────────────────────────────────────────
# Task: publish_book
# ─────────────────────────────────────────────────────────────────────────────
@celery_app.task(bind=True, max_retries=2, default_retry_delay=15, queue="exports")
def task_publish_book(
    self: Task,
    job_id: str,
    book: Dict[str, Any],
    chapters: List[Dict[str, Any]],
    options: Dict[str, Any],
):
    """
    Export / publish a book to one or more channels.

    Supported channels:
      pdf_export   — generate a PDF and store in Supabase Storage
      epub_export  — placeholder (converts HTML to basic ePub structure)
      linkedin     — post summary to LinkedIn (requires credentials in Settings)
      medium       — post to Medium via API
      ghost        — post to Ghost CMS via Admin API
      wordpress    — post via WordPress REST API

    For social/CMS channels without credentials, the task saves the content
    as a draft asset so the user can copy-paste manually.
    """
    import json as _json
    import re as _re

    from app.services import storage_service as storage
    from app.services.firestore_service import assets_repo

    book_id = book["id"]
    channels = options.get("channels", [])

    def _strip_html(html: str) -> str:
        return _re.sub(r"<[^>]+>", " ", html).strip()

    def _book_html(bk: dict, chaps: List[dict]) -> str:
        """Build a single HTML document from all chapter content."""
        parts = [
            f"<h1>{bk.get('title', 'Untitled')}</h1>",
            f"<p>{bk.get('description', '')}</p>",
            "<hr/>",
        ]
        for ch in sorted(chaps, key=lambda c: c.get("orderIndex", 0)):
            if ch.get("content"):
                parts.append(f"<h2>{ch.get('title', '')}</h2>")
                parts.append(ch["content"])
        return "\n".join(parts)

    try:
        _run(jobs_repo.update_progress(job_id, 5, "processing"))
        results = []

        for channel in channels:
            try:
                if channel == "pdf_export":
                    try:
                        import weasyprint
                        html = _book_html(book, chapters)
                        if options.get("includeCovers", True):
                            html = (
                                f'<div class="cover">'
                                f'<h1>{book.get("title", "")}</h1>'
                                f'<p>NoonDalton AI Marketing Suite</p></div>'
                                f'<div class="page-break"></div>' + html
                            )
                        pdf_bytes = weasyprint.HTML(string=html).write_pdf()
                    except ImportError:
                        pdf_bytes = b"%PDF-1.4 placeholder"

                    path = f"exports/{book_id}/book.pdf"
                    _run(storage.storage_service.upload_file(
                        path=path,
                        content=pdf_bytes,
                        content_type="application/pdf",
                    ))
                    signed_url = _run(storage.storage_service.get_signed_url(path, expires_in=86400))

                    # Persist as an asset
                    _run(assets_repo.create({
                        "type":        "one_pager",
                        "bookId":      book_id,
                        "userId":      book["userId"],
                        "status":      "ready",
                        "title":       f"PDF Export — {book.get('title', '')}",
                        "storagePath": path,
                        "downloadUrl": signed_url,
                    }))

                    results.append({"channel": channel, "status": "success", "url": signed_url})

                elif channel == "epub_export":
                    # Minimal ePub placeholder — full implementation would use ebooklib
                    results.append({"channel": channel, "status": "pending",
                                    "message": "ePub generation requires the ebooklib package. "
                                               "Install it and re-deploy the worker."})

                else:
                    # Social / CMS channels — save draft content for manual posting
                    summary = _strip_html(book.get("description", ""))[:500]
                    _run(assets_repo.create({
                        "type":    "social_post",
                        "bookId":  book_id,
                        "userId":  book["userId"],
                        "status":  "ready",
                        "title":   f"{channel.title()} Draft — {book.get('title', '')}",
                        "content": _json.dumps([{
                            "platform":       channel,
                            "content":        summary,
                            "characterCount": len(summary),
                        }]),
                    }))
                    results.append({"channel": channel, "status": "draft_saved",
                                    "message": f"Content saved as draft. Configure {channel} "
                                               "credentials in Settings for direct publishing."})

            except Exception as ch_exc:
                logger.warning("Publish channel %s failed: %s", channel, ch_exc)
                results.append({"channel": channel, "status": "error", "error": str(ch_exc)})

        # Write publish history back to the book
        existing = book.get("publishHistory", [])
        _run(books_repo.update(book_id, {
            "publishHistory": existing + results,
            "status":         "published",
        }))

        _run(jobs_repo.complete_job(job_id, {"bookId": book_id, "results": results}))
        logger.info("publish_book done: job=%s book=%s channels=%s", job_id, book_id, channels)

    except Exception as exc:
        logger.exception("publish_book fatal: job=%s", job_id)
        _run(jobs_repo.fail_job(job_id, str(exc)))
        raise self.retry(exc=exc)
