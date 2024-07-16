from fastapi import APIRouter, Depends
from src.services.teams import TeamService
from src.containers import Container
from src.models.event import EventCreate, EventUpdate
from dependency_injector.wiring import inject, Provide
from src.services.events import EventService


router = APIRouter(
    prefix="/events",
    dependencies=[
        Depends(Provide[Container.event_service]),
        Depends(Provide[Container.team_service]),
    ],
)


@router.get("")
@inject
async def events(
    event_service: EventService = Depends(Provide[Container.event_service]),
):
    return event_service.get_all()


@router.get("/{event_id}")
@inject
async def event(
    event_id, event_service: EventService = Depends(Provide[Container.event_service])
):
    return event_service.get(event_id)


@router.post("")
@inject
async def createEvent(
    event: EventCreate,
    event_service: EventService = Depends(Provide[Container.event_service]),
):
    event_service.create(event)


# TODO: find out for to do it correctly
@router.put("")
@inject
async def saveEvent(
    event: EventUpdate,
    event_service: EventService = Depends(Provide[Container.event_service]),
):
    event_service.update(event)


@router.delete("/{event_id}")
@inject
async def deleteEvent(
    event_id, event_service: EventService = Depends(Provide[Container.event_service])
):
    event_service.delete(event_id)


@router.get("/{event_id}/teams")
@inject
async def teams(
    event_id, team_service: TeamService = Depends(Provide[Container.team_service])
):
    return team_service.get_by_event_id(event_id)
