from datetime import datetime, time
from typing import List
from typing import Optional
import uuid
from sqlalchemy import UUID, Column, ForeignKey, Table
from sqlalchemy.orm import relationship, backref, mapped_column, Mapped, DeclarativeBase
from passlib.context import CryptContext

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return password_context.hash(password)


class Base(DeclarativeBase):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    pass


game_team_association = Table(
    "game_team_association",
    Base.metadata,
    Column("game_id", UUID(as_uuid=True), ForeignKey("games.id"), primary_key=True),
    Column("team_id", UUID(as_uuid=True), ForeignKey("teams.id"), primary_key=True),
)

club_admin_association = Table(
    'club_admin_association', Base.metadata,
    Column('club_id', UUID(as_uuid=True), ForeignKey('clubs.id'), primary_key=True),
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id'), primary_key=True)
)

event_admin_association = Table(
    "event_admin_association",
    Base.metadata,
    Column("event_id", UUID(as_uuid=True), ForeignKey("events.id"), primary_key=True),
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    email: Mapped[str]
    name: Mapped[str]
    image: Mapped[Optional[str]] = mapped_column(nullable=True)
    password_hash: Mapped[Optional[str]]
    clubs: Mapped[List["Club"]] = relationship("Club", secondary=club_admin_association, back_populates="admins")

    def verify_password(self, plain_password):
        return password_context.verify(plain_password, self.hashed_password)

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r})"

class Approval(Base):
    __tablename__ = "approvals"

    approved: Mapped[Optional[bool]] = mapped_column(nullable=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    user: Mapped[User] = relationship()
    event_id: Mapped[UUID] = mapped_column(ForeignKey("events.id"))
    event: Mapped["Event"] = relationship()

class Location(Base):
    __tablename__ = "locations"

    name: Mapped[str]
    address: Mapped[str]
    lat_lng: Mapped[str]


class Event(Base):
    __tablename__ = "events"

    name: Mapped[str]
    date: Mapped[datetime]
    location_id: Mapped[UUID] = mapped_column(ForeignKey("locations.id"))
    location: Mapped[Location] = relationship()
    start_time: Mapped[time]
    end_time: Mapped[time]
    teams: Mapped[List["Team"]] = relationship("Team", back_populates="event")
    approve_guests: Mapped[bool]
    games: Mapped[List["Game"]] = relationship("Game", back_populates="event")
    admins: Mapped[List["User"]] = relationship("User", secondary=event_admin_association)
    club_id: Mapped[UUID] = mapped_column(ForeignKey("clubs.id"), nullable=True)
    club: Mapped[Optional["Club"]] = relationship() 

    # TODO: Too much parameters
    def __init__(self, name, date, location, start_time, end_time, approve_guests, admins, id=None):
        self.approve_guests = approve_guests
        self.id = id
        self.name = name
        self.date = date
        self.location_id = location.id
        self.start_time = start_time
        self.end_time = end_time
        self.admins = admins


class PositionType(Base):
    __tablename__ = "positionsTypes"

    name: Mapped[str]


class Position(Base):
    __tablename__ = "positions"

    position_type_id: Mapped[UUID] = mapped_column(ForeignKey("positionsTypes.id"))
    position_type: Mapped[PositionType] = relationship()
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=True)
    user: Mapped[User] = relationship()
    team_id: Mapped[UUID] = mapped_column(ForeignKey("teams.id"))
    team: Mapped["Team"] = relationship()
    paid: Mapped[bool] = mapped_column(default=False)


class Team(Base):
    __tablename__ = "teams"

    name: Mapped[str]
    games: Mapped[List["Game"]] = relationship(
        "Game", secondary=game_team_association, back_populates="teams"
    )
    positions: Mapped[List["Position"]] = relationship(
        "Position", back_populates="team", cascade="all, delete-orphan"
    )
    event_id: Mapped[UUID] = mapped_column(ForeignKey("events.id"), nullable=True)
    event: Mapped[Event] = relationship("Event", back_populates="teams", cascade="")


class NotificationSubscription(Base):
    __tablename__ = "notificationSubscriptions"

    subscription: Mapped[str]
    user: Mapped[User] = relationship("User")
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))


class WaitlistItem(Base):
    __tablename__ = "waitlistItems"
    # TODO: Confusing naming between position and position user id
    position_id: Mapped[UUID] = mapped_column(ForeignKey("positions.id"))
    position: Mapped[Position] = relationship(
        "Position", backref=backref(name="waitlistItems", cascade="delete")
    )
    user: Mapped[User] = relationship(
        "User", backref=backref(name="waitlistItems", cascade="delete")
    )
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))


class Game(Base):
    __tablename__ = "games"

    event_id: Mapped[UUID] = mapped_column(ForeignKey("events.id"), nullable=True)
    event: Mapped[Event] = relationship("Event", back_populates="games")
    teams: Mapped[List["Team"]] = relationship(
        "Team", secondary=game_team_association, back_populates="games"
    )


class GameAction(Base):
    __tablename__ = "gameActions"
    user: Mapped[User] = relationship(
        "User", backref=backref(name="gameActions", cascade="delete")
    )
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    game: Mapped[User] = relationship(
        "Game", backref=backref(name="gameActions", cascade="delete")
    )
    game_id: Mapped[UUID] = mapped_column(ForeignKey("games.id"))


class Club(Base):
    __tablename__ = "clubs"

    name: Mapped[str]
    admins: Mapped[User] = relationship("User", secondary=club_admin_association, back_populates="clubs")


class ClubSubscription(Base):
    __tablename__ = "clubSubscriptions"

    club_id: Mapped[UUID] = mapped_column(ForeignKey("clubs.id"))
    club: Mapped[Club] = relationship("Club")
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    user: Mapped[User] = relationship("User")
