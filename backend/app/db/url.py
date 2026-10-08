"""Normalise the configured database URL before handing it to SQLAlchemy.

Connection strings arrive from deployment platforms in a handful of shapes and
``make_url()`` is strict about all of them: an empty value, a template
placeholder, a quoted value, a pasted ``DATABASE_URL=...`` line, or a legacy
``postgres://`` scheme all raise
``ArgumentError: Could not parse SQLAlchemy URL from given URL string``.

Because the URL is parsed while ``app.main`` is being imported, that error
turns *every* request (including ``/`` and ``/health``) into a 500 with no
hint about the cause.  Normalising and validating in one place keeps the
behaviour consistent and produces an actionable message instead.
"""

from __future__ import annotations

import ssl

from sqlalchemy.engine.url import URL, make_url
from sqlalchemy.exc import ArgumentError

# SQLAlchemy 2.x no longer recognises the legacy ``postgres://`` scheme.
_LEGACY_SCHEMES = {"postgres": "postgresql"}

# libpq query parameters that asyncpg rejects when left in the URL.
_UNSUPPORTED_QUERY_PARAMS = ("sslmode", "channel_binding")

_EXPECTED_SHAPE = "postgresql://user:password@host:5432/dbname"


def _normalise(raw: str) -> str:
    """Trim whitespace/quotes and a pasted ``NAME=`` prefix from a URL value."""
    value = raw.strip().strip("\"'").strip()
    name, sep, rest = value.partition("=")
    if sep and "://" not in name:
        value = rest.strip().strip("\"'").strip()
    return value


def build_database_url(
    raw: str, *, verify_ssl: bool = True
) -> tuple[URL, dict]:
    """Return an asyncpg-ready SQLAlchemy URL and matching ``connect_args``.

    ``raw`` is the value of ``DATABASE_URL`` as configured.  Raises
    ``RuntimeError`` with an actionable message when it is missing or cannot
    be parsed, so the failure points at the environment variable rather than
    at SQLAlchemy internals.
    """
    value = _normalise(raw)
    if not value:
        raise RuntimeError(
            "DATABASE_URL is empty. Set it to a connection string such as "
            f"'{_EXPECTED_SHAPE}'."
        )

    scheme, sep, remainder = value.partition("://")
    if not sep or not scheme:
        raise RuntimeError(
            f"DATABASE_URL is not a connection URL (starts with {value[:20]!r}). "
            f"Expected a value such as '{_EXPECTED_SHAPE}'."
        )

    scheme = _LEGACY_SCHEMES.get(scheme.lower(), scheme)
    try:
        url = make_url(f"{scheme}://{remainder}")
    except ArgumentError as exc:
        raise RuntimeError(
            f"DATABASE_URL could not be parsed as a connection URL: {exc}"
        ) from exc

    # Make sure the async driver is used even if the URL only said "postgresql".
    if url.get_backend_name() == "postgresql" and "asyncpg" not in (
        url.drivername or ""
    ):
        url = url.set(drivername="postgresql+asyncpg")

    connect_args: dict = {}
    if url.query.get("sslmode") == "require":
        context = ssl.create_default_context()
        if verify_ssl:
            context.check_hostname = True
            context.verify_mode = ssl.CERT_REQUIRED
        else:
            # Neon's pooled endpoints are reached by SNI routing, so hostname
            # verification is disabled there (matches the previous behaviour).
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = context

    # asyncpg takes SSL via connect_args, so drop the libpq-only params.
    query = dict(url.query)
    for param in _UNSUPPORTED_QUERY_PARAMS:
        query.pop(param, None)
    url = url.set(query=query)

    return url, connect_args
