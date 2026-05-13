"""Tests for the /api/v1/proposals router."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from tests.conftest import FAKE_USER_SUB, fake_job

API = "/api/v1/proposals"


def fake_proposal(overrides: dict | None = None) -> dict:
    base = {
        "id":          "proposal-001",
        "userId":      FAKE_USER_SUB,
        "title":       "Test Proposal",
        "clientName":  "Acme Corp",
        "status":      "draft",
        "content":     "",
        "description": "A proposal for AI services.",
        "createdAt":   "2024-01-01T00:00:00Z",
        "updatedAt":   "2024-01-01T00:00:00Z",
    }
    if overrides:
        base.update(overrides)
    return base


@pytest.mark.asyncio
async def test_list_proposals_empty(client):
    with (
        patch("app.routers.proposals.proposals_repo.list",  new_callable=AsyncMock, return_value=[]),
        patch("app.routers.proposals.proposals_repo.count", new_callable=AsyncMock, return_value=0),
    ):
        resp = await client.get(API)
    assert resp.status_code == 200
    assert resp.json()["total"] == 0


@pytest.mark.asyncio
async def test_create_proposal(client):
    proposal = fake_proposal()
    with patch("app.routers.proposals.proposals_repo.create", new_callable=AsyncMock, return_value=proposal):
        resp = await client.post(API, json={
            "title":       "Test Proposal",
            "clientName":  "Acme Corp",
            "description": "A proposal for AI services.",
        })
    assert resp.status_code == 201
    assert resp.json()["id"] == "proposal-001"


@pytest.mark.asyncio
async def test_get_proposal_not_found(client):
    with patch("app.routers.proposals.proposals_repo.get", new_callable=AsyncMock, return_value=None):
        resp = await client.get(f"{API}/nonexistent")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_generate_proposal_enqueues_job(client):
    proposal = fake_proposal()
    job = fake_job("proposal_generation")
    with (
        patch("app.routers.proposals.proposals_repo.get",        new_callable=AsyncMock, return_value=proposal),
        patch("app.routers.proposals.jobs_repo.create_job",      new_callable=AsyncMock, return_value=job),
        patch("app.routers.proposals.task_generate_proposal.delay", return_value=None),
    ):
        resp = await client.post(f"{API}/proposal-001/generate", json={
            "style": "professional", "language": "es"
        })
    assert resp.status_code == 202
    assert "job_id" in resp.json()


@pytest.mark.asyncio
async def test_delete_proposal_success(client):
    proposal = fake_proposal()
    with (
        patch("app.routers.proposals.proposals_repo.get",    new_callable=AsyncMock, return_value=proposal),
        patch("app.routers.proposals.proposals_repo.delete", new_callable=AsyncMock, return_value=None),
    ):
        resp = await client.delete(f"{API}/proposal-001")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_proposal_forbidden(client):
    other = fake_proposal({"userId": "other-user"})
    with patch("app.routers.proposals.proposals_repo.get", new_callable=AsyncMock, return_value=other):
        resp = await client.delete(f"{API}/proposal-001")
    assert resp.status_code == 403
