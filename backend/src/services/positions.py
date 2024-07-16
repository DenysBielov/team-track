from typing import List
from src.services.notifications import NotificationService
from src.services.subscriptions import SubscriptionService
from src.services.waitlist import WaitlistService
from src.repositories.positions import PositionsRepository
from src.repositories.users import UsersRepository
from src.models.position import PositionCreate, Position, PositionUpdate
from src.orm import models
from src.utils import parse_pydantic_schema
from src.models.subscription import NotificationSubscription


class PositionService:
    def __init__(
        self,
        positions_repository: PositionsRepository,
        user_repository: UsersRepository,
        notification_service: NotificationService,
        waitlist_service: WaitlistService,
        subscription_service: SubscriptionService,
    ) -> None:
        self._repository: PositionsRepository = positions_repository
        self.user_repository: UsersRepository = user_repository
        self.notification_service: NotificationService = notification_service
        self.waitlist_service: WaitlistService = waitlist_service
        self.subscription_service: SubscriptionService = subscription_service

    def get(self, position_id):
        position = self._repository.get(position_id)

        return position

    def get_all(self) -> List[Position]:
        positions = self._repository.get_all()

        return [
            {"name": p.position_type.name, "user": p.user, "id": p.id}
            for p in positions
        ]

    def get_all(self, team_id) -> List[Position]:
        positions = self._repository.get_all(team_id)

        return [
            {"name": p.position_type.name, "user": p.user, "id": p.id}
            for p in positions
        ]

    def get_all_by_user(self, user_id) -> List[Position]:
        positions = self._repository.get_all_by_user(user_id)

        return positions
    
    def get_all_by_event(self, event_id) -> List[Position]:
        positions = self._repository.get_all_by_event(event_id)

        return positions

    def create(self, position: PositionCreate) -> None:
        model = models.Position(**parse_pydantic_schema(position))
        self._repository.create(model)

    def delete(self, position_id: str) -> None:
        self._repository.delete(position_id)

    def update(self, position: models.Position) -> models.Position:
        model = self._repository.get(position.id)

        if model is None:
            self._repository.create(position)
        else:
            self._repository.update(position)

    def take_position(self, position_id, user_id):
        position = self._repository.get(position_id)

        if not self.user_repository.exists(user_id):
            return

        position.user_id = user_id

        self._repository.update(position)

    def release_position(self, position_id):
        position = self._repository.get(position_id)

        position.user_id = None

        self._repository.update(position)
        waitlist = self.waitlist_service.get_by_position_id(position_id)

        for waitlist_item in waitlist:
            if waitlist_item.user_id:
                subscriptions = self.subscription_service.get_by_user_id(
                    waitlist_item.user_id
                )

                for sub in subscriptions:
                    self.notification_service.send_notification(
                        "Position is available!",
                        f"{position.position_type.name} position you were waiting for is available.",
                        NotificationSubscription.model_validate_json(sub.subscription),
                    )
