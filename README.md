# Diet App Documentation

## Project Overview

The Diet App is a FastAPI-based web application that allows users to manage their diet plans, favorite recipes, and generate meal plans based on their dietary needs and preferences. The application is built using the FastAPI framework and leverages dependency injection, SQLAlchemy for database management, and various external APIs to provide recipe information.

## Project Structure

The project is organized into several modules, each serving a specific purpose:

### `users/containers.py`

This module defines the dependency injection container and configuration for the application. It manages the wiring of various services and providers, including the `UserService`, `UserRepository`, and `Database` instances.

### `users/db.py`

This module defines the `Database` class, responsible for managing the connection to the database. It includes methods for creating the database, managing sessions, and rolling back transactions in case of exceptions.

### `users/endpoints.py`

This module defines the FastAPI API router and various endpoints for user authentication, recipe retrieval, and user data management. It utilizes the `UserService` to handle user-related operations and JWT authentication for protected endpoints.

### `users/main.py`

This module is the entry point of the FastAPI application. It creates an instance of the FastAPI app, sets up CORS middleware, and includes the API endpoints from the `endpoints.py` module.

### `users/models.py`

This module defines the SQLAlchemy database models used in the application. It includes the `User`, `FavoriteRecipe`, and `Meal` classes, each representing different aspects of user data and relationships.

### `users/repositories.py`

This module contains the `UserRepository` class, which encapsulates database operations related to users. It interacts with the database to perform actions such as user creation, data retrieval, and authentication.

### `users/schemas.py`

This module defines Pydantic models that represent data structures used in the application, including user input models (`UserIn`, `UserUpdate`), output models (`UserOut`, `TokenData`), and recipe-related models (`Meal`).

### `users/services.py`

This module contains the `UserService` class, responsible for handling business logic related to user operations. It uses the `UserRepository` to perform CRUD operations on user data and interacts with external APIs to retrieve recipe information.

### `users/utils.py`

This module includes utility functions and constants used throughout the application. It provides functions for password hashing, JWT token generation, and more. It also defines proportion constants used in generating meal plans.

### `pyproject.toml`

This file contains project metadata, dependencies, and configuration. It specifies project details, dependencies, Python version compatibility, and license information.

## API Endpoints

Here is a summary of the main API endpoints provided by the Diet App:

- `POST /token`: Authenticate user and generate access token.
- `POST /token/refresh`: Refresh access token.
- `POST /users`: Create a new user.
- `GET /users`: Get a list of all users.
- `PUT /users`: Update user data.
- `GET /users/me`: Get user details.
- `GET /recipes/`: Get recipes by ingredients.
- `GET /recipes/id/{id}`: Get recipe by ID.
- `GET /recipes/multiple`: Get recipes by multiple filters.
- `PUT /users/data/`: Update user data for calculating calorie needs.
- `POST /user/diets`: Generate meal plan for a given number of days.
- `GET /users/diets`: Get user's meal plan.
- `POST /users/favorite/{recipe_id}`: Add a recipe to user's favorite list.
- `DELETE /users/favorite/{recipe_id}`: Remove a recipe from user's favorite list.

## Conclusion

The Diet App is a comprehensive application that enables users to manage their diet plans and favorite recipes. It provides a variety of API endpoints for user authentication, data management, and recipe retrieval. The application's modular structure, use of dependency injection, and integration with external APIs contribute to its functionality and flexibility.
