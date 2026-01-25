from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings
import ssl

# Handle async driver and sslmode
from sqlalchemy.engine.url import make_url

db_url = settings.DATABASE_URL
url_obj = make_url(db_url)

# Ensure asyncpg driver
if url_obj.drivername == "postgresql":
    url_obj = url_obj.set(drivername="postgresql+asyncpg")

# Handle SSL for Neon/Cloud Postgres
connect_args = {}
if url_obj.query.get("sslmode") == "require":
    # Create SSL context for Neon/Cloud Postgres
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = True
    ssl_context.verify_mode = ssl.CERT_REQUIRED
    connect_args["ssl"] = ssl_context

# Remove sslmode and channel_binding from query as asyncpg doesn't support them in options
query = dict(url_obj.query)
query.pop("sslmode", None)
query.pop("channel_binding", None)
url_obj = url_obj.set(query=query)

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
