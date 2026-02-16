---
sidebar_position: 2
---

# Backend

The backend of **Compliance Checkpoint** is built using **FastAPI**, a modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Technology Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Package Management**: [uv](https://github.com/astral-sh/uv)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

## Directory Structure

Key components of the backend:

- `app/`: Contains the main application code (routers, models, schemas).
- `alembic/`: Database migration scripts.
- `main.py`: Entry point for the application.
- `pyproject.toml` / `uv.lock`: Dependency definitions.

## Setup & detailed instructions

### Prerequisites

Ensure you have Python installed. The project uses `uv` for fast dependency management.

### Installation

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   uv sync
   ```

### Running the Server

Start the development server with live reload:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.
You can access the interactive API documentation at `http://localhost:8000/docs`.
