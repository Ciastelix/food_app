from repositories import UserRepository
from models import User
from schemas import UserIn, UserUpdate
from schemas import UserOut
from schemas import TokenData


class UserService:
    def __init__(self, user_repository: UserRepository) -> None:
        self._repository: UserRepository = user_repository

    def get_users(self) -> list[UserOut]:
        users = self._repository.get_users()
        return users

    def create_user(self, user: UserIn) -> UserOut:
        user_entity = self._repository.create_user(user)
        return user_entity

    def get_user(self, user_id: int) -> UserOut:
        user_entity = self._repository.get_user(user_id)
        return user_entity

    def update_user(self, user_id: int, **kwargs) -> UserOut:
        return self._repository.update_user(user_id, **kwargs)

    def update_user_data(self, user_id: int, user: UserUpdate) -> UserOut:
        user_entity = self._repository.update_user_data(user_id, user)
        return user_entity

    def delete_user(self, user_id: int) -> None:
        self._repository.delete_user(user_id)

    def get_recipe(
        self, ingredients: int, numer: int, ignorePantry: bool, ranking: int
    ) -> list[dict]:
        return self._repository.get_recipe_ingredients(
            ingredients, numer, ignorePantry, ranking
        )

    def get_recipe_by_id(self, id: int) -> dict:
        return self._repository.get_recipe_by_id(id)

    def get_recipe_by_multiple(self, query, **kwargs) -> list[dict]:
        return self._repository.get_recipe_by_multiple(query, **kwargs)

    def generate_day(self, user_id: int) -> list[dict]:
        return self._repository.generate_day(user_id)

    def get_users_meal_plan(self, user_id: int) -> list[dict]:
        return self._repository.get_users_meal_plan(user_id)

    def authenticate_user(self, username: str, password: str) -> dict:
        return self._repository.authenticate(username, password)

    def get_current_user(self, token: str) -> TokenData:
        return self._repository.get_current_user(token)

    def add_favorite_recipe(self, user_id: int, recipe_id: int) -> None:
        self._repository.add_favorite_recipe(user_id, recipe_id)

    def remove_favorite_recipe(self, user_id: int, recipe_id: int) -> None:
        self._repository.remove_favorite_recipe(user_id, recipe_id)
