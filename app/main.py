from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.logging import configure_logging
from .core.config import settings
from .db import Base, engine

from .routers import auth as r_auth
from .routers import files as r_files
from .routers import ingest as r_ingest
from .routers import categorize as r_categorize
from .routers import transactions as r_transactions
from .routers import fixed_costs as r_fixed
from .routers import analytics as r_analytics
from .routers import coach as r_coach

# ---- Logging eerst
configure_logging()

# ---- App aanmaken
app = FastAPI(title=settings.APP_NAME)

# ---- CORS (frontend + lokale dev)
origins = [
    "http://localhost:3010",
    "http://127.0.0.1:3010",
    "https://endsmeet-frontend.onrender.com",
    "https://www.endsmeet.nl",
    "https://endsmeet.nl",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- DB tabellen aanmaken
Base.metadata.create_all(bind=engine)

# ---- Routers registreren onder /api
API_PREFIX = settings.API_PREFIX  # meestal "/api"

app.include_router(r_auth.router,         prefix=API_PREFIX)
app.include_router(r_files.router,        prefix=API_PREFIX)
app.include_router(r_ingest.router,       prefix=API_PREFIX)
app.include_router(r_categorize.router,   prefix=API_PREFIX)
app.include_router(r_transactions.router, prefix=API_PREFIX)
app.include_router(r_fixed.router,        prefix=API_PREFIX)
app.include_router(r_analytics.router,    prefix=API_PREFIX)
app.include_router(r_coach.router,        prefix=API_PREFIX)