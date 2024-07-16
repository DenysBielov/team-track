from datetime import datetime, time
from typing import List, Optional
from uuid import UUID
from src.models.user import User
from src.models.location import Location
from pydantic import Field
from src.orm import models
from src.models.base import Base


class EventCreate(Base):
    name: str
    date: datetime
    location: Location
    start_time: time = Field(None, alias="startTime")
    end_time: time = Field(None, alias="endTime")
    approve_guests: bool = Field(None, alias="approveGuests")
    admins: List[User]

    class Meta:
        orm_model = models.Event


# TODO: messy inheritance, find out how to do it correctly
class EventUpdate(EventCreate):
    id: Optional[UUID] = None

    class Meta:
        orm_model = models.Event


class Event(EventUpdate):
    
    class Meta:
        orm_model = models.Event


from src.models.team import Team

Event.model_rebuild()
