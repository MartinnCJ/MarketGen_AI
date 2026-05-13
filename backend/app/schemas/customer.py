"""Pydantic schemas for the Customers module."""
from __future__ import annotations

from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class CustomerCreate(BaseModel):
    name:    str = Field(..., min_length=1, max_length=200)
    email:   EmailStr
    company: Optional[str] = None
    phone:   Optional[str] = None
    notes:   Optional[str] = None


class CustomerUpdate(BaseModel):
    name:    Optional[str]  = Field(None, min_length=1, max_length=200)
    email:   Optional[EmailStr] = None
    company: Optional[str]  = None
    phone:   Optional[str]  = None
    notes:   Optional[str]  = None


class CustomerOut(BaseModel):
    id:        str
    name:      str
    email:     str
    company:   Optional[str]
    phone:     Optional[str]
    notes:     Optional[str]
    userId:    str
    createdAt: Optional[str]
    updatedAt: Optional[str]

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    items: List[CustomerOut]
    total: int
