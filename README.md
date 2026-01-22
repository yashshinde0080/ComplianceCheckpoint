# ComplianceCheckpoint

**Automated Compliance Readiness Platform for SMB SaaS**

A production-grade compliance operations platform that eliminates the guesswork from SOC 2, ISO 27001, and GDPR preparation. Built for technical founders who need audit-ready documentation without enterprise tooling overhead.

---

## Philosophy

ComplianceCheckpoint is **not** a monitoring tool. It's **not** AI magic. It's **not** "one-click compliance."

It is **compliance operations software** — structured workflows, evidence tracking, policy generation, and audit exports that pass real scrutiny.

We trade automation theater for:
- Crystal-clear control requirements
- Auditor-friendly evidence organization
- Export formats that work in actual audits
- No bullshit

---

## What We Build (v1 Scope)

### In Scope
- **SOC 2 Type I readiness**: Complete Trust Services Criteria control library
- **ISO 27001 readiness**: Annex A controls with implementation guidance
- **GDPR readiness**: Documentation frameworks and DPIA templates (not legal advice)
- **Policy generation**: Template-based, editable policy library
- **Evidence management**: Versioned uploads with control mapping
- **Task tracking**: Ownership, deadlines, completion tracking
- **Audit exports**: PDF/ZIP packages ready for auditor review
- **Role-based access**: Founder, Admin, Contributor, Read-only Auditor

### Explicitly Out of Scope (v1)
- Continuous infrastructure monitoring
- Deep cloud provider integrations (AWS/GCP/Azure)
- Real-time security posture dashboards
- Automated control testing
- Compliance certification (we prepare, you certify)

**Our edge is clarity, structure, and execution** — not vaporware automation.

---

## System Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Vite + React + shadcn)          │
│  - TypeScript strict mode                  │
│  - Role-based routing                      │
│  - React Query for state                   │
└──────────────┬──────────────────────┘
                  │ REST / JSON
                  ▼
