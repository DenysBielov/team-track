from typing import Optional
from uuid import UUID
from src.models.team import Team
from src.models.user import User
from src.orm import models
from src.models.base import Base
from pydantic import Field


class Position(Base):
    id: Optional[UUID] = None
    name: str
    team: Team
    user: Optional[User]

    class Meta:
        orm_model = models.Position


class PositionCreate(Base):
    name: str


class PositionUpdate(Base):
    user_id: str = Field(alias="userId")

