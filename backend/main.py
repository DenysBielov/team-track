from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware import ConvertResponseMiddleware
from starlette.middleware.sessions import SessionMiddleware
import uvicorn
from src.containers import Container
from src.routes import (
    events,
    locations,
    teams,
    positions,
    subscriptions,
    users,
    waitlist,
    position_types,
    payments, 
    clubs,
    approvals
)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ConvertResponseMiddleware)
app.add_middleware(SessionMiddleware, secret_key="some-random-string")

app.include_router(events.router)
app.include_router(locations.router)
app.include_router(teams.router)
app.include_router(positions.router)
app.include_router(users.router)
app.include_router(subscriptions.router)
app.include_router(waitlist.router)
app.include_router(position_types.router)
app.include_router(payments.router)
app.include_router(clubs.router)
app.include_router(approvals.router)

container = Container()
db = container.db()
db.create_database()

app.container = container

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
