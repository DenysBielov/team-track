from sqlalchemy import UUID
from src.repositories.approvals import ApprovalsRepository
from src.orm import models


class ApprovalService:
    def __init__(self, approvals_repository: ApprovalsRepository) -> None:
        self._repository: ApprovalsRepository = approvals_repository

    def get(self, user_id, event_id) -> models.Approval:
        return self._repository.get(user_id, event_id)

    def get_by_event_id(self, event_id) -> models.Approval:
        return self._repository.get_by_event_id(event_id)

    def create(self, event_id, user_id):
        return self._repository.create(
            models.Approval(**{"event_id": event_id, "user_id": user_id})
        )

    def update(self, event_id, user_id, approved):
        approval = self._repository.get(user_id, event_id)
        setattr(approval, "approved", approved)
        
        return self._repository.update(approval)
