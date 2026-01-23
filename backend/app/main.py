from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.v1 import auth, organizations, controls, policies, evidence, tasks, audits


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

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["Organizations"])
app.include_router(controls.router, prefix="/api/v1/controls", tags=["Controls"])
app.include_router(policies.router, prefix="/api/v1/policies", tags=["Policies"])
app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["Evidence"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(audits.router, prefix="/api/v1/audits", tags=["Audit Exports"])


@app.get("/")
async def root():
    return {"message": "ComplianceCheckpoint API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}