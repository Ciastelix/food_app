from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
from os import environ
from fastapi import APIRouter
from datetime import datetime, timedelta
from jose import jwt
from fastapi.security import OAuth2PasswordBearer


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()
load_dotenv()

SECRET_KEY = environ.get("SECRET_KEY", "secret")
ALGORITHM = environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
PROPORTION_3 = [0.4, 0.4, 0.2]
PROPORTION_4 = [0.3, 0.3, 0.1, 0.3]
PROPORTION_5 = [0.25, 0.2, 0.25, 0.05, 0.25]
PROPORTION_6 = [
    0.2,
    0.15,
    0.2,
    0.1,
    0.15,
    0.2,
]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def check_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def add_to_db(session: Session, obj: declarative_base()) -> None:
    session.add(obj)
    session.commit()
    session.refresh(obj)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
