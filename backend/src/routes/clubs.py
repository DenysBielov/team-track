

from fastapi import APIRouter, Depends
from src.containers import Container
from src.services.clubs import ClubService
from dependency_injector.wiring import inject, Provide


router = APIRouter(
  prefix="/clubs",
)

@router.get("{admin_id}")
@inject
def getClubsByAdminId(admin_id, club_service: ClubService = Depends(Provide[Container.event_service])):
  return club_service.get_all_by_admin(admin_id)