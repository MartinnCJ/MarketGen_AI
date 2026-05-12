"""
Firestore service — async client wrapper with typed helpers.

Collections used by this project:
  - users/{userId}
  - books/{bookId}
  - books/{bookId}/chapters/{chapterId}
  - proposals/{proposalId}
  - customers/{customerId}
  - templates/{templateId}
  - assets/{assetId}
  - jobs/{jobId}
  - settings/{orgId}
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from google.cloud import firestore
from google.cloud.firestore_v1.async_client import AsyncClient
from google.cloud.firestore_v1 import AsyncDocumentReference

from app.config import settings

# ── Singleton client ──────────────────────────────────────────────────────────
_client: Optional[AsyncClient] = None


def get_db() -> AsyncClient:
    """Return the singleton Firestore async client."""
    global _client
    if _client is None:
        _client = firestore.AsyncClient(
            project=settings.google_cloud_project,
            database=settings.firestore_database,
        )
    return _client


# ── Timestamp helpers ─────────────────────────────────────────────────────────
def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def new_id() -> str:
    return str(uuid.uuid4())


# ── Generic CRUD helpers ──────────────────────────────────────────────────────
class FirestoreRepo:
    """
    Base repository providing generic create/read/update/delete helpers.
    Subclass and set `collection` to the Firestore collection name.
    """

    collection: str = ""

    def __init__(self):
        self.db = get_db()

    def _col(self):
        return self.db.collection(self.collection)

    def _doc(self, doc_id: str) -> AsyncDocumentReference:
        return self._col().document(doc_id)

    # ── Create ────────────────────────────────────────────────────────────────
    async def create(self, data: Dict[str, Any], doc_id: Optional[str] = None) -> Dict[str, Any]:
        """Create a document. Auto-generates ID if not provided."""
        doc_id = doc_id or new_id()
        now = now_utc()
        payload = {
            **data,
            "id": doc_id,
            "createdAt": now,
            "updatedAt": now,
        }
        await self._doc(doc_id).set(payload)
        return payload

    # ── Read one ──────────────────────────────────────────────────────────────
    async def get(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Return a document by ID, or None if not found."""
        snap = await self._doc(doc_id).get()
        return snap.to_dict() if snap.exists else None

    async def get_or_404(self, doc_id: str) -> Dict[str, Any]:
        """Return a document by ID or raise KeyError (caller converts to 404)."""
        doc = await self.get(doc_id)
        if doc is None:
            raise KeyError(f"{self.collection}/{doc_id} not found")
        return doc

    # ── Read many ─────────────────────────────────────────────────────────────
    async def list(
        self,
        filters: Optional[List[tuple]] = None,
        order_by: Optional[str] = None,
        order_direction: str = "DESCENDING",
        limit: int = 20,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """
        List documents with optional filters.
        filters: list of (field, op, value) tuples
        """
        query = self._col()
        if filters:
            for field, op, value in filters:
                query = query.where(filter=firestore.FieldFilter(field, op, value))
        if order_by:
            direction = (
                firestore.Query.DESCENDING
                if order_direction == "DESCENDING"
                else firestore.Query.ASCENDING
            )
            query = query.order_by(order_by, direction=direction)
        if limit:
            query = query.limit(limit)
        if offset:
            query = query.offset(offset)

        docs = await query.get()
        return [d.to_dict() for d in docs if d.exists]

    # ── Update ────────────────────────────────────────────────────────────────
    async def update(self, doc_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Partially update a document (merge). Returns updated doc."""
        payload = {**data, "updatedAt": now_utc()}
        await self._doc(doc_id).update(payload)
        return await self.get_or_404(doc_id)

    # ── Delete ────────────────────────────────────────────────────────────────
    async def delete(self, doc_id: str) -> None:
        """Hard delete a document."""
        await self._doc(doc_id).delete()

    # ── Count (approximate via list) ──────────────────────────────────────────
    async def count(self, filters: Optional[List[tuple]] = None) -> int:
        """Count documents matching filters (loads all IDs — use carefully)."""
        query = self._col()
        if filters:
            for field, op, value in filters:
                query = query.where(filter=firestore.FieldFilter(field, op, value))
        query = query.select([])  # only fetch document references
        docs = await query.get()
        return len(docs)


# ── Collection-specific repositories ─────────────────────────────────────────
class BooksRepo(FirestoreRepo):
    collection = "books"

    async def list_by_user(
        self,
        user_id: str,
        status: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        filters = [("userId", "==", user_id)]
        if status:
            filters.append(("status", "==", status))
        docs = await self.list(
            filters=filters, order_by="updatedAt",
            order_direction="DESCENDING", limit=limit, offset=offset,
        )
        # Client-side search (Firestore doesn't support full-text)
        if search:
            s = search.lower()
            docs = [d for d in docs if s in d.get("title", "").lower()]
        return docs

    async def get_chapters(self, book_id: str) -> List[Dict[str, Any]]:
        """Return chapters sub-collection ordered by orderIndex."""
        col = self.db.collection("books").document(book_id).collection("chapters")
        query = col.order_by("orderIndex", direction=firestore.Query.ASCENDING)
        docs = await query.get()
        return [d.to_dict() for d in docs if d.exists]

    async def create_chapter(self, book_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a chapter to the book's sub-collection."""
        chapter_id = new_id()
        now = now_utc()
        payload = {**data, "id": chapter_id, "bookId": book_id, "createdAt": now, "updatedAt": now}
        await (
            self.db.collection("books")
            .document(book_id)
            .collection("chapters")
            .document(chapter_id)
            .set(payload)
        )
        return payload

    async def update_chapter(self, book_id: str, chapter_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        ref = (
            self.db.collection("books")
            .document(book_id)
            .collection("chapters")
            .document(chapter_id)
        )
        payload = {**data, "updatedAt": now_utc()}
        await ref.update(payload)
        snap = await ref.get()
        return snap.to_dict()

    async def delete_chapter(self, book_id: str, chapter_id: str) -> None:
        await (
            self.db.collection("books")
            .document(book_id)
            .collection("chapters")
            .document(chapter_id)
            .delete()
        )


class JobsRepo(FirestoreRepo):
    collection = "jobs"

    async def create_job(self, job_type: str, user_id: str, metadata: Dict[str, Any] = {}) -> Dict[str, Any]:
        return await self.create({
            "type": job_type,
            "status": "pending",
            "progress": 0,
            "result": None,
            "error": None,
            "userId": user_id,
            "metadata": metadata,
        })

    async def update_progress(self, job_id: str, progress: int, status: str = "processing") -> None:
        await self.update(job_id, {"progress": progress, "status": status})

    async def complete_job(self, job_id: str, result: Any) -> None:
        await self.update(job_id, {"status": "completed", "progress": 100, "result": result})

    async def fail_job(self, job_id: str, error: str) -> None:
        await self.update(job_id, {"status": "failed", "error": error})


class ProposalsRepo(FirestoreRepo):
    collection = "proposals"


class CustomersRepo(FirestoreRepo):
    collection = "customers"


class TemplatesRepo(FirestoreRepo):
    collection = "templates"


class AssetsRepo(FirestoreRepo):
    collection = "assets"


class SettingsRepo(FirestoreRepo):
    collection = "settings"

    async def get_by_user(self, user_id: str) -> Dict[str, Any]:
        doc = await self.get(user_id)
        return doc or {"userId": user_id, "crm": {}, "llm": {}, "socialConnections": []}


# ── Module-level singletons ───────────────────────────────────────────────────
books_repo      = BooksRepo()
jobs_repo       = JobsRepo()
proposals_repo  = ProposalsRepo()
customers_repo  = CustomersRepo()
templates_repo  = TemplatesRepo()
assets_repo     = AssetsRepo()
settings_repo   = SettingsRepo()
