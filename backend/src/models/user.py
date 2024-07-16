from typing import Optional
from uuid import UUID
from src.orm import models
from src.models.base import Base


class User(Base):
    id: Optional[UUID] = None
    name: str
    email: str
    image: Optional[str]

    class Meta:
        orm_model = models.User


class GoogleUserCreate(Base):
    name: str
    email: str
    image: str


class UserCreate(Base):
    name: str
    email: str
    password_hash: str


class UserLogin(Base):
    email: str
    password: str


class UserSchema(Base):
    email: str
    name: str
    image: str
    id: UUID

    class Config:
        from_attributes = True
