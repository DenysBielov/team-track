from src.orm import models
from src.repositories.common import Repository
from sqlalchemy.orm import joinedload


class ApprovalsRepository(Repository[models.Approval]):
    def __init__(self, session_factory) -> None:
        super().__init__(session_factory, models.Approval)

    def get(self, user_id, event_id):
        with self.session_factory() as session:
            return (
                session.query(models.Approval)
                .filter(models.Approval.user_id == user_id)
                .filter(models.Approval.event_id == event_id)
                .first()
            )

    def get_by_event_id(self, event_id):
        with self.session_factory() as session:
            return (
                session.query(models.Approval)
                .filter(models.Approval.event_id == event_id)
                .options(joinedload(models.Approval.user))
                .all()
            )

    def update(self, approval):
        with self.session_factory() as session:
            model = (
                session.query(self.model).filter(self.model.id == approval.id).first()
            )

            model.approved = approval.approved

            session.commit()
