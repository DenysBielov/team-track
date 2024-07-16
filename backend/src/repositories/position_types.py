from typing import Iterator
from sqlalchemy.orm import joinedload
from src.orm import models
from src.models.position_type import PositionType


class PositionTypesRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, position_type_id) -> PositionType:
        with self.session_factory() as session:
            position_type = (
                session.query(models.PositionType)
                .filter(models.PositionType.id == position_type_id)
                .first()
            )

            if position_type is None:
                return None

            return PositionType.model_validate(position_type)

    def get_all(self) -> Iterator[PositionType]:
        with self.session_factory() as session:
            position_types = session.query(models.PositionType).all()

            return [
                PositionType.model_validate(position_type)
                for position_type in position_types
            ]

    def create(self, position_type: models.PositionType):
        with self.session_factory() as session:
            session.add(position_type)
            session.commit()

    def delete(self, position_type_id: str):
        with self.session_factory() as session:
            position_type = (
                session.query(models.PositionType)
                .filter(models.PositionType.id == position_type_id)
                .first()
            )

            if position_type is None:
                return

            session.delete(position_type)
            session.commit()

    def update(self, position_type: models.PositionType):
        with self.session_factory() as session:
            model = (
                session.query(models.PositionType)
                .filter(models.PositionType.id == position_type.id)
                .first()
            )

            for key in model.__dict__.keys():
                setattr(model, key, position_type[key])

            session.commit()
