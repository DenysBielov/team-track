from typing import Generic, TypeVar
from sqlalchemy.orm.attributes import flag_modified

T = TypeVar("T")


class Repository(Generic[T]):
    def __init__(self, session_factory, model) -> None:
        self.session_factory = session_factory
        self.model = model

    def create(self, entity: T):
        with self.session_factory() as session:
            session.add(entity)
            session.commit()

    def delete(self, entity_id: str):
        with self.session_factory() as session:
            event = session.query(self.model).filter(self.model.id == entity_id).first()

            if event is None:
                return

            session.delete(event)
            session.commit()

    def update(self, entity: T):
        with self.session_factory() as session:
            try:
                model = (
                    session.query(self.model).filter(self.model.id == entity.id).first()
                )
                if model:
                    updatable_keys = [
                        key for key in model.__dict__.keys() if not key.startswith("_")
                    ]

                    for key in updatable_keys:
                        if key in entity.__dict__:
                            setattr(model, key, entity.__dict__[key])

                    session.commit()
                else:
                    print(f"No entity found with id {entity.id}")
            except Exception as e:
                session.rollback()
                print(f"An error occurred: {e}")
