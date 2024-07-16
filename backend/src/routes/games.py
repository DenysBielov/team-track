from fastapi import APIRouter, Depends
from src.containers import Container
from dependency_injector.wiring import inject, Provide
from src.services.events import EventService


router = APIRouter(
    prefix="/games",
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
