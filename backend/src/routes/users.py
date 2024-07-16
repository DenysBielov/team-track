from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from src.services.images import ImageService
from src.services.positions import PositionService
from src.containers import Container
from src.models.user import User, UserCreate, GoogleUserCreate, UserLogin
from src.orm import models
from src.services.users import UserService

router = APIRouter(
    prefix="/users",
)


@router.post("")
@inject
async def createUser(
    image: UploadFile = File(...),
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    user_service: UserService = Depends(Provide[Container.user_service]),
    image_service: ImageService = Depends(Provide[Container.image_service]),
):
    user_model = UserCreate(
        name=f"{name} {surname}",
        email=email,
        password_hash=models.get_password_hash(password),
    )

    if user_service.exists_by_email(email):
        return JSONResponse({"error": "User already exists"}, 400)

    db_user = user_service.create(user_model)

    url = image_service.upload(str(db_user.id), image.file)
    db_user.image = url

    user_service.update(db_user)


@router.get("/{user_id}/positionPayments")
@inject
async def getUserPositionPayments(
    user_id: str,
    position_service: PositionService = Depends(Provide[Container.position_service]),
):
    return [
        {
            "date": p.team.event.date,
            "paid": p.paid,
            "eventId": p.team.event.id,
            "position": p.position_type.name,
        }
        for p in position_service.get_all_by_user(user_id)
    ]


@router.post("/google")
@inject
async def createUserGoolge(
    user: GoogleUserCreate,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    user_model = {"name": user.name, "email": user.email, "image": user.image}

    if user_service.exists_by_email(user.email):
        return JSONResponse({"error": "User already exists"}, 400)

    db_user = User(**user_model)
    user_service.create(db_user)

    return db_user


@router.put("/google")
@inject
async def saveUserGoogle(
    user: GoogleUserCreate,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    user_model = {"name": user.name, "email": user.email, "image": user.image}

    if user_service.exists_by_email(user.email):
        user_service.update(User(**user_model))
    else:
        user_service.create(user_model)

    # TODO: Too many requests
    user = user_service.get_by_email(user.email)

    return user


@router.get("/{user_id}/{event_id}/suspension")
@inject
async def getSuspension(
    user_id,
    event_id,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.get_suspension(user_id, event_id)


@router.get("/login")
@inject
async def login(
    email: str,
    password: str,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.login(email, password)
