"""Pydantic schemas for the Proposals module."""
from __future__ import annotations

from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field


class ProposalStatus(str, Enum):
    draft      = "draft"
    generated  = "generated"
    sent       = "sent"
    accepted   = "accepted"
    rejected   = "rejected"


class ProposalCreate(BaseModel):
    title:       str = Field(..., min_length=3, max_length=200)
    clientName:  str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    bookId:      Optional[str] = None   # optional reference to a book concept


class ProposalUpdate(BaseModel):
    title:       Optional[str] = Field(None, min_length=3, max_length=200)
    clientName:  Optional[str] = None
    description: Optional[str] = None
    status:      Optional[ProposalStatus] = None
    content:     Optional[str] = None   # HTML/markdown body


class GenerateProposalRequest(BaseModel):
    """Ask the LLM to draft the proposal body from title + description."""
    style:       str = "professional"
    language:    str = "es"
    customPrompt: Optional[str] = None


class ExportProposalRequest(BaseModel):
    format: str = Field("pdf", pattern="^(pdf|docx)$")


class ProposalOut(BaseModel):
    id:          str
    title:       str
    clientName:  str
    description: Optional[str]
    status:      str
    content:     Optional[str]
    userId:      str
    bookId:      Optional[str]
    downloadUrl: Optional[str]
    createdAt:   Optional[str]
    updatedAt:   Optional[str]

    class Config:
        from_attributes = True


class ProposalListResponse(BaseModel):
    items: List[ProposalOut]
    total: int
