import asyncio
from logging.config import fileConfig
import ssl
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy.engine.url import make_url

from alembic import context

from app.core.config import settings
from app.db.base import Base
from app.db.models import *  # Import all models

config = context.config

# Process the DATABASE_URL to ensure it works with asyncpg and Neon
db_url = settings.DATABASE_URL
print(f"DEBUG: Raw settings.DATABASE_URL: {db_url}")

url_obj = make_url(db_url)

# Ensure asyncpg driver
if url_obj.drivername == "postgresql":
    url_obj = url_obj.set(drivername="postgresql+asyncpg")

# Handle SSL for Neon/Cloud Postgres
connect_args = {}
ssl_mode = url_obj.query.get("sslmode")
print(f"DEBUG: Found sslmode={ssl_mode}")

if ssl_mode == "require":
    print("DEBUG: Configuring SSL context...")
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ssl_context

# Remove sslmode and channel_binding from query as asyncpg doesn't support them in options
query = dict(url_obj.query)
query.pop("sslmode", None)
query.pop("channel_binding", None)
url_obj = url_obj.set(query=query)

# IMPORTANT: render_as_string(hide_password=False) is crucial because str(url_obj) masks the password 
# in newer SQLAlchemy versions, causing auth failure.
final_url = url_obj.render_as_string(hide_password=False)
config.set_main_option("sqlalchemy.url", final_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args  # Pass SSL context here
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()