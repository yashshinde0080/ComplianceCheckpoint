# Backend

## Setup

This project uses `uv` for dependency management.

Install dependencies:

```bash
uv sync
```

## Running the Server

Start the development server:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
