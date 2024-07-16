from typing import Annotated
from fastapi import APIRouter, Depends
from src.models.location import Location
from dependency_injector.wiring import inject, Provide
from src.containers import Container
from src.services.locations import LocationService

router = APIRouter(
    prefix="/locations", dependencies=[Depends(Provide[Container.location_service])]
)


@router.post("", status_code=201)
@inject
async def createLocation(
    location: Location,
    location_service: LocationService = Depends(Provide[Container.location_service]),
):
    location_service.create(location)


@router.get("")
@inject
async def getLocations(
    location_service: LocationService = Depends(Provide[Container.location_service]),
):
    return location_service.get_all()


@router.delete("/{location_id}")
@inject
async def deleteLocation(
    location_id,
    location_service: LocationService = Depends(Provide[Container.location_service]),
):
    location_service.delete(location_id)
