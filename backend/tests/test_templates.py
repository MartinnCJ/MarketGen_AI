"""Tests for the /api/v1/templates router."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from tests.conftest import FAKE_USER_SUB

API = "/api/v1/templates"


def fake_template(overrides: dict | None = None) -> dict:
    base = {
        "id":          "tmpl-001",
        "userId":      FAKE_USER_SUB,
        "name":        "Proposal Template",
        "type":        "proposal",
        "description": "Standard B2B proposal template.",
        "content":     "Hello {client_name}, please find our proposal for {product}.",
        "variables":   ["client_name", "product"],
        "isPublic":    False,
        "usageCount":  0,
        "createdAt":   "2024-01-01T00:00:00Z",
        "updatedAt":   "2024-01-01T00:00:00Z",
    }
    if overrides:
        base.update(overrides)
    return base


@pytest.mark.asyncio
async def test_list_templates(client):
    templates = [fake_template()]
    with (
        patch("app.routers.templates.templates_repo.list",  new_callable=AsyncMock, return_value=templates),
        patch("app.routers.templates.templates_repo.count", new_callable=AsyncMock, return_value=1),
    ):
        resp = await client.get(API)
    assert resp.status_code == 200
    assert resp.json()["total"] == 1


@pytest.mark.asyncio
async def test_create_template(client):
    tmpl = fake_template()
    with patch("app.routers.templates.templates_repo.create", new_callable=AsyncMock, return_value=tmpl):
        resp = await client.post(API, json={
            "name":    "Proposal Template",
            "type":    "proposal",
            "content": "Hello {client_name}.",
        })
    assert resp.status_code == 201
    assert resp.json()["id"] == "tmpl-001"


@pytest.mark.asyncio
async def test_get_template_not_found(client):
    with patch("app.routers.templates.templates_repo.get", new_callable=AsyncMock, return_value=None):
        resp = await client.get(f"{API}/nonexistent")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_apply_template_substitutes_variables(client):
    """POST /{id}/apply should return content with variables replaced."""
    tmpl = fake_template()
    with (
        patch("app.routers.templates.templates_repo.get",    new_callable=AsyncMock, return_value=tmpl),
        patch("app.routers.templates.templates_repo.update", new_callable=AsyncMock, return_value=tmpl),
    ):
        resp = await client.post(f"{API}/tmpl-001/apply", json={
            "variables": {"client_name": "NoonDalton", "product": "AI Suite"},
        })
    assert resp.status_code == 200
    rendered = resp.json()["renderedContent"]
    assert "NoonDalton" in rendered
    assert "AI Suite" in rendered
    assert "{client_name}" not in rendered


@pytest.mark.asyncio
async def test_delete_template(client):
    tmpl = fake_template()
    with (
        patch("app.routers.templates.templates_repo.get",    new_callable=AsyncMock, return_value=tmpl),
        patch("app.routers.templates.templates_repo.delete", new_callable=AsyncMock, return_value=None),
    ):
        resp = await client.delete(f"{API}/tmpl-001")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_template_forbidden(client):
    other = fake_template({"userId": "other-user"})
    with patch("app.routers.templates.templates_repo.get", new_callable=AsyncMock, return_value=other):
        resp = await client.delete(f"{API}/tmpl-001")
    assert resp.status_code == 403
