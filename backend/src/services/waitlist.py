from typing import Iterator, List
from src.models.waitlist import WaitlistItem
from src.repositories.waitlist import WaitlistRepository
from src.orm import models
from src.utils import parse_pydantic_schema


class WaitlistService:
    def __init__(self, waitlist_repository: WaitlistRepository) -> None:
        self._repository = waitlist_repository

    def get_by_position_id(self, position_id) -> Iterator[WaitlistItem]:
        return self._repository.get_by_position_id(position_id)

    def get(self, waitlist_item_id) -> WaitlistItem:
        return WaitlistItem.model_validate(self._repository.get(waitlist_item_id))

    def get_all(self) -> List[WaitlistItem]:
        return [WaitlistItem.froms_orm(e) for e in self._repository.get_all()]

    def create(self, waitlist_item: WaitlistItem) -> None:
        model = models.WaitlistItem(**parse_pydantic_schema(waitlist_item))
        self._repository.create(model)

    def delete(self, waitlist_item_id: str) -> None:
        self._repository.delete(waitlist_item_id)

    def delete(self, user_id: str, position_id: str) -> None:
        waitlist_item = self._repository.get(position_id, user_id)
        if waitlist_item is None:
            return
        self._repository.delete(waitlist_item.id)

    def update(self, waitlist_item: WaitlistItem) -> WaitlistItem:
        model = self._repository.get(waitlist_item.id)

        if model is None:
            self.create(model)
        else:
            self._repository.update(model)
