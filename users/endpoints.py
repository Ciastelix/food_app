from fastapi import APIRouter, Depends
from services import UserService
from schemas import UserIn, UserOut, UserUpdate
from containers import Container
from dependency_injector.wiring import inject, Provide
from models import User
from containers import Container
from utils import oauth2_scheme


router = APIRouter()


@inject
def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_service=Depends(Provide[Container.user_service]),
):
    return user_service.get_current_user(token)


@router.post("/token", response_model=dict, status_code=200)
@inject
async def login_for_access_token(
    username: str,
    password: str,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.authenticate_user(username, password)


@router.post("/users", response_model=UserOut, status_code=201)
@inject
async def create_user(
    user: UserIn, user_service: UserService = Depends(Provide[Container.user_service])
):
    return user_service.create_user(user)


@router.get("/users", status_code=200, response_model=list[UserOut])
@inject
async def get_users(
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.get_users()


@router.put("/users", status_code=200, response_model=UserOut)
@inject
async def update_user(
    username: str,
    password: str,
    email: str,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.update_user(
        id=(await current_user).id, username=username, password=password, email=email
    )


@router.get(
    "/users/me",
    status_code=200,
    response_model=UserOut,
)
@inject
async def get_user(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.get_user((await current_user).id)


@router.get("/recipes/", status_code=200, response_model=dict)
@inject
async def get_recipe_by_ingredients(
    ingredients: str,
    numer: int = 10,
    ignorePantry: bool = True,
    ranking: int = 1,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return {"data": user_service.get_recipe(ingredients, numer, ignorePantry, ranking)}


@router.get("/recipes/id/{id}", status_code=200, response_model=dict)
@inject
async def get_recipe_by_id(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return {"data": user_service.get_recipe_by_id((await current_user).id)}


@router.get("/recipes/multiple", status_code=200, response_model=dict)
@inject
async def get_recipe_by_multiple(
    query: str = None,
    cuisine: str = None,
    excludeCuisine: str = None,
    diet: str = None,
    intolerances: str = None,
    equipment: str = None,
    includeIngredients: str = None,
    excludeIngredients: str = None,
    type_: str = None,
    maxReadyTime: int = None,
    minCalories: int = None,
    maxCalories: int = None,
    minProtein: int = None,
    maxProtein: int = None,
    minFat: int = None,
    maxFat: int = None,
    minCarbs: int = None,
    maxCarbs: int = None,
    minSugar: int = None,
    maxSugar: int = None,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return {
        "data": user_service.get_recipe_by_multiple(
            query,
            cuisine=cuisine,
            excludeCuisine=excludeCuisine,
            diet=diet,
            intolerances=intolerances,
            equipment=equipment,
            includeIngredients=includeIngredients,
            excludeIngredients=excludeIngredients,
            type=type_,
            maxReadyTime=maxReadyTime,
            minCalories=minCalories,
            maxCalories=maxCalories,
            minProtein=minProtein,
            maxProtein=maxProtein,
            minFat=minFat,
            maxFat=maxFat,
            minCarbs=minCarbs,
            maxCarbs=maxCarbs,
            minSugar=minSugar,
            maxSugar=maxSugar,
        )
    }


@router.put("/users/data/", status_code=200, response_model=UserOut)
@inject
async def update_user_data(
    user: UserUpdate,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    """
    Calculate daily calorie needs using the Mifflin-St Jeor equation.

    Parameters:
    weight (float): Weight in kilograms
    height (float): Height in centimeters
    age (int): Age in years
    gender (str): 'male' or 'female'
    activity_level (float): Activity level (1.2 for sedentary, 1.375 for light activity, 1.55 for moderate activity,
                            1.725 for very active, and 1.9 for extra active)

    """
    return user_service.update_user_data((await current_user).id, user)


@router.post("/user/diets", status_code=201, response_model=UserOut)
@inject
async def generate_day(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.generate_day((await current_user).id)


@router.get("/users/diets", status_code=200, response_model=UserOut)
@inject
async def get_diet(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.get_users_meal_plan((await current_user).id)


@router.post("/users/favorite/{recipe_id}", status_code=201)
@inject
async def add_favorite_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.add_favorite_recipe((await current_user).id, recipe_id)


@router.delete("/users/favorite/{recipe_id}", status_code=200)
@inject
async def delete_favorite_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.delete_favorite_recipe((await current_user).id, recipe_id)
