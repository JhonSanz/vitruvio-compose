import os
from fastapi import FastAPI
from backend.app.api.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from neomodel import config

HOST = os.getenv("HOST", "localhost")
DB_USERNAME = os.getenv("NEO4J_USER", "neo4j")
DB_PASSWORD = os.getenv("NEO4J_PASSWORD", "holamundo")

print("DB_USERNAME", DB_USERNAME)
print("DB_PASSWORD", DB_PASSWORD)

app = FastAPI()
config.DATABASE_URL = f'bolt://{DB_USERNAME}:{DB_PASSWORD}@{HOST}:7687'

app.include_router(api_router)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
