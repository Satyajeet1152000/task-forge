# Task Forge

Task Forge is a full-stack task management application inspired by Trello. Teams can create and organize tasks, assign members, track status and priority, manage subtasks, invite collaborators, and view analytics from a modern dashboard.

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

## Features

- Email/password and Google OAuth authentication
- Task CRUD with status, priority, due dates, attachments, and subtasks
- Team members and invite links
- Dashboard with task stats, charts, and recent tasks
- Excel report export for tasks and team members
- Role-aware task views (owner vs assigned member)

## Docker (backend)

Build the API image from the **repository root**:

```bash
docker build -f apps/backend/Dockerfile -t task-forge-backend .
```

Run with required environment variables (database, JWT, Google OAuth, etc.).

## License

Private project — all rights reserved unless otherwise specified.