┌─────────────────────────────────────┐
│  Backend (FastAPI)                         │
│  - Async SQLAlchemy 2.0                    │
│  - Pydantic v2 validation                  │
│  - JWT auth via Neon                       │
└──────────────┬──────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Neon PostgreSQL                           │
│  - Built-in auth                           │
│  - Row-level security                      │
│  - Automated backups                       │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Object Storage (S3-compatible)            │
│  - Evidence file storage                   │
│  - Audit export packages                   │
│  - Version metadata in DB                  │
└─────────────────────────────────────┘
```

### Design Principles
1. **Boring is good**: Auditors trust conventional architecture
2. **Postgres for everything**: No multi-database complexity
3. **Files in object storage**: Not in the database
4. **Stateless API**: Every request fully authenticated
5. **Explicit over clever**: No magic, no surprises

---

## Tech Stack

### Frontend
- **Vite** — Fast builds, no webpack trauma
- **React 18** with TypeScript strict mode
- **shadcn/ui** — Radix primitives + Tailwind
- **TanStack Query** (React Query) — Server state management
- **React Hook Form + Zod** — Type-safe form validation
- **Recharts** — Minimal progress visualization
- **React Router 6** — Role-based route protection

### Backend
- **Python 3.11+**
- **FastAPI** — Async, OpenAPI, Pydantic native
- **SQLAlchemy 2.0** (async engine)
- **Pydantic v2** — Validation and serialization
- **Alembic** — Database migrations
- **python-jose** — JWT handling
- **Passlib + bcrypt** — Password hashing
- **boto3** — S3-compatible storage client

### Infrastructure
- **Neon PostgreSQL** — Serverless Postgres with built-in auth
- **Backblaze B2 / AWS S3** — Evidence + export storage
- **Render / Railway / Fly.io** — Backend deployment
- **Vercel / Netlify / Cloudflare Pages** — Frontend deployment

### Development
- **Docker Compose** — Local Postgres + MinIO for development
- **pytest + httpx** — Backend testing
- **Vitest + Testing Library** — Frontend testing
- **pre-commit hooks** — Linting, formatting, type checking

---

## Domain Model

### Core Entities

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

#### Task
```python
id: UUID
control_id: UUID
org_id: UUID
owner_id: UUID
title: str
due_date: date
status: enum  # Open, InProgress, Blocked, Complete
notes: str | null
created_at: datetime
```

#### AuditExport
```python
id: UUID
org_id: UUID
framework_id: UUID
generated_at: datetime
download_url: str
expires_at: datetime
generated_by: UUID
```

### Why This Model

- **Organization isolation**: Every query filters by org_id
- **Framework flexibility**: Add HIPAA, PCI-DSS without schema changes
- **Evidence versioning**: Immutable uploads, metadata tracks changes
- **Task ownership**: Clear accountability, no diffusion
- **Audit trail**: Every export is logged and retrievable

This is **deliberately boring**. Auditors like boring.

---

## Project Structure

### Backend (`/backend`)
```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── core/
│   │   ├── config.py           # Environment + settings
│   │   ├── security.py         # JWT + password utils
│   │   └── dependencies.py     # Dependency injection
│   ├── db/
│   │   ├── base.py             # SQLAlchemy Base
│   │   ├── session.py          # Async session factory
│   │   └── models/
│   │       ├── __init__.py
│   │       ├── user.py
│   │       ├── organization.py
│   │       ├── framework.py
│   │       ├── control.py
│   │       ├── policy.py
│   │       ├── evidence.py
│   │       ├── task.py
│   │       └── audit_export.py
│   ├── schemas/                # Pydantic models
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── control.py
│   │   ├── policy.py
│   │   ├── evidence.py
│   │   └── task.py
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py         # Login, register, session
│   │       ├── organizations.py
│   │       ├── controls.py     # List, detail, filter by framework
│   │       ├── policies.py     # Generate, edit, approve
│   │       ├── evidence.py     # Upload, version, status
│   │       ├── tasks.py        # CRUD + assignment
│   │       └── audits.py       # Export generation
│   ├── services/
│   │   ├── policy_generator.py # Template-based policy creation
│   │   ├── audit_exporter.py   # PDF/ZIP package creation
│   │   └── evidence_validator.py # File hash, type checking
│   └── utils/
│       ├── markdown.py         # Markdown → HTML/PDF
│       └── file_hash.py        # SHA-256 hashing
├── alembic/
│   ├── versions/               # Migration files
│   └── env.py
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_controls.py
│   └── test_evidence.py
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Frontend (`/frontend`)
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
│   │       ├── PolicyForm.tsx
│   │       ├── EvidenceUpload.tsx
│   │       └── TaskForm.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── controls/
│   │   │   ├── ControlsList.tsx
│   │   │   └── ControlDetail.tsx
│   │   ├── policies/
│   │   │   ├── PoliciesList.tsx
│   │   │   └── PolicyEditor.tsx
│   │   ├── evidence/
│   │   │   └── EvidenceManager.tsx
│   │   ├── tasks/
│   │   │   └── TaskBoard.tsx
│   │   └── audit/
│   │       └── AuditExport.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useControls.ts
│   │   ├── usePolicies.ts
│   │   └── useEvidence.ts
│   ├── lib/
│   │   ├── api.ts              # Axios instance + interceptors
│   │   ├── auth.ts             # Token management
│   │   └── validators.ts       # Zod schemas
│   ├── styles/
│   │   └── globals.css
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## API Design

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
```

### Controls
```
GET    /api/v1/controls?framework=soc2
GET    /api/v1/controls/{id}
GET    /api/v1/controls/{id}/evidence
GET    /api/v1/controls/{id}/tasks
```

### Policies
```
GET    /api/v1/policies
POST   /api/v1/policies/generate        # Body: {framework_id, template_type}
GET    /api/v1/policies/{id}
PUT    /api/v1/policies/{id}
PUT    /api/v1/policies/{id}/approve
DELETE /api/v1/policies/{id}
```

### Evidence
```
POST   /api/v1/evidence/upload           # Multipart form
GET    /api/v1/evidence/control/{control_id}
GET    /api/v1/evidence/{id}
PUT    /api/v1/evidence/{id}/status      # Body: {status, notes}
DELETE /api/v1/evidence/{id}
```

### Tasks
```
GET    /api/v1/tasks?status=pending
POST   /api/v1/tasks
GET    /api/v1/tasks/{id}
PUT    /api/v1/tasks/{id}
DELETE /api/v1/tasks/{id}
```

### Audit Exports
```
POST   /api/v1/audit/export              # Body: {framework_id}
GET    /api/v1/audit/export/{id}
GET    /api/v1/audit/export/{id}/download
```

---

## Critical Product Rules

### Evidence Requirements
1. Every control **must** specify accepted evidence types
2. Guidance **must** explain *why* evidence proves the control
3. Examples **must** be concrete (not "documentation")

### Policy Generation
1. Templates **must** be editable after generation
2. No locked-in content — founders need customization
3. Generated policies **must** include placeholder sections for org-specific details

### Audit Export Format
1. **Must** include:
   - Cover page with org details
   - Control-by-control breakdown
   - Policy attachments
   - Evidence file index with hashes
   - Generation timestamp + auditor access instructions
2. **Must** be readable without proprietary software
3. **Must** survive email + print

### Access Control
1. Auditors get **read-only access** to everything
2. Contributors can upload evidence, cannot approve policies
3. Admins can approve policies, assign tasks
4. Founders can delete data (with confirmation)

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker + Docker Compose (for local dev)
- Neon account (or local Postgres)
- S3-compatible storage credentials

### Local Development

#### 1. Clone and Install
```bash
git clone https://github.com/your-org/compliancecheckpoint.git
cd compliancecheckpoint

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt

