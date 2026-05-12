"""
Celery application factory.

Workers are started with:
  celery -A app.workers.celery_app worker --loglevel=info -Q default,llm,exports

Queues:
  default  — general tasks
  llm      — LLM generation tasks (may be scaled independently)
  exports  — document export tasks
"""
from celery import Celery
from app.config import settings

celery_app = Celery(
    "nd_marketing",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=[
        "app.workers.tasks.content_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,                   # ack only after task completes
    worker_prefetch_multiplier=1,           # one task at a time per worker
    task_routes={
        "app.workers.tasks.content_tasks.*": {"queue": "llm"},
    },
    beat_schedule={},                       # add periodic tasks here if needed
)
