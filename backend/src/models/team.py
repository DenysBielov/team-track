from typing import List, Optional
from uuid import UUID
from pydantic import Field
from src.orm import models
from src.models.base import Base


class TeamBase(Base):
    id: Optional[UUID] = None
    name: str

    class Meta:
        orm_model = models.Team


class Team(TeamBase):
    positions: "Optional[List[Position]]" = Field(None)
    event: "Event"

    class Meta:
        orm_model = models.Team


from src.models.event import Event
from src.models.position import Position

Team.model_rebuild()


class TeamCreate(Base):
    name: str
    event_id: str = Field(None, alias="eventId")


class TeamAddPosition(Base):
    position_type_id: str = Field(None, alias="positionTypeId")
