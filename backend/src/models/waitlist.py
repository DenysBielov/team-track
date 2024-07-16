from typing import Optional
from uuid import UUID
from src.orm import models
from src.models.base import Base


class WaitlistItem(Base):
    id: Optional[UUID] = None
    position_id: str
    user_id: str

    class Meta:
        orm_model = models.WaitlistItem
