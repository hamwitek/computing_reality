from contextlib import asynccontextmanager

from app.api.v1.core.models import Company
from app.api.v1.core.schemas import CompanySchema
from app.api.v1.routers import router
from app.db_setup import get_db, init_db
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session


# Funktion som körs när vi startar FastAPI -
# perfekt ställe att skapa en uppkoppling till en databas
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # Vi ska skapa denna funktion
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/v1", tags=["v1"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
