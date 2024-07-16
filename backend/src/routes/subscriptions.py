from typing import Annotated
from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide
from src.containers import Container
from src.services.subscriptions import SubscriptionService
from src.models.subscription import NotificationSubscription

router = APIRouter(
    prefix="/subscriptions",
    dependencies=[
        Depends(Provide[Container.event_service]),
        Depends(Provide[Container.team_service]),
    ],
)


@inject
@router.post("/{user_id}")
async def subscriptions(
    user_id: str,
    subscription: NotificationSubscription,
    subscription_service: SubscriptionService = Depends(
        Provide[Container.subscription_service]
    ),
):
    subscription_service.create(subscription, user_id)
