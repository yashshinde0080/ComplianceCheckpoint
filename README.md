# ComplianceCheckpoint

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=flat&logo=postgresql&logoColor=white)

**ComplianceCheckpoint** is a modern, enterprise-grade compliance management system designed to streamline regulatory adherence, operational checkpoints, and audit readiness. It unifies policy management, evidence collection, and automated controls into a single, intuitive dashboard.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Docker Setup (Recommended)](#docker-setup-recommended)
  - [Manual Installation](#manual-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- **📊 Interactive Dashboard**: Real-time overview of compliance status, recent activities, and critical alerts.
- **🔐 Secure Authentication**: Robust user management with secure login/signup flows.
- **📜 Policy Management**: create, update, and track organizational policies.
- **✅ Automated Controls**: Define and monitor compliance controls with automated checks.
- **📂 Evidence Collection**: Upload and manage evidence files linked to specific controls.
- **📝 Audit Logs**: Comprehensive audit trails for all system activities.
- **🌐 Public Landing Page**: specific landing page for marketing and public information.
- **🐳 Dockerized**: Fully containerized environment for easy deployment.

---

## 🛠 Tech Stack

### Frontend & Landing Page
- **Framework**: [React](https://reactjs.org/) (v18) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive and utility-first design.
- **State Management**: React Hooks & Context API.
- **HTTP Client**: Axios (or native fetch) with strictly connected API integration.

### Backend API
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High performance, easy to learn, fast to code, ready for production.
- **Database ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (Async) for database interactions.
- **Migration**: [Alembic](https://alembic.sqlalchemy.org/) for database schema migrations.
- **Validation**: [Pydantic](https://docs.pydantic.dev/) for data validation and settings management.

### Database & DevOps
- **Database**: [PostgreSQL](https://www.postgresql.org/) (v15-alpine)
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose.
- **Reverse Proxy**: Nginx (optional/configurable in production).

---

## 🏗 Architecture

The project follows a modern microservices-inspired monolithic architecture:

- **`backend/`**: Contains the FastAPI application, database models, schemas, and API routers.
- **`frontend/`**: The main React application for the Dashboard (App App).
- **`landing_page/`**: A separate React application for the public facing marketing site.
- **`docker-compose.yml`**: Orchestrates the services (DB, Backend, Frontend, Landing Page).

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop) & Docker Compose
- [Node.js](https://nodejs.org/) (for manual frontend runs)
- [Python 3.10+](https://www.python.org/) (for manual backend runs)

### Docker Setup (Recommended)

The easiest way to get the application running is using Docker Compose.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Start-Up-Republic/ComplianceCheckpoint.git
   cd ComplianceCheckpoint
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```
   *This command builds the images and spins up the containers for Postgres, Backend, Frontend, and Landing Page.*

3. **Access the Services**
   - **User Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **Public Landing Page**: [http://localhost:3001](http://localhost:3001)
   - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Manual Installation

If you prefer running services individually without Docker:

#### 1. Backend
```bash
cd backend
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run Server
uvicorn app.main:app --reload
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

#### 3. Landing Page
```bash
cd landing_page
npm install
npm run dev
```

*Note: For manual setup, ensure you have a running PostgreSQL instance and update the `.env` files accordingly.*

---

## 📂 Project Structure

```bash
ComplianceCheckpoint/
├── backend/                # FastAPI Backend
│   ├── app/                # Application logic (api, core, db, schemas)
│   ├── alembic/            # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # Dashboard React App
│   ├── src/                # Components, Pages, Hooks
│   ├── Dockerfile
│   └── package.json
├── landing_page/           # Marketing React App
│   ├── src/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml      # Container orchestration
```

---

## 📖 API Documentation

Once the backend is running, you can access the interactive API documentation (Swagger UI) at:
[http://localhost:8000/docs](http://localhost:8000/docs)

This provides a complete interface to test all API endpoints directly from your browser.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
