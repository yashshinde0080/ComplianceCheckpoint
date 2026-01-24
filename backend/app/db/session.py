from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings

# Handle async driver and sslmode
from sqlalchemy.engine.url import make_url

db_url = settings.DATABASE_URL
url_obj = make_url(db_url)

# Ensure asyncpg driver
if url_obj.drivername == "postgresql":
    url_obj = url_obj.set(drivername="postgresql+asyncpg")

# Remove sslmode and channel_binding from query as asyncpg doesn't support them in options
query = dict(url_obj.query)
query.pop("sslmode", None)
query.pop("channel_binding", None)
url_obj = url_obj.set(query=query)

engine = create_async_engine(
    url_obj,
    echo=True,
    future=True
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