from typing import Iterator, List
from sqlalchemy.orm import joinedload
from src.models.team import Team, TeamBase
from src.orm import models


class TeamsRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, team_id) -> Team:
        with self.session_factory() as session:
            team = (
                session.query(models.Team)
                .filter(models.Team.id == team_id)
                .options(joinedload(models.Team.event))
                .first()
            )

            if team is None:
                return None

            return Team.model_validate(team)

    def get_by_event_id(self, event_id) -> List[models.Team]:
        with self.session_factory() as session:
            teams = (
                session.query(models.Team)
                .options(
                    joinedload(models.Team.positions).joinedload(
                        models.Position.position_type
                    )
                )
                .options(
                    joinedload(models.Team.positions).joinedload(models.Position.user)
                )
                .filter(models.Team.event_id == event_id)
                .all()
            )

            return teams

    def get_all(self) -> Iterator[TeamBase]:
        with self.session_factory() as session:
            teams = session.query(models.Team).all()

            return teams

    def create(self, team: models.Team):
        with self.session_factory() as session:
            session.add(team)
            session.commit()

    def delete(self, team_id: str):
        with self.session_factory() as session:
            team = session.query(models.Team).filter(models.Team.id == team_id).first()

            if team is None:
                return

            session.delete(team)
            session.commit()

    def update(self, team: models.Team):
        with self.session_factory() as session:
            model = session.query(models.Team).filter(models.Team.id == team.id).first()

            for key in model.__dict__.keys():
                setattr(model, key, team[key])

            session.commit()
