# Competitive Intelligence AI — Phase 1

A multi-tenant Competitive Intelligence SaaS platform. Phase 1 delivers the
production-ready foundation: authentication, organizations, competitor
management, and a premium B2B dashboard shell — all backed by mock/demo
intelligence data. Real SEO/traffic/AI data collection is out of scope until
later phases.

## Project overview

- **Frontend**: Next.js (App Router) + React + TypeScript + Tailwind CSS +
  shadcn/ui + Lucide icons.
- **Backend**: Node.js + Express + TypeScript + MongoDB (Mongoose).
- **Auth**: JWT access + refresh tokens, bcrypt password hashing.
- **Multi-tenancy**: every user belongs to an `Organization`; every
  `Competitor` and `Company` document is scoped by `organizationId` and all
  API queries enforce that scope.

Phase 1 explicitly does **not** integrate SEO APIs, web crawling, AI
analysis, alerting, reporting, or background workers. Everything shown
beyond auth/competitor CRUD (KPIs, threat scores, activity feed, per-
competitor intelligence cards) is clearly labeled **Demo data** and is
generated client-side from mock data — it is never presented as live data.

## Requirements

- Node.js 18+ (tested on Node 20/22/26)
- npm 9+
- MongoDB 6+ running as a **replica set** (required for multi-document
  transactions used during registration) — MongoDB Atlas clusters are
  replica sets by default; a local `mongod` needs `--replSet` enabled.

## Folder structure

```
competitive-intelligence/
  backend/
    src/
      config/       # env validation, DB connection
      controllers/  # thin HTTP handlers
      routes/       # Express routers
      models/       # Mongoose schemas (User, Organization, Company, Competitor)
      middleware/    # auth, role, organization, error, notFound, rate limit, validation
      services/      # business logic
      utils/         # jwt, api response helpers, domain/slug normalization
      types/         # shared TS types
      validators/    # Zod schemas
      scripts/seed.ts
      app.ts
      server.ts
  frontend/
    app/             # Next.js App Router pages
    components/      # shared/reusable UI (shadcn/ui + layout + state views)
    features/        # feature-scoped UI: auth, dashboard, competitors
    hooks/            # auth context, page title context, debouncing
    lib/              # env, nav config, utils
    services/         # API client + per-resource service modules
    types/            # shared TS types
```

## Environment variables

### Backend (`backend/.env`, copy from `backend/.env.example`)

```
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/competitive-intelligence

JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

Environment variables are validated at startup with Zod (`src/config/env.ts`)
— the server refuses to start with missing/invalid values.

### Frontend (`frontend/.env.local`, copy from `frontend/.env.local.example`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## MongoDB setup

**Option A — MongoDB Atlas (recommended)**

1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a database user and allow your IP (or `0.0.0.0/0` for local dev).
3. Copy the connection string into `MONGODB_URI` in `backend/.env`.

**Option B — local MongoDB**

```bash
brew install mongodb-community
mongod --dbpath /path/to/data --replSet rs0
# in another terminal, one-time only:
mongosh --eval "rs.initiate()"
```

Then set `MONGODB_URI=mongodb://127.0.0.1:27017/competitive-intelligence`.

## Installation

```bash
# backend
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT secrets

# frontend
cd ../frontend
npm install
cp .env.local.example .env.local
```

## Development commands

```bash
# backend (http://localhost:5000)
cd backend
npm run dev

# frontend (http://localhost:3000)
cd frontend
npm run dev
```

## Seed data (development only)

```bash
cd backend
npm run seed
```

Creates one organization, one owner user, and three demo competitors. The
script refuses to run when `NODE_ENV=production`.

**Demo credentials (seed only):**

```
Email:    owner@demo.com
Password: Demo1234!
```

## Build commands

```bash
# backend
cd backend
npm run build      # tsc -> dist/
npm run typecheck  # tsc --noEmit
npm run lint

# frontend
cd frontend
npm run build      # next build (also runs the TypeScript check)
npm run lint
```

## API overview

All responses follow a consistent envelope:

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "...", "errors": { "field": "message" } }
```

### Auth (`/api/auth`)

| Method | Path        | Auth | Description |
|--------|-------------|------|-------------|
| POST   | `/register` | none | Creates an Organization + Company + owner User, returns tokens |
| POST   | `/login`    | none | Returns access + refresh tokens |
| POST   | `/refresh`  | none | Exchanges a refresh token for a new token pair |
| POST   | `/logout`   | required | Clears the client session |
| GET    | `/me`       | required | Returns the current user + organization name |

### Competitors (`/api/competitors`) — all require authentication and are scoped to the caller's organization

| Method | Path             | Description |
|--------|------------------|-------------|
| GET    | `/`              | List competitors (supports `?type=` and `?search=`) |
| POST   | `/`              | Create a competitor |
| GET    | `/:id`           | Get a single competitor |
| PATCH  | `/:id`           | Update a competitor (including `status`) |
| DELETE | `/:id`           | Delete a competitor |

## Phase 1 testing checklist

- [ ] Register a new company (creates Organization + Company + owner User)
- [ ] Log in with the created account
- [ ] Access `/dashboard` while authenticated
- [ ] See demo KPI cards, threat overview, and activity feed (all labeled "Demo data")
- [ ] Add a competitor (domain is normalized, e.g. `https://www.acme.com/` → `acme.com`)
- [ ] Edit a competitor
- [ ] Pause / resume a competitor
- [ ] Delete a competitor (with confirmation dialog)
- [ ] Search competitors by name/domain and filter by type
- [ ] View a competitor's detail page (Overview tab populated, other tabs show "Coming in Phase 2+")
- [ ] Log out
- [ ] Refresh the browser while logged in — session persists (no redirect to `/login`)
- [ ] Confirm a second organization cannot see or access the first organization's competitors (404 on cross-org access)
