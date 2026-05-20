# Task Forge

Task Forge is a full-stack task management platform inspired by **Trello**. It brings a familiar card-based workflow—create tasks, organize work, and collaborate with your team—while adding structured tracking, reporting, and a dedicated dashboard beyond a simple board view.

### Important features

- **Task management** — Create, edit, and filter tasks by status (Pending, In Progress, Completed) and priority (Low, Medium, High), with due dates, descriptions, and file attachments
- **Subtasks** — Break work into checklists with completion progress on each task card
- **Team collaboration** — Assign members to tasks, manage a team roster, and invite new members via shareable links
- **Dashboard** — Greeting with live counts, status distribution and priority charts, plus a recent-tasks table
- **Reports** — Download filtered task lists and team member summaries as Excel files
- **Authentication** — Email/password sign-up and Google OAuth, with role-aware views for task owners vs assigned members
- **API & docs** — REST backend with Swagger documentation and shared Zod schemas for end-to-end type safety

This repository is a **pnpm monorepo** managed with **Turborepo**, containing a shared TypeScript package, a Fastify API, and a Next.js web app.

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 15, React 18, TanStack Query, Zustand, shadcn/ui, Tailwind CSS |
| Backend  | Fastify 5, TypeORM, PostgreSQL, Zod |
| Shared   | TypeScript, Zod schemas and types used by both apps |
| Tooling  | pnpm workspaces, Turbo, ESLint, Prettier |

## Repository structure

```
task-forge/
├── apps/
│   ├── backend/          # REST API (@task-forge/backend)
│   └── frontend/         # Web app (@task-forge/frontend)
├── packages/
│   └── shared/           # Shared types, schemas, env, constants
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Prerequisites

- **Node.js** 22.x
- **pnpm** 9.x (`corepack enable` recommended)
- **PostgreSQL** for the backend database

## Getting started

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure environment

Copy example env files and fill in values:

```bash
cp apps/backend/.env.example apps/backend/.env.development
cp apps/frontend/.env.example apps/frontend/.env.development
```

See [apps/backend/README.md](./apps/backend/README.md) and [apps/frontend/README.md](./apps/frontend/README.md) for variable details.

### 3. Run database migrations

```bash
cd apps/backend
pnpm build
pnpm mig:run
```

### 4. Start development servers

From the repository root:

```bash
pnpm dev
```

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/documentation (when enabled)

## Root scripts

| Script       | Description                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Start all apps in development mode   |
| `pnpm build` | Build all packages and applications  |
| `pnpm lint`  | Lint all workspace packages          |

## Package documentation

- [packages/shared](./packages/shared/README.md) — shared contracts and validation
- [apps/backend](./apps/backend/README.md) — API server, database, Docker
- [apps/frontend](./apps/frontend/README.md) — web UI and client architecture

## Docker (backend)

Build the API image from the **repository root**:

```bash
docker build -f apps/backend/Dockerfile -t task-forge-backend .
```

Run with required environment variables (database, JWT, Google OAuth, etc.).

## License

Private project — all rights reserved unless otherwise specified.
