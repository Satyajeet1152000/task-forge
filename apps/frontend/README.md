# @task-forge/frontend

Next.js web application for Task Forge. Provides authentication, task management, team collaboration, dashboard analytics, and Excel report downloads.

## Tech stack

- **Next.js 15** (App Router)
- **React 18** with client/server components
- **TanStack Query** — server state and API caching
- **Zustand** — client state (e.g. auth, task list cache)
- **React Hook Form + Zod** — forms validated with shared schemas
- **shadcn/ui + Tailwind CSS** — UI components and styling
- **NextAuth** — session handling with Google OAuth
- **Axios** — HTTP client to the backend API

## Getting started

### Environment

On first run, `pnpm dev` copies `.env.example` to `.env.development` if missing.

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_AUTH_COOKIE_NAME` | Auth cookie name (must match backend) |
| `AUTH_SECRET` | NextAuth secret (32+ characters) |
| `AUTH_URL` | Frontend URL (e.g. `http://localhost:3001`) |

### Scripts

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Start dev server on port **3001** |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint |
| `pnpm format` | Lint fix + Prettier |

From the monorepo root:

```bash
pnpm --filter @task-forge/frontend dev
```

## App routes

| Route | Description |
| ----- | ----------- |
| `/` | Landing / redirect |
| `/login`, `/signup` | Authentication |
| `/dashboard` | Stats, charts, recent tasks |
| `/tasks` | Task list with filters and report download |
| `/task/create-task` | Create task |
| `/task/[id]` | Edit task |
| `/team-members` | Team management |
| `/invite/[code]` | Accept member invite |

## Project structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Login, signup
│   └── (private)/          # Authenticated shell (sidebar, header)
├── components/             # App-wide UI (layout, shadcn ui/)
├── lib/                    # axios, queryClient, utils, report-generator
└── modules/                # Feature modules
    ├── auth/
    ├── task/
    ├── team-member/
    └── dashboard/
```

### Module convention

Each feature under `modules/<feature>/` typically includes:

- `<feature>.api.ts` — raw API calls
- `<feature>.queries.ts` — TanStack Query hooks
- `components/` — feature-specific UI
- `index.ts` — barrel exports

Import shared types and schemas from `@task-forge/shared/types` and `@task-forge/shared/schemas`, not from local duplicates.

## Key features

- **Tasks** — grid view, status filters, view modal for assigned tasks, Excel export
- **Dashboard** — greeting, counts, status/priority charts, recent tasks table
- **Team** — list members, invite, remove, team report export
- **Toasts** — `sonner` feedback on mutations

## Shared package

The frontend depends on `@task-forge/shared` for:

- Route constants (`Routes`, `NAV_ITEMS`)
- Form validation schemas
- API response types

Build shared before a production frontend build (handled automatically via the `build` script).

## Icons

- **Lucide** — only inside `components/ui/` (shadcn primitives)
- **Iconify** — everywhere else (layout, modules, pages)
