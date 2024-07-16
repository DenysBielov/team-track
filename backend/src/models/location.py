from typing import Optional
from uuid import UUID
from src.orm import models
from src.models.base import Base
from pydantic import Field

class Location(Base):
    id: Optional[UUID] = None
    name: str
    address: str
    lat_lng: Optional[str] = Field(None, alias="latLng")

    class Meta:
      orm_model = models.Location 