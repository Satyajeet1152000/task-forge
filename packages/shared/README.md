# @task-forge/shared

Shared TypeScript package used by the backend and frontend. It keeps API contracts, validation rules, environment configuration, and constants in one place so both apps stay aligned.

## What lives here

| Path            | Purpose |
| --------------- | ------- |
| `src/schemas/`  | Zod schemas for request/response bodies and route definitions |
| `src/types/`    | Inferred TypeScript types from schemas and domain enums |
| `src/constant/` | Routes, auth, Swagger tags, and other cross-app constants |
| `src/env.schema.ts` | Validated environment variables (backend) |

## Public exports

Import only from sub-path exports (not the package root):

```ts
import { env } from "@task-forge/shared/env";
import { createTaskBodySchema } from "@task-forge/shared/schemas";
import type { Task, TaskStatus } from "@task-forge/shared/types";
import { Routes } from "@task-forge/shared/constant";
```

| Export       | Description |
| ------------ | ----------- |
| `./env`      | Zod-parsed `process.env` for the backend |
| `./schemas`  | Zod schemas and Fastify route schema helpers |
| `./types`    | Shared domain and API types |
| `./constant` | App routes, Swagger order, auth-related constants |

## Schemas and types

Schemas are the source of truth. Types are inferred with `z.infer<typeof schema>` and re-exported from `src/types/`.

Domains covered:

- **Auth** — login, register, Google OAuth, session payloads
- **Task** — tasks, subtasks, list/detail responses
- **Team member** — member list, add/remove
- **Member invite** — invite creation and join flows
- **Health** — health-check response

## Scripts

| Script        | Description |
| ------------- | ----------- |
| `pnpm build`  | Compile to `dist/` (required before backend/frontend build) |
| `pnpm dev`    | Watch mode compile |
| `pnpm lint`   | Typecheck without emit |

From the monorepo root:

```bash
pnpm --filter @task-forge/shared build
```

## Development notes

- Build output goes to `dist/`. Both apps depend on compiled `dist` at runtime for package exports.
- Do not import from `src/` in consuming apps — use the export paths above.
- When adding a new API field, update the Zod schema first, then export the inferred type.
- Backend route schemas in `packages/shared/src/schemas/` are used for Swagger and request validation.

## Adding a new shared contract

1. Add or update a schema in `src/schemas/`.
2. Export inferred types from `src/types/` if needed by multiple consumers.
3. Re-export from `src/schemas/index.ts` or `src/types/index.ts` as appropriate.
4. Run `pnpm build` in this package (or `pnpm build` from the repo root).
