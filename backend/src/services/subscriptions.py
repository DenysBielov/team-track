from typing import Iterator, List
from src.repositories.subscriptions import SubscriptionsRepository
from src.models.subscription import NotificationSubscription
from src.orm import models
from src.utils import parse_pydantic_schema


class SubscriptionService:
    def __init__(self, subscriptions_repository: SubscriptionsRepository) -> None:
        self._repository: SubscriptionsRepository = subscriptions_repository

    def get(self, subscription_id) -> NotificationSubscription:
        return NotificationSubscription.model_validate(
            self._repository.get(subscription_id)
        )

    def get_by_user_id(self, user_id) -> Iterator[NotificationSubscription]:
        return NotificationSubscription.model_validate(
            self._repository.get_by_user_id(user_id)
        )

    def get_all(self) -> List[NotificationSubscription]:
        return [
            NotificationSubscription.model_validate(e)
            for e in self._repository.get_all()
        ]

    def create(self, subscription: NotificationSubscription, user_id: str) -> None:
        model = models.NotificationSubscription(
            subscription=subscription.model_dump_json(), user_id=user_id
        )
        self._repository.create(model)

    def delete(self, subscription_id: str) -> None:
        self._repository.delete(subscription_id)
