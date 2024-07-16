from typing import Iterator
from sqlalchemy.orm import joinedload
from src.orm import models


class ClubsRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def create(self, club: models.Club):
        with self.session_factory() as session:
            session.add(club)
            session.commit()

    def get(self, club_id) -> models.Club:
        with self.session_factory() as session:
            club = (
                session.query(models.Club)
                .filter(models.Club.id == club_id)
                .options(joinedload(models.Club.admins))
                .first()
            )

            if club is None:
                return None

            return club

    def get_all(self) -> Iterator[models.Club]:
        with self.session_factory() as session:
            clubs = (
                session.query(models.Club)
                .options(joinedload(models.Club.location))
                .all()
            )

            return clubs
        
    def get_all_by_admin(self, admin_id) -> Iterator[models.Club]:
        with self.session_factory() as session:
            clubs = (
                session.query(models.Club)
                .filter(models.Club.admins.has(id=admin_id))
                .all()
            )

            return clubs

    def create(self, club: models.Club):
        with self.session_factory() as session:
            session.add(club)
            session.commit()

    def delete(self, club_id: str):
        with self.session_factory() as session:
            club = session.query(models.Club).filter(models.Club.id == club_id).first()

            if club is None:
                return

            session.delete(club)
            session.commit()

    def update(self, club: models.Club):
        with self.session_factory() as session:
            model = session.query(models.Club).filter(models.Club.id == club.id).first()

            for key in model.__dict__.keys():
                setattr(model, key, club[key])

            session.commit()
