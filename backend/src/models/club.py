from datetime import datetime, time
from typing import List, Optional
from uuid import UUID
from src.models.location import Location
from pydantic import Field
from src.orm import models
from src.models.base import Base


class ClubCreate(Base):
    name: str
    admin_ids: List[str]


# TODO: messy inheritance, find out how to do it correctly
class ClubUpdate(ClubCreate):
    id: Optional[UUID] = None

    class Meta:
        orm_model = models.Club


class Club(ClubUpdate):
    
    class Meta:
        orm_model = models.Club


from src.models.team import Team

Club.model_rebuild()
