---
sidebar_position: 5
---

# Deployment

**Compliance Checkpoint** is designed to be deployed using Docker, ensuring consistency across environments.

## Docker Setup

The project includes `Dockerfile` configurations for each service (Frontend, Backend, Landing Page) and likely a `docker-compose.yml` to orchestrate them.

### Services

- **Backend Container**: Python/FastAPI application.
- **Frontend Container**: Nginx serving the React build.
- **Landing Page Container**: Nginx serving the Landing Page build.

## Building and Running

To build and start all services:

```bash
docker-compose up --build -d
```

This command will:
1. Build the images for all services.
2. Start the containers in detached mode.

## Environment Variables

Ensure you have configured your `.env` files correctly for:
- Database connections (Supabase/PostgreSQL)
- API URLs (Frontend pointing to Backend)
- Secret keys

## Production Considerations

- Use a reverse proxy (like Nginx or Traefik) in front of the containers for SSL termination.
- Ensure strict CORS policies are in place.
- Use production-ready WSGI/ASGI servers (like Gunicorn/Uvicorn with workers) for the backend.
