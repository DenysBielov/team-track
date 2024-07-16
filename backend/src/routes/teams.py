from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from src.containers import Container
from src.models.team import TeamAddPosition, TeamCreate
from src.orm import models
from dependency_injector.wiring import inject, Provide
from src.services.teams import TeamService
from src.services.positions import PositionService

router = APIRouter(
    prefix="/teams",
    dependencies=[
        Depends(Provide[Container.team_service]),
    ],
)

@router.post("")
@inject
async def createTeam(
    team: TeamCreate,
    team_service: TeamService = Depends(Provide[Container.team_service]),
):
    team_service.create(team)


@router.delete("/{team_id}")
@inject
async def deleteTeam(
    team_id: str, team_service: TeamService = Depends(Provide[Container.team_service])
):
    team_service.delete(team_id)


@router.post("/{team_id}/positions")
@inject
async def addTeamPosition(
    team_id: str,
    position: TeamAddPosition,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    position_service.create(
        {"position_type_id": position.position_type_id, "team_id": team_id}
    )


@router.get("/{team_id}/positions")
@inject
async def getTeamPosition(
    team_id: str,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    return position_service.get_all(team_id)


@router.delete("/{team_id}/positions/{position_id}")
@inject
async def deleteTeamPosition(
    position_id: str,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    position_service.delete(position_id)
