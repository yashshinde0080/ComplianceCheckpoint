# ComplianceCheckpoint

ComplianceCheckpoint is a comprehensive compliance management system designed to streamline regulatory adherence and operational checkpoints. This repository contains the full stack application comprising a backend API, a dashboard frontend, and a public landing page.

## Project Structure

- **Backend**: Python-based API (FastAPI) handling business logic and database interactions.
- **Frontend**: React/Vite application for the user dashboard.
- **Landing Page**: React/Vite application for the public-facing website.
- **Database**: PostgreSQL database for persistent storage.

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy/Asyncpg
- **Frontend / Landing Page**: React, TypeScript, Vite, Tailwind CSS
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

## Docker Setup

You can easily run the entire stack using Docker Compose. This ensures all services (database, backend, frontend, landing page) are set up and networked correctly without manual configuration.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ComplianceCheckpoint
   ```

2. **Start the services:**
   Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
   This command will build the images for the backend, frontend, and landing page, and start them along with the PostgreSQL database.

3. **Access the applications:**
   - **Frontend (Dashboard):** [http://localhost:3000](http://localhost:3000)
   - **Landing Page:** [http://localhost:3001](http://localhost:3001)
   - **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

4. **Stopping the services:**
   To stop the containers, press `Ctrl+C` in the terminal or run:
   ```bash
   docker-compose down
   ```

### Environment Variables

The `docker-compose.yml` file handles the environment configuration for the containers.
- **Backend**: Connects to the database via `DATABASE_URL` and ensures `FRONTEND_URL` is set.
- **Database**: Sets up the default user and database (`compliance_db`).

## License

See the [LICENSE](LICENSE) file for details.
