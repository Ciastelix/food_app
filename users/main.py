from fastapi import FastAPI
import endpoints
from containers import Container
from fastapi.middleware.cors import CORSMiddleware

container = Container()

db = container.db()
db.create_database()
app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.container = container
app.include_router(endpoints.router)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
