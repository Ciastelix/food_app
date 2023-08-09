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
from random import randint, choice
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from datetime import timedelta
from schemas import TokenData
from datetime import datetime


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

    
    def refresh_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            
            exp = payload.get("exp")
            if exp is None or datetime.utcfromtimestamp(
                exp
            ) <= datetime.utcnow() + timedelta(minutes=10):
                
                user_id = payload.get("id")
                if user_id is None:
                    raise JWTError("Token does not contain user id")
                new_token_data = {"id": user_id}
                new_access_token = create_access_token(
                    new_token_data, expires_delta=timedelta(minutes=15)
                )
                return {
                    "access_token": new_access_token,
                    "exp": datetime.utcnow() + timedelta(minutes=15),
                }
            else:
                
                return {"access_token": token, "exp": datetime.utcfromtimestamp(exp)}
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def create_user(self, user: UserIn) -> User:
        with self.session_factory() as session:
            user_entity = User(
                username=user.username,
                password=hash_password(user.password),
                email=user.email,
                gender=user.gender,
            )
            try:
                add_to_db(session, user_entity)
            except IntegrityError:
                raise IntegrityError("Username or email already exists.", None, None)
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
            gender = user.gender
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
            refresh_expire = timedelta(days=30)
            refresh_token = create_access_token(
                data={"username": username}, expires_delta=refresh_expire
            )

            access_token = create_access_token(
                data={"username": username}, expires_delta=access_token_expires
            )
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

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

    def get_recipe_by_multiple(self, query, **kwargs) -> list[dict]:
        if query:
            url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients"
        else:
            url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch"
        params = {key: value for key, value in kwargs.items() if value is not None}
        response = requests.get(url, headers=headers, params={**params})
        return response.json()

    def add_meal(self, user_id: int, recipe_id: int, days: int = 0) -> None:
        with self.session_factory() as session:
            meal = Meal(
                user_id=user_id,
                recipe_id=recipe_id,
                date=datetime.now() + timedelta(days=days),
            )
            add_to_db(session, meal)

    def generate_day(self, user_id: int, days: int) -> list[dict]:
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

            day = []
            meals = []
            i = 0
            while i <= days:
                for j in proprotion:
                    recipes = self.get_recipe_by_multiple(
                        maxCalories=(calories * j),
                    )

                    choice_recipe = choice(recipes)
                    day.append(choice_recipe)
                    self.add_meal(user_id, choice_recipe["id"], i)
                meals.append({datetime.now() + timedelta(days=i): day})
                i += 1

            return meals

    def get_users_meal_plan(self, user_id: int) -> list[Meal]:
        with self.session_factory() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise NoResultFound
            meals = session.query(Meal).filter_by(user_id=user_id).all()
            days = [i.date for i in meals]
            days = list(set(days))
            meals = []
            for day in days:
                meals.append(
                    {
                        day: [
                            {
                                "recipe": meal.recipe_id,
                            }
                            for meal in session.query(Meal)
                            .filter_by(user_id=user_id, date=day)
                            .all()
                        ]
                    }
                )
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
