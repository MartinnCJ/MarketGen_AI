"""Tests for the /api/v1/assets router."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from tests.conftest import FAKE_USER_SUB, fake_book, fake_job

API = "/api/v1"


def fake_asset(overrides: dict | None = None) -> dict:
    base = {
        "id":          "asset-001",
        "userId":      FAKE_USER_SUB,
        "bookId":      "book-001",
        "type":        "one_pager",
        "title":       "One-Pager — Test Book",
        "status":      "ready",
        "storagePath": "exports/book-001/one-pager.pdf",
        "downloadUrl": "https://storage.example.com/one-pager.pdf",
        "createdAt":   "2024-01-01T00:00:00Z",
        "updatedAt":   "2024-01-01T00:00:00Z",
    }
    if overrides:
        base.update(overrides)
    return base


@pytest.mark.asyncio
async def test_list_assets_empty(client):
    with (
        patch("app.routers.assets.assets_repo.list",  new_callable=AsyncMock, return_value=[]),
        patch("app.routers.assets.assets_repo.count", new_callable=AsyncMock, return_value=0),
    ):
        resp = await client.get(f"{API}/assets")
    assert resp.status_code == 200
    assert resp.json()["total"] == 0


@pytest.mark.asyncio
async def test_list_assets_with_type_filter(client):
    asset = fake_asset()
    with (
        patch("app.routers.assets.assets_repo.list",  new_callable=AsyncMock, return_value=[asset]),
        patch("app.routers.assets.assets_repo.count", new_callable=AsyncMock, return_value=1),
    ):
        resp = await client.get(f"{API}/assets?asset_type=one_pager")
    assert resp.status_code == 200
    assert resp.json()["items"][0]["type"] == "one_pager"


@pytest.mark.asyncio
async def test_get_asset_not_found(client):
    with patch("app.routers.assets.assets_repo.get", new_callable=AsyncMock, return_value=None):
        resp = await client.get(f"{API}/assets/nonexistent")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_asset_forbidden(client):
    other = fake_asset({"userId": "other-user"})
    with patch("app.routers.assets.assets_repo.get", new_callable=AsyncMock, return_value=other):
        resp = await client.get(f"{API}/assets/asset-001")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_delete_asset_success(client):
    asset = fake_asset()
    with (
        patch("app.routers.assets.assets_repo.get",               new_callable=AsyncMock, return_value=asset),
        patch("app.routers.assets.storage_service.delete_file",   new_callable=AsyncMock, return_value=None),
        patch("app.routers.assets.assets_repo.delete",            new_callable=AsyncMock, return_value=None),
    ):
        resp = await client.delete(f"{API}/assets/asset-001")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_generate_one_pager_enqueues_job(client):
    book = fake_book({"status": "generated"})
    job  = fake_job("one_pager_generation")
    new_asset = fake_asset({"status": "pending"})
    with (
        patch("app.routers.assets.books_repo.get",         new_callable=AsyncMock, return_value=book),
        patch("app.routers.assets.assets_repo.create",     new_callable=AsyncMock, return_value=new_asset),
        patch("app.routers.assets.jobs_repo.create_job",   new_callable=AsyncMock, return_value=job),
        patch("app.routers.assets.task_generate_one_pager.delay", return_value=None),
    ):
        resp = await client.post(f"{API}/books/book-001/assets/one-pager", json={})
    assert resp.status_code == 202
    assert resp.json()["job_id"] == "job-001"


@pytest.mark.asyncio
async def test_generate_social_posts_enqueues_job(client):
    book = fake_book({"status": "generated"})
    job  = fake_job("social_posts_generation")
    new_asset = fake_asset({"type": "social_post", "status": "pending"})
    with (
        patch("app.routers.assets.books_repo.get",         new_callable=AsyncMock, return_value=book),
        patch("app.routers.assets.assets_repo.create",     new_callable=AsyncMock, return_value=new_asset),
        patch("app.routers.assets.jobs_repo.create_job",   new_callable=AsyncMock, return_value=job),
        patch("app.routers.assets.task_generate_social_posts.delay", return_value=None),
    ):
        resp = await client.post(f"{API}/books/book-001/assets/social-posts", json={
            "platforms": ["linkedin", "twitter"]
        })
    assert resp.status_code == 202
    assert "job_id" in resp.json()
