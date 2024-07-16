from typing import List
from src.repositories.locations import LocationsRepository
from src.models.location import Location
from src.orm import models
from src.utils import parse_pydantic_schema


class LocationService:
  def __init__(self, locations_repository: LocationsRepository) -> None:
    self._repository: LocationsRepository = locations_repository

  def get(self, location_id) -> Location:
    return Location.model_validate(self._repository.get(location_id))
  
  def get_all(self) -> List[Location]:
    return [Location.model_validate(e) for e in self._repository.get_all()]
  
  def create(self, location: Location) -> None:
    model = models.Location(**parse_pydantic_schema(location))
    self._repository.create(model)

  def delete(self, location_id: str) -> None:
    self._repository.delete(location_id)

  def update(self, location: Location) -> Location:
    model = self._repository.get(location.id)

    if model is None:
        model = models.Location(**parse_pydantic_schema(location))
        self._repository.create(model)
    else:
        self._repository.update(model)
