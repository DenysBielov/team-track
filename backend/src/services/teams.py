from typing import List
from src.repositories.teams import TeamsRepository
from src.models.team import TeamCreate, Team
from src.orm import models
from src.utils import parse_pydantic_schema


class TeamService:
    def __init__(
        self,
        teams_repository: TeamsRepository,
    ) -> None:
        self._repository: TeamsRepository = teams_repository

    def get(self, team_id) -> Team:
        return Team.model_validate(self._repository.get(team_id))

    def get_by_event_id(self, event_id):
        teams = self._repository.get_by_event_id(event_id)
        teams_data = []
        for team in teams:
            team_data = {
                **team.__dict__,
                "positions": [
                    {
                        "name": put.position_type.name,
                        "id": put.id,
                        "user": put.user,
                        "paid": bool(put.paid),
                    }
                    for put in team.positions
                ],
            }
            teams_data.append(team_data)

        return teams_data

    def get_all(self) -> List[Team]:
        return [Team.model_validate(e) for e in self._repository.get_all()]

    def create(self, team: TeamCreate) -> None:
        model = models.Team(**parse_pydantic_schema(team))
        self._repository.create(model)

    def delete(self, team_id: str) -> None:
        self._repository.delete(team_id)
