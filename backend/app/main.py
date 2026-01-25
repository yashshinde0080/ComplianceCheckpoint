from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.v1.organizations import router as organizations_router
from app.api.v1.controls import router as controls_router
from app.api.v1.policies import router as policies_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.audits import router as audits_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="ComplianceCheckpoint API",
    description="Automated Compliance Readiness Platform for SMB SaaS",
    version="1.0.0",
    lifespan=lifespan
)

# CORS - Allow multiple ports for development
cors_origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5179",
    "http://localhost:5180",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(organizations_router, prefix="/api/v1/organizations", tags=["Organizations"])
app.include_router(controls_router, prefix="/api/v1/controls", tags=["Controls"])
app.include_router(policies_router, prefix="/api/v1/policies", tags=["Policies"])
app.include_router(evidence_router, prefix="/api/v1/evidence", tags=["Evidence"])
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(audits_router, prefix="/api/v1/audits", tags=["Audit Exports"])


@app.get("/")
async def root():
    return {"message": "ComplianceCheckpoint API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}