from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide
from src.models.payment import PaymentUpdate
from src.services.positions import PositionService
from src.services.events import EventService
from src.containers import Container

router = APIRouter(
    prefix="/payments",
    dependencies=[
        Depends(Provide[Container.event_service]),
        Depends(Provide[Container.team_service]),
    ],
)


@router.get("/{user_id}")
@inject
async def getPayments(
    user_id,
    position_service: PositionService = Depends(Provide[Container.position_service]),
    event_service: EventService = Depends(Provide[Container.event_service]),
):
    all_events = event_service.get_by_admin(user_id)
    result = []
    for event in all_events:
        event_positions = position_service.get_all_by_event(event.id)
        taken_positions = [p for p in event_positions if p.user is not None]
        if len(taken_positions) > 0:
            result.append(
                {
                    "date": event.date,
                    "location": event.location.name,
                    "eventId": event.id,
                    "positions": taken_positions,
                }
            )

    return result


@router.post("/{position_id}")
@inject
async def updatePayment(
    position_id,
    payment_update: PaymentUpdate,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    # TODO: check that current user is the admin of the event
    position = position_service.get(position_id)
    
    position.paid = payment_update.paid

    position_service.update(position)
