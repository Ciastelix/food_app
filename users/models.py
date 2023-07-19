from datetime import datetime
from db import Base
from sqlalchemy import Column, Integer, String, DateTime, Float, Date, func
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    calories = Column(Integer, default=0)
    weight = Column(Integer, default=0)
    height = Column(Integer, default=0)
    gender = Column(String(1), default="m")
    goal = Column(String(1), default="m")
    age = Column(Integer, default=0)
    activity = Column(Float, default=1.2)
    meals_count = Column(Integer, default=3)
    meals = relationship("Meal", backref="users")
    favorite_recipes = relationship("FavoriteRecipe", backref="users")


class FavoriteRecipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))


class Meal(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recipe_id = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, default=func.current_date())
