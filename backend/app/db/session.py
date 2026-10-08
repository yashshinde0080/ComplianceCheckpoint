from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.config import settings
from app.db.url import build_database_url

# Normalise the configured connection string (stray whitespace/quotes, a pasted
# "DATABASE_URL=" prefix, the legacy "postgres://" scheme, ...) and translate
# libpq's sslmode for asyncpg.
url_obj, connect_args = build_database_url(settings.DATABASE_URL)

engine = create_async_engine(
    url_obj,
    echo=True,
    future=True,
    connect_args=connect_args
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
