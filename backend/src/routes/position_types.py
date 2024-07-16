from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide
from src.models.position_type import PositionType
from src.services.position_types import PositionTypeService
from src.containers import Container

router = APIRouter(
    prefix="/position-types",
    dependencies=[Depends(Provide[Container.position_types_service])],
)


@router.get("")
@inject
async def getPositionTypes(
    position_types_service: PositionTypeService = Depends(
        Provide[Container.position_types_service]
    ),
):
    return position_types_service.get_all()


@router.post("")
@inject
async def getPositionTypes(
    position_type: PositionType,
    position_types_service: PositionTypeService = Depends(
        Provide[Container.position_types_service]
    ),
):
    return position_types_service.create(position_type)
