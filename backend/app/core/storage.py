"""Filesystem locations that are safe to write to at import time.

Serverless platforms (Vercel, AWS Lambda) mount the deployment directory
read-only.  The previous module-level ``os.makedirs("uploads/evidence")`` and
``os.makedirs("exports")`` therefore raised
``OSError: [Errno 30] Read-only file system`` while ``app.main`` was being
imported, which produced a 500 (FUNCTION_INVOCATION_FAILED) for *every*
request.  Only ``/tmp`` is writable there, and it is **not** persistent between
invocations.

``writable_dir`` returns a path that is safe to create, choosing ``/tmp`` on
serverless and the project-relative default everywhere else.  Override the
location with the given environment variable (e.g. ``UPLOAD_DIR``).
"""

from __future__ import annotations

import os
from pathlib import Path


def _on_serverless() -> bool:
    return bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))


def writable_dir(env_var: str, default: str) -> str:
    """Return a writable directory, creating it if needed.

    ``env_var`` overrides the location.  Otherwise ``/tmp/<default>`` is used
    on serverless platforms and ``<default>`` locally.
    """
    base = os.getenv(env_var) or (
        f"/tmp/{default}" if _on_serverless() else default
    )
    Path(base).mkdir(parents=True, exist_ok=True)
    return base
