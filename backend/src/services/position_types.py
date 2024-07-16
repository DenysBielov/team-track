from typing import List
from src.repositories.position_types import PositionTypesRepository
from src.models.position_type import PositionType
from src.orm import models
from src.utils import parse_pydantic_schema


class PositionTypeService:
    def __init__(self, position_types_repository: PositionTypesRepository) -> None:
        self._repository: PositionTypesRepository = position_types_repository

    def get(self, position_type_id) -> PositionType:
        return PositionType.model_validate(self._repository.get(position_type_id))

    def get_all(self) -> List[PositionType]:
        position_types = self._repository.get_all()
        return [PositionType.model_validate(e) for e in position_types]

    def create(self, position_type: PositionType) -> None:
        model = models.PositionType(**parse_pydantic_schema(position_type))
        self._repository.create(model)

    def delete(self, position_type_id: str) -> None:
        self._repository.delete(position_type_id)

    def update(self, position_type: PositionType) -> PositionType:
        model = self._repository.get(position_type.id)

        if model is None:
            model = models.PositionType(**parse_pydantic_schema(position_type))
            self._repository.create(model)
        else:
            self._repository.update(model)
