from src.models.user import User
from src.repositories.common import Repository
from src.orm import models


class UsersRepository(Repository[User]):
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory
        self.model = models.User

    def get(self, user_id):
        with self.session_factory() as session:
            return session.query(models.User).filter(models.User.id == user_id).first()

    def get_by_email(self, email):
        with self.session_factory() as session:
            return session.query(models.User).filter(models.User.email == email).first()

    def get_all(self):
        with self.session_factory() as session:
            return session.query(models.User).all()

    def create(self, user: models.User):
        with self.session_factory() as session:
            session.add(user)
            session.commit()
            session.refresh(user)

            return user

    def delete(self, user_id: str):
        with self.session_factory() as session:
            user = session.query(models.User).filter(models.User.id == user_id).first()

            if user is None:
                return

            session.delete(user)
            session.commit()

    def exists(self, user_id):
        with self.session_factory() as session:
            return (
                session.query(models.User.id).filter(models.User.id == user_id).first()
                is not None
            )

    def exists_by_email(self, email):
        with self.session_factory() as session:
            return (
                session.query(models.User.id).filter(models.User.email == email).first()
                is not None
            )
