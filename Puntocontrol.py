###Esto es por si se borra algo que no se debe borrar
###Esto es por si se borra algo que no se debe borrar
###Esto es por si se borra algo que no se debe borrar
###Esto es por si se borra algo que no se debe borrar


"""
Book Concepts router — full CRUD + chapter management + LLM generation.

Endpoints:
  GET    /books                               list (paginated + filtered)
  POST   /books                               create
  GET    /books/{id}                          get with chapters
  PUT    /books/{id}                          update
  DELETE /books/{id}                          delete (cascade)
  POST   /books/{id}/chapters/generate        async LLM chapter generation
  POST   /books/{id}/chapters                 add chapter manually
  PUT    /books/{id}/chapters/{cid}           update chapter
  PUT    /books/{id}/chapters/reorder         bulk reorder
  DELETE /books/{id}/chapters/{cid}           delete chapter
  POST   /books/{id}/content/generate         async full content generation
  POST   /books/{id}/chapters/{cid}/content/generate  single chapter regen
  POST   /books/{id}/chapters/{cid}/content/refine    refine (no save)
  PUT    /books/{id}/chapters/{cid}/content   save editor content

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.book import (
    BookCreate, BookListResponse, BookUpdate,
    ChapterContentSave, ChapterCreate, ChapterReorder, ChapterUpdate,
    GenerateChaptersRequest, GenerateContentRequest, RefineContentRequest,
)
from app.schemas.job import JobAccepted
from app.services.firestore_service import books_repo, jobs_repo
from app.workers.tasks.content_tasks import (
    task_generate_chapters,
    task_generate_all_content,
    task_generate_single_chapter,
)

router = APIRouter(prefix="/books", tags=["Books"])


# ── Helpers ───────────────────────────────────────────────────────────────────
def _assert_owner(book: dict, user_id: str):
    if book.get("userId") != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")


async def _get_book_for_user(book_id: str, user_id: str) -> dict:
    try:
        book = await books_repo.get_or_404(book_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Book '{book_id}' not found.")
    _assert_owner(book, user_id)
    return book


async def _get_chapter_for_user(book_id: str, chapter_id: str, user_id: str) -> dict:
    await _get_book_for_user(book_id, user_id)  # verify ownership
    chapters = await books_repo.get_chapters(book_id)
    chapter = next((c for c in chapters if c["id"] == chapter_id), None)
    if not chapter:
        raise HTTPException(status_code=404, detail=f"Chapter '{chapter_id}' not found.")
    return chapter


# ─────────────────────────────────────────────────────────────────────────────
# Book CRUD
# ─────────────────────────────────────────────────────────────────────────────
@router.get("", response_model=BookListResponse)
async def list_books(
    page:   int            = Query(1,  ge=1),
    limit:  int            = Query(20, ge=1, le=100),
    status: Optional[str]  = Query(None),
    search: Optional[str]  = Query(None),
    sort:   str            = Query("updatedAt"),
    order:  str            = Query("desc"),
    user:   CurrentUser    = Depends(get_current_user),
):
    offset = (page - 1) * limit
    books = await books_repo.list_by_user(
        user_id=user.sub,
        status=status,
        search=search,
        limit=limit,
        offset=offset,
    )
    total = await books_repo.count(
        filters=[("userId", "==", user.sub)]
        + ([("status", "==", status)] if status else [])
    )
    return BookListResponse(data=books, total=total, page=page, limit=limit)


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_book(
    body: BookCreate,
    user: CurrentUser = Depends(get_current_user),
):
    book = await books_repo.create({
        "title":       body.title,
        "description": body.description,
        "keywords":    body.keywords,
        "status":      "draft",
        "userId":      user.sub,
    })
    return book


@router.get("/{book_id}", response_model=dict)
async def get_book(
    book_id: str,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user.sub)
    book["chapters"] = await books_repo.get_chapters(book_id)
    return book


@router.put("/{book_id}", response_model=dict)
async def update_book(
    book_id: str,
    body:    BookUpdate,
    user:    CurrentUser = Depends(get_current_user),
):
    await _get_book_for_user(book_id, user.sub)
    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=422, detail="No fields to update.")
    return await books_repo.update(book_id, update_data)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
    book_id: str,
    user:    CurrentUser = Depends(get_current_user),
):
    await _get_book_for_user(book_id, user.sub)
    # Delete all chapters first
    chapters = await books_repo.get_chapters(book_id)
    for ch in chapters:
        await books_repo.delete_chapter(book_id, ch["id"])
    await books_repo.delete(book_id)


# ─────────────────────────────────────────────────────────────────────────────
# Chapter generation (async)
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/{book_id}/chapters/generate", response_model=JobAccepted, status_code=202)
async def generate_chapters_endpoint(
    book_id: str,
    body:    GenerateChaptersRequest,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user.sub)
    job = await jobs_repo.create_job(
        job_type="generate_chapters",
        user_id=user.sub,
        metadata={"bookId": book_id, "chapterCount": body.chapter_count},
    )
    # Enqueue Celery task
    task_generate_chapters.delay(job["id"], book_id, book, body.chapter_count)
    return JobAccepted(job_id=job["id"])


# ─────────────────────────────────────────────────────────────────────────────
# Chapter CRUD
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/{book_id}/chapters", response_model=dict, status_code=201)
async def add_chapter(
    book_id: str,
    body:    ChapterCreate,
    user:    CurrentUser = Depends(get_current_user),
):
    await _get_book_for_user(book_id, user.sub)
    existing = await books_repo.get_chapters(book_id)
    order_index = len(existing)
    chapter = await books_repo.create_chapter(book_id, {
        "title":          body.title,
        "description":    body.description or "",
        "orderIndex":     order_index,
        "status":         "pending",
        "wordCount":      0,
        "contentAvailable": False,
    })
    return chapter


@router.put("/{book_id}/chapters/reorder", response_model=dict)
async def reorder_chapters(
    book_id: str,
    body:    ChapterReorder,
    user:    CurrentUser = Depends(get_current_user),
):
    await _get_book_for_user(book_id, user.sub)
    existing = await books_repo.get_chapters(book_id)
    existing_ids = {c["id"] for c in existing}
    incoming_ids = set(body.chapter_ids)

    if existing_ids != incoming_ids:
        raise HTTPException(
            status_code=400,
            detail={
                "code":    "INCOMPLETE_CHAPTER_LIST",
                "message": "chapterIds must include exactly all existing chapter IDs.",
            },
        )

    for index, chapter_id in enumerate(body.chapter_ids):
        await books_repo.update_chapter(book_id, chapter_id, {"orderIndex": index})

    chapters = await books_repo.get_chapters(book_id)
    return {"message": "Chapters reordered successfully", "chapters": chapters}


@router.put("/{book_id}/chapters/{chapter_id}", response_model=dict)
async def update_chapter(
    book_id:    str,
    chapter_id: str,
    body:       ChapterUpdate,
    user:       CurrentUser = Depends(get_current_user),
):
    await _get_chapter_for_user(book_id, chapter_id, user.sub)
    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=422, detail="No fields to update.")
    return await books_repo.update_chapter(book_id, chapter_id, update_data)


@router.delete("/{book_id}/chapters/{chapter_id}", status_code=204)
async def delete_chapter(
    book_id:    str,
    chapter_id: str,
    user:       CurrentUser = Depends(get_current_user),
):
    await _get_chapter_for_user(book_id, chapter_id, user.sub)
    await books_repo.delete_chapter(book_id, chapter_id)


# ─────────────────────────────────────────────────────────────────────────────
# Content generation
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/{book_id}/content/generate", response_model=JobAccepted, status_code=202)
async def generate_all_content(
    book_id: str,
    body:    GenerateContentRequest,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user.sub)
    chapters = await books_repo.get_chapters(book_id)
    if not chapters:
        raise HTTPException(status_code=409, detail={"code": "NO_CHAPTERS", "message": "No chapters found."})

    job = await jobs_repo.create_job(
        job_type="generate_all_content",
        user_id=user.sub,
        metadata={"bookId": book_id, "contentType": body.content_type, "style": body.style},
    )
    task_generate_all_content.delay(job["id"], book_id, book, chapters, body.content_type, body.style)
    return JobAccepted(job_id=job["id"])


@router.post("/{book_id}/chapters/{chapter_id}/content/generate", response_model=dict)
async def generate_single_chapter_content(
    book_id:    str,
    chapter_id: str,
    body:       GenerateContentRequest,
    user:       CurrentUser = Depends(get_current_user),
):
    book    = await _get_book_for_user(book_id, user.sub)
    chapter = await _get_chapter_for_user(book_id, chapter_id, user.sub)

    job = await jobs_repo.create_job(
        job_type="generate_single_chapter",
        user_id=user.sub,
        metadata={"bookId": book_id, "chapterId": chapter_id},
    )
    task_generate_single_chapter.delay(
        job["id"], book_id, book, chapter, body.content_type, body.style
    )
    return {"jobId": job["id"], "status": "pending"}


@router.post("/{book_id}/chapters/{chapter_id}/content/refine", response_model=dict)
async def refine_chapter_content(
    book_id:    str,
    chapter_id: str,
    body:       RefineContentRequest,
    user:       CurrentUser = Depends(get_current_user),
):
    from app.services.gemini_service import refine_content

    chapter = await _get_chapter_for_user(book_id, chapter_id, user.sub)
    existing = chapter.get("content")
    if not existing:
        raise HTTPException(status_code=400, detail={"code": "NO_CONTENT", "message": "Chapter has no content to refine."})

    refined = await refine_content(existing_content=existing, instruction=body.instruction)
    return {"refinedContent": refined}


@router.put("/{book_id}/chapters/{chapter_id}/content", response_model=dict)
async def save_chapter_content(
    book_id:    str,
    chapter_id: str,
    body:       ChapterContentSave,
    user:       CurrentUser = Depends(get_current_user),
):
    await _get_chapter_for_user(book_id, chapter_id, user.sub)

    # Simple word count (strip HTML tags)
    import re
    text = re.sub(r"<[^>]+>", " ", body.content)
    word_count = len(text.split())

    updated = await books_repo.update_chapter(book_id, chapter_id, {
        "content":          body.content,
        "format":           body.format,
        "wordCount":        word_count,
        "status":           "edited",
        "contentAvailable": True,
    })
    return updated


"""