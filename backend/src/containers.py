from dependency_injector import containers, providers
from src.services.images import ImageService
from src.repositories.approvals import ApprovalsRepository
from src.services.approvals import ApprovalService
from src.repositories.position_types import PositionTypesRepository
from src.services.position_types import PositionTypeService
from src.services.notifications import NotificationService
from src.repositories.waitlist import WaitlistRepository
from src.services.waitlist import WaitlistService
from src.repositories.users import UsersRepository
from src.services.users import UserService
from src.repositories.subscriptions import SubscriptionsRepository
from src.services.subscriptions import SubscriptionService
from src.database import Database
from src.repositories.events import EventsRepository
from src.repositories.locations import LocationsRepository
from src.repositories.positions import PositionsRepository
from src.repositories.teams import TeamsRepository
from src.services.events import EventService
from src.services.locations import LocationService
from src.services.positions import PositionService
from src.services.teams import TeamService


class Container(containers.DeclarativeContainer):

    config = providers.Configuration(yaml_files=["../config.yml"])
    wiring_config = containers.WiringConfiguration(
        modules=[
            "src.routes.events",
            "src.routes.locations",
            "src.routes.payments",
            "src.routes.positions",
            "src.routes.subscriptions",
            "src.routes.teams",
            "src.routes.users",
            "src.routes.waitlist",
            "src.routes.position_types",
            "src.routes.approvals",
        ]
    )

    db = providers.Singleton(
        Database,
        db_url="postgresql+psycopg2://postgres:bt3PdQWYSPWYEm92TNTv@team-track-db.cfw288ayalpj.eu-west-2.rds.amazonaws.com/team-track",
    )  # config.get("db.url", None))

    # REPOSITORIES
    subscriptions_repository = providers.Factory(
        SubscriptionsRepository,
        session_factory=db.provided.session,
    )
    users_repository = providers.Factory(
        UsersRepository,
        session_factory=db.provided.session,
    )
    waitlist_repository = providers.Factory(
        WaitlistRepository,
        session_factory=db.provided.session,
    )
    events_repository = providers.Factory(
        EventsRepository,
        session_factory=db.provided.session,
    )
    teams_repository = providers.Factory(
        TeamsRepository,
        session_factory=db.provided.session,
    )
    locations_repository = providers.Factory(
        LocationsRepository,
        session_factory=db.provided.session,
    )
    positions_repository = providers.Factory(
        PositionsRepository,
        session_factory=db.provided.session,
    )
    position_types_repository = providers.Factory(
        PositionTypesRepository,
        session_factory=db.provided.session,
    )
    approvals_repository = providers.Factory(
        ApprovalsRepository,
        session_factory=db.provided.session,
    )
    # REPOSITORIES

    # SERVICES
    subscription_service = providers.Factory(
        SubscriptionService, subscriptions_repository=subscriptions_repository
    )
    user_service = providers.Factory(
        UserService,
        users_repository=users_repository,
        positions_repository=positions_repository,
    )
    waitlist_service = providers.Factory(
        WaitlistService, waitlist_repository=waitlist_repository
    )
    event_service = providers.Factory(
        EventService,
        events_repository=events_repository,
    )
    team_service = providers.Factory(
        TeamService,
        teams_repository=teams_repository,
    )
    location_service = providers.Factory(
        LocationService, locations_repository=locations_repository
    )
    notification_service = providers.Factory(NotificationService)
    position_service = providers.Factory(
        PositionService,
        positions_repository=positions_repository,
        user_repository=users_repository,
        notification_service=notification_service,
        waitlist_service=waitlist_service,
        subscription_service=subscription_service,
    )
    position_types_service = providers.Factory(
        PositionTypeService, position_types_repository=position_types_repository
    )
    approvals_service = providers.Factory(
        ApprovalService, approvals_repository=approvals_repository
    )
    image_service = providers.Factory(ImageService)
    # SERVICES