# Frontend
cd ../frontend
npm install
```

#### 2. Environment Setup

**Backend** (`backend/.env`):
```bash
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/compliance
SECRET_KEY=your-secret-key-generate-with-openssl-rand-hex-32
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=compliance-evidence
```

**Frontend** (`frontend/.env`):
```bash
VITE_API_URL=http://localhost:8000
```

#### 3. Start Local Services
```bash
# Start Postgres + MinIO
docker-compose up -d

# Run migrations
cd backend
alembic upgrade head

# Seed initial data (frameworks + controls)
python scripts/seed_frameworks.py
```

#### 4. Run Development Servers
```bash
# Backend (from /backend)
uvicorn app.main:app --reload --port 8000

# Frontend (from /frontend, separate terminal)
npm run dev
```

Navigate to `http://localhost:5173`

---

## Deployment

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

### Database Migrations
```bash
# Generate migration after model changes
alembic revision --autogenerate -m "description"

# Apply in production
alembic upgrade head
```

---

## Testing

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

## What to Build First (Execution Order)

### Phase 1: Foundation (Week 1-2)
1. **Control library** (SOC 2 Trust Services Criteria)
   - Research AICPA TSC official documentation
   - Write guidance for each control (not copy-paste)
   - Categorize by domain (CC, A, PI, etc.)
2. **Database models + migrations**
3. **Auth flow** (register, login, session)

### Phase 2: Core Workflow (Week 3-4)
4. **Policy generator** (5-7 base templates)
   - Information Security Policy
   - Access Control Policy
   - Incident Response Policy
   - Data Classification Policy
   - Acceptable Use Policy
5. **Evidence upload + storage**
6. **Task assignment + tracking**

### Phase 3: Audit Readiness (Week 5-6)
7. **Audit export** (PDF package generation)
8. **Read-only auditor access**
9. **Control completion dashboard**

### Phase 4: Polish (Week 7-8)
10. ISO 27001 Annex A controls
11. GDPR documentation templates
12. Email notifications (task reminders, evidence approvals)

**Everything else is decoration.**

---

## Hard Truths

### This project lives or dies on **content quality**
- Poorly written control guidance = instant credibility death
- Founders will know if you Ctrl+C'd from Wikipedia
- Auditors will tear apart vague language

### SMB founders want **clarity**, not dashboards
- They don't need "compliance score" gamification
- They need: "Here's what to do next"
- Show progress, not vanity metrics

### The judge test
> "Can I export this and give it to an auditor right now?"

If the answer isn't **"yes, immediately, with zero additional work"**, you lose.

---

## What This Is Not

- **Not** a security monitoring tool (no agent, no integrations)
- **Not** a GRC platform (no risk registers, no vendor management)
- **Not** automated compliance (no "one-click SOC 2")
- **Not** legal advice (we're documentation infrastructure)

We are **workflow software for compliance preparation**. Boring, structured, judge-proof.

---

## Why This Might Fail (And How to Prevent It)

| Risk | Mitigation |
|------|------------|
| Control library is shallow/wrong | Hire a compliance consultant to review before v1 launch |
| Audit exports aren't accepted | Test with 3 real auditors before claiming "audit-ready" |
| No one needs this | 100 founder interviews before writing code |
| Vanta/Drata kill you | Focus on **prep**, not continuous monitoring (different market) |
| You run out of money | Charge $200/mo from day 1, no freemium delusions |

---

## Contributing

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

## License

MIT License — we're infrastructure, not legal advice.

---

## Contact

- **Issues**: GitHub Issues (for bugs, not compliance questions)
- **Discussions**: GitHub Discussions (for product feedback)
- **Email**: founders@compliancecheckpoint.dev (for partnerships, not support)

---

## Acknowledgments

This exists because compliance tooling sucks. We're trying to fix that by being:
- Honest about what we do (and don't do)
- Boring in architecture
- Ruthless about quality
- Helpful without handholding

If you're building this, you're probably technical, frustrated with existing tools, and willing to do hard research work. Good. That's who this is for.

**No pep talk. Just execution.**