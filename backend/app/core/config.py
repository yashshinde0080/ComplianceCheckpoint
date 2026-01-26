from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Required
    DATABASE_URL: str
    SECRET_KEY: str
    FRONTEND_URL: str = "http://localhost:5173"

    # Neon Auth
    NEON_AUTH_URL: str = ""

    # JWT Settings
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    ENVIRONMENT: str = "development"

    # REMOVED: All AWS settings - not needed

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()