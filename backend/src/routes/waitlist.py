from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide
from src.containers import Container
from src.services.waitlist import WaitlistService
from src.models.waitlist import WaitlistItem 

router = APIRouter(
    prefix="/waitlist",
    dependencies=[
        Depends(Provide[Container.event_service]),
        Depends(Provide[Container.team_service]),
    ],
)


@router.get("/{position_id}")
@inject
async def getUsers(
    position_id,
    waitlist_service: WaitlistService = Depends(Provide[Container.waitlist_service]),
):
    waitlist_items = waitlist_service.get_by_position_id(position_id)

    return [wi.user for wi in waitlist_items]


@router.post("/{position_id}/{user_id}")
@inject
async def createWaitlistItem(
    position_id,
    user_id,
    waitlist_service: WaitlistService = Depends(Provide[Container.waitlist_service]),
):
    waitlist_service.create(WaitlistItem(position_id=position_id, user_id= user_id))


@router.delete("/{position_id}/{user_id}")
@inject
async def deleteWaitListItem(
    position_id,
    user_id,
    waitlist_service: WaitlistService = Depends(Provide[Container.waitlist_service]),
):
    waitlist_service.delete(position_id, user_id)
