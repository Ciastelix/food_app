from pydantic import BaseModel
from datetime import datetime
from datetime import date


class UserIn(BaseModel):
    username: str
    password: str
    email: str


class UserUpdate(BaseModel):
    weight: int = None
    height: int = None
    gender: str = None
    meals_count: int = None
    activity: float = None
    goal: str = None
    age: int = None


class Meal(BaseModel):
    id: int
    recipe_id: int
    user_id: int
    date: date

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    created_at: datetime
    weight: int
    height: int
    goal: str
    activity: float
    username: str
    email: str
    id: int
    calories: int
    gender: str
    age: int
    meals_count: int

    class Config:
        orm_mode = True


class TokenData(BaseModel):
    id: int = None
    exp: int
