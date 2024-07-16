from typing import Optional
from src.models.base import Base


class Approval(Base):
    approved: Optional[bool]