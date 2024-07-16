from typing import Optional
from src.orm import models
from pydantic import BaseModel

class Keys(BaseModel):
   p256dh: str
   auth: str

class NotificationSubscription(BaseModel):
    endpoint: str
    keys: Keys
    expirationTime: Optional[str]

    class Meta:
      orm_model = models.NotificationSubscription