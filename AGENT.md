# Task Forge — monorepo guide

Task Forge is a Trello-style task management app built as a **pnpm + Turborepo** monorepo. The active stack lives under `apps/` and `packages/`; legacy `client/` and `server/` folders remain for reference during migration.

---

## 1. Stack overview

| Layer | Package / path | Stack |
| --- | --- | --- |
| Root | `package.json` | pnpm workspaces, Turborepo, shared ESLint/Prettier/TypeScript |
| Shared | `packages/shared` (`@task-forge/shared`) | Zod env validation, API schemas, shared types |
| API | `apps/backend` (`@task-forge/backend`) | Fastify 5, `fastify-type-provider-zod`, TypeORM, PostgreSQL |
| Web | `apps/frontend` (`@task-forge/frontend`) | Next.js 15 App Router, Tailwind CSS |

**Workspace scope:** `@task-forge/*`

---

## 2. Directory layout

```text
task-forge/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── packages/
│   └── shared/
│       └── src/
│           ├── env.schema.ts
│           ├── constant/
│           ├── schemas/
│           └── types/
└── apps/
    ├── backend/
    │   └── src/
    │       ├── app.ts
    │       ├── routers.ts
    │       ├── database/
    │       ├── lib/
    │       ├── plugins/
    │       └── modules/
    │           └── health/
    └── frontend/
        └── src/app/
```

---

## 3. Architecture conventions

- **Fastify** bootstraps in `apps/backend/src/app.ts` with Zod validator/serializer compilers and routes under the `/api` prefix.
- **Feature modules** follow `modules/<feature>/` with router, controller, service, and `internal/` for TypeORM entities, readers, and writers (see `.cursor/rules/backend.mdc`).
- **Shared contracts** — all Zod schemas and DTO types belong in `packages/shared`; apps import via subpath exports only (`@task-forge/shared/schemas`, `/types`, `/env`, `/constant`).
- **Env** — backend reads configuration only through `import { env } from '@task-forge/shared/env'`; never read `process.env` directly in app code.
- **Frontend** — domain types come from `@task-forge/shared/types`; UI-only types stay in the frontend module when needed (see `.cursor/rules/frontend.mdc`).

---

## 4. Environment variables

### Backend (`apps/backend/.env.development`)

Copy from `apps/backend/.env.example`.

| Variable | Example | Purpose |
| --- | --- | --- |
| `APP_NAME` | `task-forge-backend` | Shown in health payload |
| `NODE_ENV` | `development` | Logging, CORS, Swagger |
| `PORT` | `3000` | API listen port |
| `FRONTEND_URL` | `http://localhost:3001` | CORS allowlist |
| `DATABASE_*` | — | PostgreSQL connection (host, port, user, password, name, optional CA) |

### Frontend (`apps/frontend/.env.development`)

| Variable | Example | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | API base URL for client fetches |

---

## 5. Dev workflow

From the repository root:

```bash
pnpm install
cp apps/backend/.env.example apps/backend/.env.development
cp apps/frontend/.env.example apps/frontend/.env.development
pnpm dev
```

Expected URLs:

- API health: `http://localhost:3000/api/health`
- Web: `http://localhost:3001`

Verify the API:

```bash
curl -s http://localhost:3000/api/health | jq .
```

**Migrations** (from `apps/backend`):

- Generate: `pnpm run mig:gen`
- Run: `pnpm run mig:run`
- Revert: `pnpm run mig:revert`

---

## 6. Extending the project

Recommended order:

1. Add env keys to `packages/shared/src/env.schema.ts`.
2. Add Zod schemas and types in `packages/shared/src/schemas/` and `types/`.
3. Add a backend module under `apps/backend/src/modules/<feature>/` and register it in `routers.ts`.
4. Add frontend module under `apps/frontend/src/modules/<feature>/` when building UI.
5. Run `graphify update .` after structural code changes (see `.cursor/rules/graphify.mdc`).

---

## 7. Agent rules

Cursor rules under `.cursor/rules/`:

| File | Use when |
| --- | --- |
| `backend.mdc` | Fastify modules, TypeORM, migrations, API routes |
| `frontend.mdc` | Next.js pages, components, TanStack Query, Zustand |
| `shared.mdc` | Zod schemas, shared types, env schema |
| `graphify.mdc` | Architecture exploration via `graphify-out/` |

---

## 8. Verification checklist

- [ ] `pnpm install` succeeds at the repo root.
- [ ] `pnpm build` completes for `shared`, `backend`, and `frontend`.
- [ ] `GET /api/health` returns `200` with `success: true`.
- [ ] Frontend homepage loads at port `3001`.
