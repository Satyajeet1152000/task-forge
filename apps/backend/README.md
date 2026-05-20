# @task-forge/backend

Fastify REST API for Task Forge. Handles authentication, tasks, subtasks, team members, and invite flows against a PostgreSQL database via TypeORM.

## Tech stack

- **Fastify 5** with Zod type provider
- **TypeORM** — entities, migrations, PostgreSQL
- **Zod** — validation via `@task-forge/shared` schemas
- **JWT + HTTP-only cookies** — session auth
- **Google OAuth** — social login
- **Swagger** — API documentation at `/documentation`

## Getting started

### Environment

Copy and configure:

```bash
cp .env.example .env.development
```

| Variable | Description |
| -------- | ----------- |
| `PORT` | Server port (default `3000`) |
| `DATABASE_*` | PostgreSQL connection |
| `DATABASE_CA_CERT` | SSL CA for production DB |
| `FRONTEND_URL` | CORS origin (e.g. `http://localhost:3001`) |
| `JWT_SECRET` | Signing secret (32+ characters) |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `AUTH_COOKIE_NAME` | Cookie name for auth token |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `ADMIN_INVITE_TOKEN` | Optional admin invite bypass |

Env validation runs through `@task-forge/shared/env` at startup.

### Scripts

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Run migrations, then start API with hot reload (`tsx watch`) |
| `pnpm build` | Build shared package + compile TypeScript to `dist/` |
| `pnpm start` | Run migrations, then `node dist/app.js` |
| `pnpm mig:gen` | Generate a new migration |
| `pnpm mig:run` | Apply pending migrations |
| `pnpm mig:revert` | Revert last migration |
| `pnpm mig:show` | Show migration status |
| `pnpm lint` | ESLint |

From the monorepo root:

```bash
pnpm --filter @task-forge/backend dev
```

## Project structure

```
src/
├── app.ts                  # Fastify bootstrap and listen
├── database/
│   ├── data-source.ts      # TypeORM CLI data source
│   ├── db-config.ts        # Runtime TypeORM config
│   └── migrations/         # Versioned SQL migrations
├── middleware/             # Auth and request helpers
├── modules/
│   ├── auth/               # Register, login, Google, users
│   ├── task/               # Tasks CRUD
│   ├── sub-task/           # Subtask completion updates
│   ├── team-member/        # Team list, add, remove
│   ├── member-invite/      # Invite links
│   └── health/             # Health check
├── plugins/                # CORS, JWT, Swagger, etc.
└── utils/
```

### Module pattern

Each domain module typically includes:

- `*.router.ts` — route registration
- `*.controller.ts` — HTTP handlers
- `*.service.ts` — business logic
- `internal/` — entities, readers, writers, serializers, repositories

## API modules

| Module | Responsibility |
| ------ | -------------- |
| **auth** | Registration, login, Google OAuth, current user |
| **task** | List, create, update, delete tasks |
| **sub-task** | Toggle subtask completion |
| **team-member** | List/add/remove team members |
| **member-invite** | Create and accept invites |
| **health** | Service health endpoint |

## Database

- PostgreSQL with TypeORM migrations (`synchronize: false`)
- Entities live under `src/modules/**/internal/*.entity.ts`
- Development migrations target `src/`; production uses compiled `dist/` paths

### Migrations workflow

```bash
pnpm build
pnpm mig:run          # apply
pnpm mig:gen          # generate after entity changes (review SQL before commit)
```

## Docker

Build from the **repository root** (monorepo context required for `@task-forge/shared`):

```bash
docker build -f apps/backend/Dockerfile -t task-forge-backend .
```

The image:

1. Installs dependencies with pnpm
2. Builds shared + backend
3. Deploys a production `node_modules` layout
4. Runs migrations then starts `dist/app.js`

Provide all required env vars at runtime. Do not bake secrets into the image.

## Shared package

Import validation and types from:

```ts
import { env } from "@task-forge/shared/env";
import { createTaskBodySchema } from "@task-forge/shared/schemas";
import type { Task } from "@task-forge/shared/types";
```

Build `@task-forge/shared` before building or running the backend.

## Swagger

When the server is running, open:

```
http://localhost:3000/documentation
```

Route schemas are defined in `packages/shared` and registered through Fastify route config.
