from typing import List
from src.repositories.events import EventsRepository
from src.models.event import EventCreate, Event, EventUpdate
from src.orm import models
from src.utils import parse_pydantic_schema


class EventService:
    def __init__(self, events_repository: EventsRepository) -> None:
        self._repository: EventsRepository = events_repository

    def get(self, event_id) -> Event:
        model = self._repository.get(event_id)

        if model is None:
            return None

        return Event.model_validate(model)
    
    def get_by_admin(self, user_id) -> List[Event]:
        events = self._repository.get_by_admin(user_id)

        if events is None:
            return None

        return events

    def get_all(self) -> List[Event]:
        events = self._repository.get_all()
        return [Event.model_validate(e) for e in events]

    def create(self, event: EventCreate) -> None:
        model = models.Event(**parse_pydantic_schema(event))
        self._repository.create(model)

    def delete(self, event_id: str) -> None:
        self._repository.delete(event_id)

    def update(self, event: EventUpdate) -> Event:
        model = self._repository.get(event.id)

        if model is None:
            model = models.Event(**parse_pydantic_schema(event))
            self._repository.create(model)
        else:
            self._repository.update(model)
