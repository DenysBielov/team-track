from typing import Optional
from uuid import UUID
from src.models.base import Base


class PositionType(Base):
    id: Optional[UUID]
    name: str
