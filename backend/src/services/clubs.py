from typing import List
from src.repositories.clubs import ClubsRepository
from src.orm import models
from src.utils import parse_pydantic_schema


class ClubService:
  def __init__(self, clubs_repository: ClubsRepository) -> None:
    self._repository: ClubsRepository = clubs_repository

  def get(self, club_id) -> models.Club:
    return self._repository.get(club_id)
  
  def get_all(self) -> List[models.Club]:
    clubs = self._repository.get_all()
    return clubs
  
  def get_all_by_admin(self, admin_id) -> List[models.Club]:
    clubs = self._repository.get_all_by_admin(admin_id)
    return clubs
  
  def create(self, club) -> None:
    model = models.Club(**club)
    self._repository.create(model)

  def delete(self, club_id: str) -> None:
    self._repository.delete(club_id)

  def update(self, club) -> models.Club:
    model = self._repository.get(club.id)

    if model is None:
        model = models.Club(**parse_pydantic_schema(club))
        self._repository.create(model)
    else:
        self._repository.update(model)
