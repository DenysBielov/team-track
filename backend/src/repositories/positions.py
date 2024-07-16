from typing import List
from sqlalchemy.orm import joinedload
from src.repositories.common import Repository
from src.orm import models


class PositionsRepository(Repository[models.Position]):
    def __init__(self, session_factory) -> None:
        super().__init__(session_factory, models.Position)

    def get(self, position_id) -> models.Position:
        with self.session_factory() as session:
            return (
                session.query(models.Position)
                .options(joinedload(models.Position.position_type))
                .options(joinedload(models.Position.user))
                .filter(models.Position.id == position_id)
                .first()
            )

    def get_all(self) -> List[models.Position]:
        with self.session_factory() as session:
            return (
                session.query(models.Position)
                .options(joinedload(models.Position.position_type))
                .options(joinedload(models.Position.user))
                .options(joinedload(models.Position.team))
                .order_by(models.Position.position_type.name.desc())
                .all()
            )

    def get_all(self, team_id) -> List[models.Position]:
        with self.session_factory() as session:
            return (
                session.query(models.Position)
                .filter(models.Position.team_id == team_id)
                .options(joinedload(models.Position.position_type))
                .options(joinedload(models.Position.user))
                .options(joinedload(models.Position.team))
                .all()
            )
        
    def get_all_by_user(self, user_id) -> List[models.Position]:
        with self.session_factory() as session:
            return (
                session.query(models.Position)
                .filter(models.Position.user_id == user_id)
                .options(joinedload(models.Position.position_type))
                .options(joinedload(models.Position.user))
                .options(joinedload(models.Position.team).joinedload(models.Team.event))
                .all()
            )

    def get_all_by_event(self, event_id) -> List[models.Position]:
        with self.session_factory() as session:
            return (
                session.query(models.Position)
                .join(models.Position.team)
                .filter(models.Team.event_id == event_id)
                .options(joinedload(models.Position.position_type))
                .options(joinedload(models.Position.user))
                .options(joinedload(models.Position.team).joinedload(models.Team.event))
                .all()
            )

    def get_by_user_id(self, user_id) -> List[models.Position]:
        with self.session_factory() as session:
            positions = (
                session.query(models.Position)
                .filter(models.Position.user_id == user_id)
                .options(
                    joinedload(models.Position.team).joinedload(models.Team.event)
                )
                .all()
            )

            return positions

    def create(self, position: models.Position):
        with self.session_factory() as session:
            session.add(position)
            session.commit()

    def delete(self, position_id: str):
        with self.session_factory() as session:
            position = (
                session.query(models.Position)
                .filter(models.Position.id == position_id)
                .first()
            )

            if position is None:
                return

            session.delete(position)
            session.commit()
