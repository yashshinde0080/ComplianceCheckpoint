import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from app.core.config import settings
from app.db.base import Base
from app.db.models import *  # Import all models
from app.db.url import build_database_url

config = context.config

# Normalise DATABASE_URL for asyncpg + Neon. Hostname verification stays off
# for Neon's SNI-routed pooled endpoints, matching the previous behaviour.
url_obj, connect_args = build_database_url(settings.DATABASE_URL, verify_ssl=False)

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