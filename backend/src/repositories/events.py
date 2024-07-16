from typing import Iterator, List
from sqlalchemy.orm import joinedload
from src.orm import models
from src.models.event import Event


class EventsRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, event_id) -> Event:
        with self.session_factory() as session:
            event = (
                session.query(models.Event)
                .filter(models.Event.id == event_id)
                .options(joinedload(models.Event.location))
                .options(joinedload(models.Event.admins))
                .options(joinedload(models.Event.teams))
                .first()
            )

            if event is None:
                return None

            return Event.model_validate(event)
    
    def get_by_admin(self, user_id) -> List[Event]:
        with self.session_factory() as session:
            events = (
                session.query(models.Event)
                .join(models.Event.admins)
                .filter(models.User.id == user_id)
                .options(joinedload(models.Event.location))
                .options(joinedload(models.Event.admins))
                .options(joinedload(models.Event.teams))
                .all()
            )

            if events is None:
                return None

            return events


    def get_all(self) -> Iterator[Event]:
        with self.session_factory() as session:
            events = (
                session.query(models.Event)
                .options(joinedload(models.Event.location))
                .order_by(models.Event.date.desc())
                .all()
            )

            return [Event.model_validate(event) for event in events]

    def create(self, event: models.Event):
        with self.session_factory() as session:
            existing_admins = (
                session.query(models.User)
                .filter(models.User.id.in_([admin.id for admin in event.admins]))
                .all()
            )
            event.admins = existing_admins
            session.add(event)
            session.commit()

    def delete(self, event_id: str):
        with self.session_factory() as session:
            event = (
                session.query(models.Event).filter(models.Event.id == event_id).first()
            )

            if event is None:
                return

            session.delete(event)
            session.commit()

    def update(self, event: models.Event):
        with self.session_factory() as session:
            model = (
                session.query(models.Event).filter(models.Event.id == event.id).first()
            )

            for key in model.__dict__.keys():
                setattr(model, key, event[key])

            session.commit()
