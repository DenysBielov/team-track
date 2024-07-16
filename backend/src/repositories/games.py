from typing import Iterator
from sqlalchemy.orm import joinedload
from src.orm import models


class GamesRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, game_id) -> models.Game:
        with self.session_factory() as session:
            game = (
                session.query(models.Game)
                .filter(models.Game.id == game_id)
                .options(joinedload(models.Game.location))
                .options(joinedload(models.Game.teams))
                .first()
            )

            if game is None:
                return None
            
            return game

    def get_all(self) -> Iterator[Game]:
        with self.session_factory() as session:
            games = (
                session.query(models.Game)
                .options(joinedload(models.Game.location))
                .order_by(models.Game.date.desc())
                .all()
            )

            return [Game.model_validate(game) for game in games]

    def create(self, game: models.Game):
        with self.session_factory() as session:
            session.add(game)
            session.commit()

    def delete(self, game_id: str):
        with self.session_factory() as session:
            game = (
                session.query(models.Game).filter(models.Game.id == game_id).first()
            )

            if game is None:
                return

            session.delete(game)
            session.commit()

    def update(self, game: models.Game):
        with self.session_factory() as session:
            model = (
                session.query(models.Game).filter(models.Game.id == game.id).first()
            )

            for key in model.__dict__.keys():
                setattr(model, key, game[key])

            session.commit()
