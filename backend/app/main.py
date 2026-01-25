from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging_config import setup_logging, get_logger, log_startup, log_shutdown, log_database
from app.db.session import engine
from app.db.base import Base
from app.middleware.logging_middleware import LoggingMiddleware
from app.api.v1.auth import router as auth_router
from app.api.v1.organizations import router as organizations_router
from app.api.v1.controls import router as controls_router
from app.api.v1.policies import router as policies_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.audits import router as audits_router

# Setup logging
setup_logging(level="INFO", log_file="app.log")
logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    log_startup(logger, "🚀 ComplianceCheckpoint API starting up...")
    log_startup(logger, f"📍 Environment: {settings.ENVIRONMENT if hasattr(settings, 'ENVIRONMENT') else 'development'}")
    
    try:
        async with engine.begin() as conn:
            log_database(logger, "🗄️ Connecting to database...")
            await conn.run_sync(Base.metadata.create_all)
            log_database(logger, "✅ Database tables created/verified successfully")
        
        log_startup(logger, "✅ Application startup complete!")
        log_startup(logger, f"🌐 API Documentation: http://localhost:8000/docs")
        log_startup(logger, f"🔗 Frontend URL: {settings.FRONTEND_URL}")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {str(e)}", exc_info=True)
        raise
    
    yield
    
    # Shutdown
    log_shutdown(logger, "🛑 Application shutting down...")
    await engine.dispose()
    log_shutdown(logger, "✅ Database connections closed")
    log_shutdown(logger, "👋 Goodbye!")


app = FastAPI(
    title="ComplianceCheckpoint API",
    description="Automated Compliance Readiness Platform for SMB SaaS",
    version="1.0.0",
    lifespan=lifespan
)

# Add logging middleware (must be added before CORS)
app.add_middleware(LoggingMiddleware)

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
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(organizations_router, prefix="/api/v1/organizations", tags=["Organizations"])
app.include_router(controls_router, prefix="/api/v1/controls", tags=["Controls"])
app.include_router(policies_router, prefix="/api/v1/policies", tags=["Policies"])
app.include_router(evidence_router, prefix="/api/v1/evidence", tags=["Evidence"])
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(audits_router, prefix="/api/v1/audits", tags=["Audit Exports"])

logger.info("📋 Registered API routes:", extra={"routes": [
    "/api/v1/auth",
    "/api/v1/organizations",
    "/api/v1/controls",
    "/api/v1/policies",
    "/api/v1/evidence",
    "/api/v1/tasks",
    "/api/v1/audits",
]})


@app.get("/")
async def root():
    logger.debug("Root endpoint accessed")
    return {"message": "ComplianceCheckpoint API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ComplianceCheckpoint API"}