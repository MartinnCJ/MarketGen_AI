"""Pydantic schemas for the Marketing Assets module."""
from __future__ import annotations

from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field


class AssetType(str, Enum):
    one_pager    = "one_pager"
    whitepaper   = "whitepaper"
    social_post  = "social_post"
    infographic  = "infographic"
    image        = "image"


class AssetStatus(str, Enum):
    pending    = "pending"
    generating = "generating"
    ready      = "ready"
    error      = "error"


class GenerateOnePagerRequest(BaseModel):
    bookId:      str
    style:       str = "professional"
    language:    str = "es"
    maxPages:    int = Field(2, ge=1, le=5)


class GenerateWhitepaperRequest(BaseModel):
    bookId:      str
    chapterIds:  Optional[List[str]] = None   # None = all chapters
    style:       str = "academic"
    language:    str = "es"


class GenerateSocialPostsRequest(BaseModel):
    bookId:      str
    chapterId:   Optional[str] = None
    platforms:   List[str] = ["linkedin", "twitter", "instagram"]
    tone:        str = "professional"
    language:    str = "es"


class GenerateInfographicRequest(BaseModel):
    bookId:      str
    chapterId:   Optional[str] = None
    style:       str = "modern"


class AssetOut(BaseModel):
    id:          str
    type:        str
    bookId:      Optional[str]
    userId:      str
    status:      str
    title:       Optional[str]
    content:     Optional[str]    # HTML / JSON / markdown depending on type
    downloadUrl: Optional[str]
    mimeType:    Optional[str]
    createdAt:   Optional[str]
    updatedAt:   Optional[str]

    class Config:
        from_attributes = True


class AssetListResponse(BaseModel):
    items: List[AssetOut]
    total: int
