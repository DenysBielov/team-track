from typing import Iterator
from sqlalchemy.orm import joinedload
from src.orm import models


class WaitlistRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, waitlist_item_id):
        with self.session_factory() as session:
            return (
                session.query(models.WaitlistItem)
                .filter(models.WaitlistItem.id == waitlist_item_id)
                .options(joinedload(models.WaitlistItem.user))
                .first()
            )

    def get(self, position_id, user_id) -> models.WaitlistItem:
        with self.session_factory() as session:
            return (
                session.query(models.WaitlistItem)
                .filter(models.WaitlistItem.position_id == position_id)
                .filter(models.WaitlistItem.user_id == user_id)
                .options(joinedload(models.WaitlistItem.user))
                .first()
            )

    def get_by_position_id(self, position_id) -> Iterator[models.WaitlistItem]:
        with self.session_factory() as session:
            return (
                session.query(models.WaitlistItem)
                .filter(models.WaitlistItem.position_id == position_id)
                .options(joinedload(models.WaitlistItem.user))
                .all()
            )

    def get_all(self):
        with self.session_factory() as session:
            return (
                session.query(models.WaitlistItem)
                .options(joinedload(models.WaitlistItem.user))
                .all()
            )

    def create(self, waitlist_item: models.WaitlistItem):
        with self.session_factory() as session:
            session.add(waitlist_item)
            session.commit()

    def delete(self, waitlist_item_id: str):
        with self.session_factory() as session:
            waitlist_item = (
                session.query(models.WaitlistItem)
                .filter(models.WaitlistItem.id == waitlist_item_id)
                .first()
            )

            if waitlist_item is None:
                return

            session.delete(waitlist_item)
            session.commit()

    def update(self, waitlist_item: models.WaitlistItem):
        with self.session_factory() as session:
            model = (
                session.query(models.WaitlistItem)
                .filter(models.WaitlistItem.id == waitlist_item.id)
                .first()
            )

            for key in model.__dict__.keys():
                setattr(model, key, waitlist_item[key])

            session.commit()
