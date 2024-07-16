from src.repositories.events import EventsRepository


class EventService:
  def __init__(self, event_repository: EventsRepository) -> None:
    self