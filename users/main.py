from fastapi import FastAPI
import endpoints
from containers import Container

container = Container()

db = container.db()
db.create_database()
app = FastAPI()
app.container = container
app.include_router(endpoints.router)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
