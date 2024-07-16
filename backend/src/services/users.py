from datetime import date, datetime
from typing import Iterator
from src.repositories.positions import PositionsRepository
from src.repositories.users import UsersRepository
from src.models.user import UserCreate, User
from src.orm import models


class UserService:
    def __init__(
        self,
        users_repository: UsersRepository,
        positions_repository: PositionsRepository,
    ) -> None:
        self._repository: UsersRepository = users_repository
        self.positions_repository = positions_repository

    def login(self, email, password):
        user = self._repository.get_by_email(email)

        if user is None:
            return None

        if user.password_hash == models.get_password_hash(password):
            return user

        return None

    def get(self) -> Iterator[User]:
        return self._repository.get_all()

    def get_by_id(self, user_id) -> User:
        return self._repository.get(user_id)

    def get_by_email(self, email) -> User:
        return self._repository.get_by_email(email)

    def create(self, user: UserCreate) -> User:
        model = models.User(**user.model_dump())
        return self._repository.create(model)

    def delete(self, user_id) -> None:
        return self._repository.delete(user_id)

    def exists(self, user_id) -> bool:
        return self._repository.exists(user_id)

    def exists_by_email(self, email: str) -> bool:
        return self._repository.exists_by_email(email)

    def update(self, user: models.User):
        self._repository.update(user)

    def get_suspension(self, user_id, event_id):
        user_positions = self.positions_repository.get_by_user_id(user_id)

        payments_skipped = 0
        for position in user_positions:
            if position.team.event.date.date() > date.today() and not position.paid:
                payments_skipped += 1

        # TODO: make model for this
        if payments_skipped > 2:
            return {"active": True, "reason": "More than two skipped payments"}

        return {"active": False, "reason": ""}
