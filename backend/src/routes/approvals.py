from fastapi import APIRouter, Depends
from src.models.approval import Approval
from src.services.approvals import ApprovalService
from src.containers import Container
from dependency_injector.wiring import inject, Provide


router = APIRouter(
    prefix="/approvals",
    dependencies=[
        Depends(Provide[Container.approvals_service]),
    ],
)


@router.get("/{event_id}/{user_id}")
@inject
async def getApprovals(
    event_id,
    user_id,
    approval_service: ApprovalService = Depends(Provide[Container.approvals_service]),
):
    return approval_service.get(user_id, event_id)

@router.patch("/{event_id}/{user_id}")
@inject
async def updateApproval(
    event_id,
    user_id,
    approval: Approval,
    approval_service: ApprovalService = Depends(Provide[Container.approvals_service]),
):
    approval_service.update(event_id, user_id, approval.approved)

@router.post("/{event_id}/{user_id}")
@inject
async def createApprovalRequest(
    event_id,
    user_id,
    approval_service: ApprovalService = Depends(Provide[Container.approvals_service]),
):
    return approval_service.create(event_id, user_id)


@router.get("/{event_id}/")
@inject
async def getApprovalRequestsForEvent(
    event_id,
    approval_service: ApprovalService = Depends(Provide[Container.approvals_service]),
):
    return approval_service.get_by_event_id(event_id)


