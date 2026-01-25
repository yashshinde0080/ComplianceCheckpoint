<div align="center">
  
# 🛡️ ComplianceCheckpoint

### Automated Compliance Readiness Platform for SMB SaaS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)

<p align="center">
  <strong>A production-grade compliance operations platform that eliminates the guesswork from SOC 2, ISO 27001, and GDPR preparation.</strong>
</p>

<p align="center">
  Built for technical founders who need audit-ready documentation without enterprise tooling overhead.
</p>

[🚀 Quick Start](#-quick-start) •
[📖 Documentation](#-documentation) •
[🎯 Features](#-features) •
[📸 Screenshots](#-screenshots) •
[🏗️ Architecture](#️-system-architecture)

</div>

---

## 📸 Screenshots

<div align="center">

### 🔐 Authentication
<img src="Images/Screenshot 2026-01-25 103853.png" alt="Login Page" width="100%"/>
<p><em>Beautiful, professional login experience with compliance messaging</em></p>

---

### 📊 Dashboard Overview
<img src="Images/Screenshot 2026-01-25 103624.png" alt="Dashboard" width="100%"/>
<p><em>Real-time compliance readiness tracking with visual progress indicators</em></p>

---

### 📋 Control Library
<img src="Images/Screenshot 2026-01-25 103702.png" alt="Control Library" width="100%"/>
<p><em>Browse and manage compliance controls by framework with priority indicators</em></p>

---

### 📄 Policy Management
<img src="Images/Screenshot 2026-01-25 103737.png" alt="Policies" width="100%"/>
<p><em>Generate and manage compliance policies with one-click template generation</em></p>

---

### 📁 Evidence Management
<img src="Images/Screenshot 2026-01-25 103752.png" alt="Evidence" width="100%"/>
<p><em>Upload, organize, and track compliance evidence with status tracking</em></p>

---

### ✅ Task Tracking
<img src="Images/Screenshot 2026-01-25 103805.png" alt="Tasks" width="100%"/>
<p><em>Create and manage compliance tasks with ownership and deadline tracking</em></p>

---

### 📦 Audit Export
<img src="Images/Screenshot 2026-01-25 103817.png" alt="Audit Export" width="100%"/>
<p><em>Generate audit-ready reports with comprehensive documentation packages</em></p>

---

### ⚙️ Settings & Configuration
<img src="Images/Screenshot 2026-01-25 103836.png" alt="Settings" width="100%"/>
<p><em>Manage organization settings and account information</em></p>

</div>

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### ✅ Core Capabilities

- 🔒 **SOC 2 Type I Readiness** - Complete Trust Services Criteria control library
- 🌐 **ISO 27001 Readiness** - Annex A controls with implementation guidance
- 📜 **GDPR Readiness** - Documentation frameworks and DPIA templates
- 📝 **Policy Generation** - Template-based, editable policy library
- 📂 **Evidence Management** - Versioned uploads with control mapping
- ✅ **Task Tracking** - Ownership, deadlines, completion tracking
- 📦 **Audit Exports** - PDF/ZIP packages ready for auditor review
- 👥 **Role-Based Access** - Founder, Admin, Contributor, Read-only Auditor

</td>
<td width="50%">

### 🚀 Technical Features

- ⚡ **Real-time Sync** - Live updates across all connected clients
- 📊 **Progress Tracking** - Visual compliance progress indicators
- 🔍 **Advanced Search** - Filter controls by framework and status
- 📈 **Analytics Dashboard** - Compliance metrics at a glance
- 🔐 **Secure Authentication** - JWT-based with Neon integration
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔄 **Automatic Backups** - Neon PostgreSQL with built-in backups
- 📝 **Activity Logging** - Full audit trail of all changes

</td>
</tr>
</table>

---

## 💡 Philosophy

<div align="center">

> **ComplianceCheckpoint is NOT a monitoring tool. It's NOT AI magic. It's NOT "one-click compliance."**
> 
> It is **compliance operations software** — structured workflows, evidence tracking, policy generation, and audit exports that pass real scrutiny.

</div>

### We Trade Automation Theater For:

| ✅ What We Do | ❌ What We Don't |
|--------------|------------------|
| Crystal-clear control requirements | Continuous infrastructure monitoring |
| Auditor-friendly evidence organization | Deep cloud provider integrations |
| Export formats that work in actual audits | Real-time security posture dashboards |
| Honest, practical guidance | Automated control testing |
| Structured compliance workflows | "One-click certification" promises |

**Our edge is clarity, structure, and execution** — not vaporware automation.

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|------------|---------|
| Node.js | 18+ |
| Python | 3.11+ |
| Docker | Latest |
| uv (Python) | Latest |

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yashshinde0080/ComplianceCheckpoint.git
cd ComplianceCheckpoint
```

#### Backend Setup

```bash
cd backend

# Create virtual environment with uv
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Navigate to `http://localhost:5173` to access the application.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ComplianceCheckpoint                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────┐                        │
│  │   Frontend (Vite + React + shadcn)  │                        │
│  │   • TypeScript strict mode          │                        │
│  │   • Role-based routing              │                        │
│  │   • TanStack Query for state        │                        │
│  │   • Real-time sync                  │                        │
│  └──────────────┬──────────────────────┘                        │
│                 │ REST / JSON                                   │
│                 ▼                                               │
│  ┌─────────────────────────────────────┐                        │
│  │   Backend (FastAPI)                 │                        │
│  │   • Async SQLAlchemy 2.0            │                        │
│  │   • Pydantic v2 validation          │                        │
│  │   • JWT auth via Neon               │                        │
│  │   • Structured logging              │                        │
│  └──────────────┬──────────────────────┘                        │
│                 │                                               │
│        ┌────────┴────────┐                                      │
│        ▼                 ▼                                      │
│  ┌───────────────┐ ┌───────────────────────┐                    │
│  │ Neon Postgres │ │ S3-Compatible Storage │                    │
│  │ • Built-in    │ │ • Evidence files      │                    │
│  │   auth        │ │ • Audit packages      │                    │
│  │ • Row-level   │ │ • Version metadata    │                    │
│  │   security    │ └───────────────────────┘                    │
│  │ • Auto backup │                                              │
│  └───────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 🎯 Design Principles

| Principle | Description |
|-----------|-------------|
| **Boring is Good** | Auditors trust conventional architecture |
| **Postgres for Everything** | No multi-database complexity |
| **Files in Object Storage** | Not in the database |
| **Stateless API** | Every request fully authenticated |
| **Explicit over Clever** | No magic, no surprises |

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

### Frontend
| Technology | Purpose |
|------------|---------|
| ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) | Fast builds, no webpack trauma |
| ![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=white) | UI with TypeScript strict mode |
| ![shadcn](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui&logoColor=white) | Radix primitives + Tailwind |
| ![TanStack](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white) | Server state management |
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) | Type-safe form validation |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white) | Schema validation |

</td>
<td>

### Backend
| Technology | Purpose |
|------------|---------|
| ![Python](https://img.shields.io/badge/Python_3.11+-3776AB?logo=python&logoColor=white) | Core runtime |
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) | Async, OpenAPI, Pydantic native |
| ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy_2.0-D71F00?logo=sqlalchemy&logoColor=white) | Async engine |
| ![Pydantic](https://img.shields.io/badge/Pydantic_v2-E92063?logo=pydantic&logoColor=white) | Validation and serialization |
| ![Alembic](https://img.shields.io/badge/Alembic-000000?logo=python&logoColor=white) | Database migrations |
| ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) | Authentication |

</td>
</tr>
</table>

### Infrastructure

| Service | Purpose |
|---------|---------|
| ![Neon](https://img.shields.io/badge/Neon_PostgreSQL-00E599?logo=postgresql&logoColor=white) | Serverless Postgres with built-in auth |
| ![S3](https://img.shields.io/badge/S3_Compatible-569A31?logo=amazons3&logoColor=white) | Evidence + export storage |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) | Local development |

---

## 📁 Project Structure

<details>
<summary><b>📂 Backend Structure</b></summary>

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── core/
│   │   ├── config.py           # Environment + settings
│   │   ├── security.py         # JWT + password utils
│   │   ├── dependencies.py     # Dependency injection
│   │   └── logging_config.py   # Structured logging
│   ├── db/
│   │   ├── base.py             # SQLAlchemy Base
│   │   ├── session.py          # Async session factory
│   │   └── models/
│   │       ├── user.py
│   │       ├── organization.py
│   │       ├── framework.py
│   │       ├── control.py
│   │       ├── policy.py
│   │       ├── evidence.py
│   │       ├── task.py
│   │       └── audit_export.py
│   ├── schemas/                # Pydantic models
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py         # Login, register, session
│   │       ├── organizations.py
│   │       ├── controls.py     # List, detail, filter
│   │       ├── policies.py     # Generate, edit, approve
│   │       ├── evidence.py     # Upload, version, status
│   │       ├── tasks.py        # CRUD + assignment
│   │       └── audits.py       # Export generation
│   ├── services/
│   │   ├── policy_generator.py
│   │   ├── audit_exporter.py
│   │   └── evidence_validator.py
│   └── utils/
├── alembic/                    # Migration files
├── tests/
├── requirements.txt
└── Dockerfile
```

</details>

<details>
<summary><b>📂 Frontend Structure</b></summary>

```
frontend/
├── src/
│   ├── app/
│   │   ├── routes.tsx          # React Router config
│   │   └── providers.tsx       # QueryClient, AuthContext
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── tables/
│   │   │   ├── ControlsTable.tsx
│   │   │   ├── EvidenceTable.tsx
│   │   │   └── TasksTable.tsx
│   │   └── forms/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── controls/
│   │   ├── policies/
│   │   ├── evidence/
│   │   ├── tasks/
│   │   └── audit/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts              # Axios instance
│   │   ├── auth.ts             # Token management
│   │   └── logger.ts           # Frontend logging
│   └── styles/
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

</details>

---

## 🔌 API Endpoints

<details>
<summary><b>🔐 Authentication</b></summary>

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
```

</details>

<details>
<summary><b>📋 Controls</b></summary>

```http
GET    /api/v1/controls?framework=soc2
GET    /api/v1/controls/{id}
GET    /api/v1/controls/{id}/evidence
GET    /api/v1/controls/{id}/tasks
```

</details>

<details>
<summary><b>📄 Policies</b></summary>

```http
GET    /api/v1/policies
POST   /api/v1/policies/generate
GET    /api/v1/policies/{id}
PUT    /api/v1/policies/{id}
PUT    /api/v1/policies/{id}/approve
DELETE /api/v1/policies/{id}
```

</details>

<details>
<summary><b>📁 Evidence</b></summary>

```http
POST   /api/v1/evidence/upload
GET    /api/v1/evidence/control/{control_id}
GET    /api/v1/evidence/{id}
PUT    /api/v1/evidence/{id}/status
DELETE /api/v1/evidence/{id}
```

</details>

<details>
<summary><b>✅ Tasks</b></summary>

```http
GET    /api/v1/tasks?status=pending
POST   /api/v1/tasks
GET    /api/v1/tasks/{id}
PUT    /api/v1/tasks/{id}
DELETE /api/v1/tasks/{id}
```

</details>

<details>
<summary><b>📦 Audit Exports</b></summary>

```http
POST   /api/v1/audit/export
GET    /api/v1/audit/export/{id}
GET    /api/v1/audit/export/{id}/download
```

</details>

---

## 📖 Documentation

### 📋 Domain Model

<details>
<summary><b>View Core Entities</b></summary>

#### Organization
```python
id: UUID
name: str
industry: str
employee_count: int
compliance_targets: list[str]  # ["SOC2", "ISO27001", "GDPR"]
created_at: datetime
```

#### User
```python
id: UUID
org_id: UUID
name: str
email: str
role: enum  # Founder, Admin, Contributor, Auditor
created_at: datetime
```

#### Framework
```python
id: UUID
name: str  # "SOC 2", "ISO 27001", "GDPR"
version: str
description: str
```

#### Control
```python
id: UUID
framework_id: UUID
control_code: str  # "CC6.1", "A.8.2"
title: str
description: str
category: str
severity: enum  # Critical, High, Medium, Low
guidance_text: str  # Markdown implementation guidance
```

#### Policy
```python
id: UUID
org_id: UUID
framework_id: UUID
title: str
content: str  # Markdown
status: enum  # Draft, Approved
last_updated: datetime
approved_by: UUID | null
```

#### Evidence
```python
id: UUID
control_id: UUID
org_id: UUID
file_url: str
file_hash: str  # SHA-256
uploaded_by: UUID
uploaded_at: datetime
version: int
status: enum  # Pending, Accepted, Rejected
notes: str | null
```

</details>

---

## 🔒 Critical Product Rules

### 📂 Evidence Requirements
- ✅ Every control **must** specify accepted evidence types
- ✅ Guidance **must** explain *why* evidence proves the control
- ✅ Examples **must** be concrete (not "documentation")

### 📝 Policy Generation
- ✅ Templates **must** be editable after generation
- ✅ No locked-in content — founders need customization
- ✅ Generated policies **must** include placeholder sections

### 📦 Audit Export Format
- ✅ Cover page with org details
- ✅ Control-by-control breakdown
- ✅ Policy attachments
- ✅ Evidence file index with hashes
- ✅ Generation timestamp + auditor access instructions
- ✅ Readable without proprietary software
- ✅ Must survive email + print

### 👥 Access Control
| Role | Permissions |
|------|-------------|
| **Auditor** | Read-only access to everything |
| **Contributor** | Upload evidence, cannot approve policies |
| **Admin** | Approve policies, assign tasks |
| **Founder** | Full access, can delete data (with confirmation) |

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest                          # All tests
pytest tests/test_auth.py       # Specific module
pytest --cov=app --cov-report=html
```

### Frontend
```bash
cd frontend
npm run test                    # Vitest unit tests
npm run test:ui                 # Vitest UI mode
```

---

## 🚀 Deployment

### Backend (Render/Railway/Fly.io)
1. Connect GitHub repo
2. Set environment variables:
   - `DATABASE_URL` (Neon connection string)
   - `SECRET_KEY`
   - `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify/Cloudflare Pages)
1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_URL` (production backend URL)

---

## ⚠️ What This Is Not

<div align="center">

| ❌ NOT | Explanation |
|--------|-------------|
| Security monitoring tool | No agent, no integrations |
| GRC platform | No risk registers, no vendor management |
| Automated compliance | No "one-click SOC 2" |
| Legal advice | We're documentation infrastructure |

</div>

**We are workflow software for compliance preparation. Boring, structured, judge-proof.**

---

## 🤝 Contributing

We don't accept PRs for control content without citations. If you're adding framework controls:

1. **Cite the source** (AICPA, ISO, GDPR articles)
2. **Write guidance in your own words** (no copy-paste)
3. **Include evidence examples** (specific file types, not "documentation")
4. **Test with a real auditor** if possible

For code contributions:
- Follow existing patterns (boring is good)
- Write tests for new endpoints
- Update OpenAPI docs
- No clever abstractions without justification

---

## 📄 License

<div align="center">

**MIT License**

We're infrastructure, not legal advice.

</div>

---

## 📬 Contact

| Channel | Purpose |
|---------|---------|
| 📋 [GitHub Issues](https://github.com/yashshinde0080/ComplianceCheckpoint/issues) | For bugs, not compliance questions |
| 💬 [GitHub Discussions](https://github.com/yashshinde0080/ComplianceCheckpoint/discussions) | For product feedback |
| 📧 [syash0080@gmail.com](mailto:syash0080@gmail.com) | For partnerships, not support |

---

<div align="center">

## 💜 Acknowledgments

This exists because compliance tooling sucks. We're trying to fix that by being:

**Honest** about what we do (and don't do) • **Boring** in architecture • **Ruthless** about quality • **Helpful** without handholding

---

**If you're building this, you're probably technical, frustrated with existing tools, and willing to do hard research work. Good. That's who this is for.**

<br/>

Made with ❤️ for technical founders tired of compliance theater

[![Star this repo](https://img.shields.io/github/stars/yashshinde0080/ComplianceCheckpoint?style=social)](https://github.com/yashshinde0080/ComplianceCheckpoint)

</div>
