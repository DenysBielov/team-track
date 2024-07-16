from fastapi import APIRouter, Depends
from src.services.users import UserService
from src.containers import Container
from src.services.positions import PositionService
from src.models.position import PositionCreate
from dependency_injector.wiring import inject, Provide

router = APIRouter(
    prefix="/positions", dependencies=[Depends(Provide[Container.position_service])]
)


@router.get("/{position_id}")
@inject
async def getPosition(
    position_id,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    position = position_service.get(position_id)
    return {
        "name": position.position_type.name,
        "user": position.user,
        "id": position.id,
        "paid": position.paid,
    }


# TODO: Refactor Position and Position endpoints
@router.post("", status_code=201)
@inject
async def createPosition(
    position: PositionCreate,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    position_service.create(position)


@router.post("/{position_id}/user/{user_id}")
@inject
async def takePosition(
    position_id,
    user_id,
    position_service: PositionService = Depends(Provide[Container.position_service]),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    position_service.take_position(position_id, user_id)
    position = position_service.get(position_id)
    return {
        "name": position.position_type.name,
        "user": position.user,
        "id": position.id,
    }


@router.delete("/{position_id}/user")
@inject
async def releasePosition(
    position_id,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    position_service.release_position(position_id)
