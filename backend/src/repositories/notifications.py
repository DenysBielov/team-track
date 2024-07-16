from contextlib import AbstractContextManager
from typing import Callable
from sqlalchemy.orm import Session


class EventRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory
