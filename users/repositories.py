from models import User, Meal
from schemas import UserIn, UserUpdate
from typing import Callable
from contextlib import AbstractContextManager
from sqlalchemy.orm import Session
from utils import (
    hash_password,
    add_to_db,
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    oauth2_scheme,
    check_password,
)
from sqlalchemy.exc import IntegrityError, NoResultFound
from os import environ
from dotenv import load_dotenv
import requests
from random import choice
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from datetime import timedelta
from schemas import TokenData

load_dotenv()

headers = {
    "X-RapidAPI-Key": environ.get("KEY", None),
    "X-RapidAPI-Host": environ.get("HOST", None),
}


class UserRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    async def get_current_user(self, token: Depends(oauth2_scheme)) -> TokenData:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("username")
            if username is None:
                raise credentials_exception
            token_data = {"username": username}
        except JWTError:
            raise credentials_exception
        with self.session_factory() as session:
            user = (
                session.query(User)
                .filter(User.username == token_data["username"])
                .first()
            )
        if user is None:
            raise credentials_exception
        return TokenData(id=user.id, exp=payload.get("exp"))

    def create_user(self, user: UserIn) -> User:
        with self.session_factory() as session:
            user_entity = User(
                username=user.username,
                password=hash_password(user.password),
                email=user.email,
            )
            try:
                add_to_db(session, user_entity)
            except IntegrityError:
                raise IntegrityError
            return user_entity

    def get_user(self, user_id: int) -> User:
        with self.session_factory() as session:
            user = session.query(User).get(user_id)
            if not user:
                raise NoResultFound
            return user

    def get_users(self) -> list[User]:
        with self.session_factory() as session:
            users = session.query(User).all()
            return users

    def update_user(self, user_id: int, **kwargs) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise NoResultFound
            for key, value in kwargs.items():
                setattr(user, key, value)
            session.commit()
            return user

    def update_user_data(self, user_id: int, user_: UserUpdate) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise NoResultFound
            weight = user.weight = user_.weight
            height = user.height = user_.height
            gender = user.gender = user_.gender
            age = user.age = user_.age
            goal = user.goal = user_.goal
            activity = user.activity = user_.activity

            if gender.lower() == "m":
                bmr = 10 * weight + 6.25 * height - 5 * age + 5
            elif gender.lower() == "f":
                bmr = 10 * weight + 6.25 * height - 5 * age - 161
            else:
                raise ValueError("Invalid gender. Please enter 'male' or 'female'.")

            if goal.lower() == "l":
                bmr = bmr - 500
            elif goal.lower() == "g":
                bmr = bmr + 500
            elif goal.lower() == "m":
                bmr = bmr
            else:
                raise ValueError("Invalid goal. Please enter 'l' or 'g' or 'm'.")

            calorie_needs = int(bmr * activity)
            user.calories = calorie_needs
            session.commit()
            session.refresh(user)
            return user

    def delete_user(self, user_id: int) -> None:
        with self.session_factory() as session:
            user = session.query(User).get(user_id)
            if not user:
                raise NoResultFound
            user.delete()
            session.commit()
            session.refresh(user)

    def authenticate(self, username: str, password: str) -> dict:
        with self.session_factory() as session:
            user_entity = session.query(User).filter(User.username == username).first()
            if not user_entity:
                return NoResultFound
            if not check_password(password, user_entity.password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"username": username}, expires_delta=access_token_expires
            )
        return {"access_token": access_token, "token_type": "bearer"}

    def get_recipe_ingrediants(
        self, ingredients: int, numer: int, ignorePantry: bool, ranking: int
    ) -> list[dict]:
        url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients"
        response = requests.get(
            url,
            headers=headers,
            params={
                "ingredients": ingredients,
                "number": numer,
                "ignorePantry": ignorePantry,
                "ranking": ranking,
            },
        )
        return response.json()

    def get_recipe_by_id(slef, id: int) -> dict:
        url = f"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/{id}/information"
        response = requests.get(url, headers=headers)
        return response.json()

    def get_recipe_by_multiple(self, **kwargs) -> list[dict]:
        if "query" in kwargs.keys():
            url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients"
        else:
            url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch"
        params = {key: value for key, value in kwargs.items() if value is not None}
        response = requests.get(url, headers=headers, params={**params})
        return response.json()

    def add_meal(self, user_id: int, recipe_id: int) -> None:
        with self.session_factory() as session:
            meal = Meal(user_id=user_id, recipe_id=recipe_id)
            add_to_db(session, meal)

    def generate_day(self, user_id: int) -> list[dict]:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            calories = user.calories
            proprotion = None
            if not user:
                raise NoResultFound
            meals_count = user.meals_count

            if meals_count == 3:
                from utils import PROPORTION_3

                proprotion = PROPORTION_3
            elif meals_count == 4:
                from utils import PROPORTION_4

                proprotion = PROPORTION_4
            elif meals_count == 5:
                from utils import PROPORTION_5

                proprotion = PROPORTION_5
            elif meals_count == 6:
                from utils import PROPORTION_6

                proprotion = PROPORTION_6
            else:
                raise ValueError

            meals = []
            for i in proprotion:
                recipes = self.get_recipe_by_multiple(
                    maxCalories=calories * i, minCalories=(calories * i) - 100
                )
                choice_recipe = choice(recipes["results"])
                meals.append(choice_recipe)
                self.add_meal(user_id, choice_recipe["id"])
            return meals

    def get_users_meal_plan(self, user_id: int) -> list[Meal]:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise NoResultFound
            meals = session.query(Meal).filter_by(user_id=user_id).all()
            return meals

    def add_favorite_recipe(self, user_id: int, recipe_id: int) -> None:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise NoResultFound
            user.favorite_recipes.append(recipe_id)
            session.commit()
            session.refresh(user)

    def remove_favorite_recipe(self, user_id: int, recipe_id: int) -> None:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise NoResultFound
            user.favorite_recipes.remove(recipe_id)
            session.commit()
            session.refresh(user)
