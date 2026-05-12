"""
Assets router — generate and manage marketing assets.

Endpoints:
  GET    /assets                           — list user's assets
  GET    /assets/{asset_id}               — get one asset
  DELETE /assets/{asset_id}               — delete asset
  GET    /assets/{asset_id}/download      — download file from storage
  POST   /books/{book_id}/assets/one-pager         — generate one-pager (async)
  POST   /books/{book_id}/assets/whitepaper        — generate whitepaper (async)
  POST   /books/{book_id}/assets/social-posts      — generate social posts (async)
  POST   /books/{book_id}/assets/infographic       — generate infographic data (async)
"""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse

from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.asset import (
    AssetOut, AssetListResponse,
    GenerateOnePagerRequest, GenerateWhitepaperRequest,
    GenerateSocialPostsRequest, GenerateInfographicRequest,
)
from app.schemas.job import JobAccepted
from app.services.firestore_service import assets_repo, jobs_repo, books_repo
from app.services.storage_service import storage_service
from app.workers.tasks.asset_tasks import (
    task_generate_one_pager,
    task_generate_whitepaper,
    task_generate_social_posts,
    task_generate_infographic,
)

router = APIRouter(tags=["Assets"])


def _assert_owner(asset: dict, user: CurrentUser) -> None:
    if asset.get("userId") != user.sub:
        raise HTTPException(status_code=403, detail="Access denied.")


async def _get_book_for_user(book_id: str, user: CurrentUser) -> dict:
    book = await books_repo.get(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    if book.get("userId") != user.sub:
        raise HTTPException(status_code=403, detail="Access denied.")
    return book


# ── List all assets ───────────────────────────────────────────────────────────
@router.get("/assets", response_model=AssetListResponse)
async def list_assets(
    asset_type: Optional[str] = Query(None),
    book_id:    Optional[str] = Query(None),
    limit:      int           = Query(20, ge=1, le=100),
    offset:     int           = Query(0, ge=0),
    user:       CurrentUser   = Depends(get_current_user),
):
    filters = [("userId", "==", user.sub)]
    if asset_type:
        filters.append(("type", "==", asset_type))
    if book_id:
        filters.append(("bookId", "==", book_id))
    assets = await assets_repo.list(
        filters=filters, order_by="createdAt",
        order_direction="DESCENDING", limit=limit, offset=offset,
    )
    total = await assets_repo.count(filters=[("userId", "==", user.sub)])
    return AssetListResponse(items=assets, total=total)


# ── Get one ───────────────────────────────────────────────────────────────────
@router.get("/assets/{asset_id}", response_model=AssetOut)
async def get_asset(
    asset_id: str,
    user:     CurrentUser = Depends(get_current_user),
):
    asset = await assets_repo.get(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    _assert_owner(asset, user)
    return asset


# ── Delete ────────────────────────────────────────────────────────────────────
@router.delete("/assets/{asset_id}", status_code=204)
async def delete_asset(
    asset_id: str,
    user:     CurrentUser = Depends(get_current_user),
):
    asset = await assets_repo.get(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    _assert_owner(asset, user)
    if asset.get("storagePath"):
        await storage_service.delete_file(asset["storagePath"])
    await assets_repo.delete(asset_id)


# ── Download ──────────────────────────────────────────────────────────────────
@router.get("/assets/{asset_id}/download")
async def download_asset(
    asset_id:   str,
    user:       CurrentUser = Depends(get_current_user),
):
    asset = await assets_repo.get(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    _assert_owner(asset, user)
    if not asset.get("storagePath"):
        raise HTTPException(status_code=404, detail="File not available yet.")
    url = await storage_service.get_signed_url(asset["storagePath"], expires_in=300)
    return RedirectResponse(url=url)


# ── Generate one-pager ────────────────────────────────────────────────────────
@router.post("/books/{book_id}/assets/one-pager", response_model=JobAccepted, status_code=202)
async def generate_one_pager(
    book_id: str,
    body:    GenerateOnePagerRequest,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user)
    asset = await assets_repo.create({
        "type": "one_pager", "bookId": book_id, "userId": user.sub,
        "status": "pending", "title": f"One-Pager — {book['title']}",
    })
    job = await jobs_repo.create_job("one_pager_generation", user.sub, {"assetId": asset["id"]})
    task_generate_one_pager.delay(job["id"], asset["id"], book, body.model_dump())
    return JobAccepted(job_id=job["id"])


# ── Generate whitepaper ───────────────────────────────────────────────────────
@router.post("/books/{book_id}/assets/whitepaper", response_model=JobAccepted, status_code=202)
async def generate_whitepaper(
    book_id: str,
    body:    GenerateWhitepaperRequest,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user)
    chapters = await books_repo.get_chapters(book_id)
    if body.chapterIds:
        chapters = [c for c in chapters if c["id"] in body.chapterIds]
    asset = await assets_repo.create({
        "type": "whitepaper", "bookId": book_id, "userId": user.sub,
        "status": "pending", "title": f"Whitepaper — {book['title']}",
    })
    job = await jobs_repo.create_job("whitepaper_generation", user.sub, {"assetId": asset["id"]})
    task_generate_whitepaper.delay(job["id"], asset["id"], book, chapters, body.model_dump())
    return JobAccepted(job_id=job["id"])


# ── Generate social posts ─────────────────────────────────────────────────────
@router.post("/books/{book_id}/assets/social-posts", response_model=JobAccepted, status_code=202)
async def generate_social_posts(
    book_id: str,
    body:    GenerateSocialPostsRequest,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user)
    chapter = None
    if body.chapterId:
        chapters = await books_repo.get_chapters(book_id)
        chapter = next((c for c in chapters if c["id"] == body.chapterId), None)
    asset = await assets_repo.create({
        "type": "social_post", "bookId": book_id, "userId": user.sub,
        "status": "pending", "title": f"Social Posts — {book['title']}",
    })
    job = await jobs_repo.create_job("social_posts_generation", user.sub, {"assetId": asset["id"]})
    task_generate_social_posts.delay(job["id"], asset["id"], book, chapter, body.model_dump())
    return JobAccepted(job_id=job["id"])


# ── Generate infographic ──────────────────────────────────────────────────────
@router.post("/books/{book_id}/assets/infographic", response_model=JobAccepted, status_code=202)
async def generate_infographic(
    book_id: str,
    body:    GenerateInfographicRequest,
    user:    CurrentUser = Depends(get_current_user),
):
    book = await _get_book_for_user(book_id, user)
    asset = await assets_repo.create({
        "type": "infographic", "bookId": book_id, "userId": user.sub,
        "status": "pending", "title": f"Infografía — {book['title']}",
    })
    job = await jobs_repo.create_job("infographic_generation", user.sub, {"assetId": asset["id"]})
    task_generate_infographic.delay(job["id"], asset["id"], book, body.model_dump())
    return JobAccepted(job_id=job["id"])
