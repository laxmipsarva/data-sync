from pathlib import Path
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from .helpers import parse_and_validate_amount

class User(SQLModel, table=True):
    user_id: int = Field(primary_key=True)
    email: str = Field(index=False)

class Subscription(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.user_id")
    signup_date: datetime
    plan_tier: str
    mrr: float
    is_active: bool

class UserCreate(SQLModel):
    user_id: int
    email: str

class SubscriptionCreate(SQLModel):
    user_id: int
    signup_date: datetime
    plan_tier: str
    mrr: float
    is_active: bool


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI()

app.frontend("/", directory=Path(__file__).parent.parent / "dist")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/api/subscriptions/")
def create_subscription(subscription: SubscriptionCreate, user: UserCreate, session: Session = Depends(get_session)) -> Subscription:
    # Create User instance
    user_instance = User(**user.dict())
    # Create Subscription instance
    date = subscription.signup_date
    if not isinstance(date, datetime):
        raise HTTPException(status_code=400, detail="Invalid date format")
    iso_date = date.isoformat()
    mrr = parse_and_validate_amount(subscription.mrr)
    is_active = subscription.is_active
    active = True if is_active in [True, "true", "Y", "YES"] else False
    subscription_instance = Subscription(
        user_id=subscription.user_id,
        signup_date=iso_date,
        plan_tier=subscription.plan_tier,
        mrr=mrr,
        is_active=active
    )
    # Add instances to session
    session.add(user_instance)
    session.add(subscription_instance)
    # Commit changes
    session.commit()
    # Refresh instances
    session.refresh(user_instance)
    session.refresh(subscription_instance)
    return (user_instance, subscription_instance)


@app.get("/api/subscriptions/")
def get_subscriptions(
    session: Session = Depends(get_session),
) -> list[Subscription]:
    subscriptions = session.exec(select(Subscription, User).join(User)).all()
    return subscriptions