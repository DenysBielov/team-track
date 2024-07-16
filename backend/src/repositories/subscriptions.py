from typing import List
from sqlalchemy.orm import joinedload
from src.orm import models


class SubscriptionsRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, subscription_id) -> models.NotificationSubscription:
        with self.session_factory() as session:
            return (
                session.query(models.NotificationSubscription)
                .filter(models.NotificationSubscription.id == subscription_id)
                .options(joinedload(models.NotificationSubscription.user))
                .first()
            )

    def get_by_user_id(self, user_id) -> List[models.NotificationSubscription]:
        with self.session_factory() as session:
            return (
                session.query(models.NotificationSubscription)
                .filter(models.NotificationSubscription.user_id == user_id)
                .options(joinedload(models.NotificationSubscription.user))
            )

    def get_all(self) -> List[models.NotificationSubscription]:
        with self.session_factory() as session:
            return (
                session.query(models.NotificationSubscription)
                .options(joinedload(models.NotificationSubscription.location))
                .order_by(models.NotificationSubscription.date.desc())
                .all()
            )

    def create(self, subscription: models.NotificationSubscription):
        with self.session_factory() as session:
            session.add(subscription)
            session.commit()

    def delete(self, subscription_id: str):
        with self.session_factory() as session:
            subscription = (
                session.query(models.NotificationSubscription)
                .filter(models.NotificationSubscription.id == subscription_id)
                .first()
            )

            if subscription is None:
                return

            session.delete(subscription)
            session.commit()

    def update(self, subscription: models.NotificationSubscription):
        with self.session_factory() as session:
            model = (
                session.query(models.NotificationSubscription)
                .filter(models.NotificationSubscription.id == subscription.id)
                .first()
            )

            for key in model.__dict__.keys():
                setattr(model, key, subscription[key])

            session.commit()
