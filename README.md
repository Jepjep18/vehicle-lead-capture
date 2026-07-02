# Vehicle Lead Capture

Full-stack vehicle lead management dashboard built with Next.js, Express, TypeScript, Prisma, and SQLite.

## Stack

Frontend:

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Sonner toast notifications

Backend:

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Zod validation

Tooling:

- npm workspaces
- ESLint
- Prettier
- Concurrently

## Project Structure

```text
client/                      Next.js dashboard
  app/                       App Router entrypoint
  components/leads/          Dashboard, table, filters, dialogs, pagination
  components/ui/             Reusable UI primitives
  services/                  API client helpers
  types/                     Shared frontend types

server/                      Express REST API and Prisma database
  prisma/schema.prisma       Relational data model
  prisma/seed.ts             Automated dataset seeder
  src/controllers/           Request/response handlers
  src/routes/                Express route definitions
  src/services/              Business logic and Prisma queries
  src/validators/            Zod request validation
  src/middleware/            Error and 404 handlers
  src/utils/                 Shared backend utilities
```

## Requirement Coverage

| Requirement           | Implementation                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Dataset & Seeding     | `server/prisma/seed.ts` fetches the 50-lead Gist and seeds when the database is empty.                           |
| Data Model            | Prisma schema uses related `Lead`, `Source`, `Status`, and `StatusHistory` tables.                               |
| API Layer             | Express REST API supports list, get, create, update, delete, lookups, validation, errors, and HTTP status codes. |
| UI Dashboard          | Next.js dashboard supports listing, create, edit, delete, and status updates.                                    |
| Productivity Features | Server-backed search, source/status filters, sorting, and pagination.                                            |
| Tooling & Setup       | npm workspace scripts, automated seed script, migration scripts, README setup/run instructions.                  |

## Architecture Notes

This project intentionally separates the frontend and backend instead of using Next.js route handlers.

- `client` is a Next.js dashboard that talks to the backend over HTTP.
- `server` is an Express CRUD microservice backed by Prisma and SQLite.
- Prisma owns the database schema, relationships, query layer, and seed flow.
- Zod validates incoming API payloads and query parameters.
- The dashboard keeps its API calls in `client/services/api.ts` so UI components stay focused on interaction state.

This mirrors a common production split where frontend and backend can evolve independently.

## Data Model

The schema is normalized into four tables:

- `Source`: where a lead came from, such as Website, SMS, Meta Ads, or Referral.
- `Status`: available lead states, such as New, Contacted, Qualified, Follow-Up, Won, and Lost.
- `Lead`: customer and vehicle inquiry data. The dataset UUID is stored as `externalId`.
- `StatusHistory`: append-only status change records for each lead.

Relationships:

- One `Source` has many `Lead` records.
- One `Status` has many `Lead` records.
- One `Lead` has many `StatusHistory` records.
- One `Status` has many `StatusHistory` records.

The duplicate emails in the seed dataset are valid because each lead has its own dataset `id`, stored as `externalId`.

## Prerequisites

- Node.js 22+
- npm
- SQLite CLI only if using the local fallback migration command

## Fresh Machine Setup

Check what is already installed:

```bash
node --version
npm --version
sqlite3 --version
```

If `node` or `npm` is missing, install Node.js 22 or newer. Recommended options:

macOS with Homebrew:

```bash
brew install node@22
```

macOS, Linux, or WSL with nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
nvm use 22
```

Windows:

- Install Node.js 22+ from `https://nodejs.org`
- Or install Node.js 22+ with nvm-windows

npm is included with Node.js. Verify again after installation:

```bash
node --version
npm --version
```

SQLite is used through Prisma, so most users do not need to install anything extra. Install the SQLite CLI only if you need the fallback migration command:

macOS:

```bash
brew install sqlite
```

Ubuntu, Debian, or WSL:

```bash
sudo apt-get update
sudo apt-get install sqlite3
```

Windows:

- Install SQLite tools from `https://sqlite.org/download.html`
- Ensure `sqlite3` is available in your terminal PATH

## Environment Setup

Create the server environment file:

```bash
cp server/.env.example server/.env
```

Default values:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
CLIENT_ORIGIN="http://localhost:3000"
CLIENT_ORIGINS="http://localhost:3000,http://localhost:3001"
```

The seed script fetches the assessment dataset by default:

```text
https://gist.githubusercontent.com/codemk12/3691a622ba446e4e39d0e80ece702a44/raw
```

Optional overrides:

```env
DATASET_URL="https://example.com/leads.json"
DATASET_PATH="./prisma/leads.json"
```

## Install

```bash
npm install
```

## Database Setup

Generate Prisma Client:

```bash
npm run db:generate
```

Create/apply migrations:

```bash
npm run db:migrate
```

Seed the database:

```bash
npm run db:seed
```

The seed is idempotent. If leads already exist, it skips instead of duplicating records.

Expected seeded data:

```text
8 sources
6 statuses
50 leads
50 initial status history records
```

### SQLite Migration Fallback

In this local environment, Prisma's schema engine returned a blank error for `migrate dev` / `db push`. If that happens, apply the checked-in migration SQL directly:

```bash
npm run db:apply:sqlite
npm run db:generate
npm run db:seed
```

Use this fallback only for a fresh local SQLite database.

## Seeder Behavior

The seed process is:

```text
Check Lead count
  ↓
If leads exist, skip
  ↓
Fetch dataset from DATASET_URL or default Gist
  ↓
Extract unique sources and statuses
  ↓
Create sources and statuses
  ↓
Create leads
  ↓
Create initial status history records
```

The default dataset URL is built into `server/prisma/seed.ts`, but can be overridden with `DATASET_URL`.

For offline/local testing, place a JSON file in the server project and set:

```env
DATASET_PATH="./prisma/leads.json"
```

## Run The App

Start client and server together:

```bash
npm run dev
```

Default local URLs:

- Dashboard: `http://localhost:3000`
- API: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

If port `3000` is busy, Next.js may use `3001`. The server supports both origins by default.

Run apps separately:

```bash
npm run dev --workspace client
npm run dev --workspace server
```

## API Endpoints

```text
GET    /api/health
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
GET    /api/sources
GET    /api/statuses
```

`GET /api/leads` supports:

- `search`
- `source`
- `status`
- `page`
- `limit`
- `sort`
- `direction`

Example:

```bash
curl "http://localhost:4000/api/leads?search=Camry&status=New&page=1&limit=10&sort=createdAt&direction=desc"
```

## API Semantics

The API returns a consistent JSON envelope.

Success:

```json
{
  "success": true,
  "data": []
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email"]
  }
}
```

Important behavior:

- `POST /api/leads` creates a lead and inserts its initial `StatusHistory` row.
- `PUT /api/leads/:id` updates lead fields.
- If `statusId` changes during update, a new `StatusHistory` row is inserted.
- `DELETE /api/leads/:id` deletes the lead and cascades its status history.
- Missing records return `404`.
- Invalid request bodies or foreign keys return `422`.

## Dashboard Features

The dashboard is built as a lightweight operational UI:

- Lead table with name, email, phone, vehicle, source, status, created date, and actions.
- Search input backed by the API.
- Source and status dropdown filters.
- Sort selector and ascending/descending toggle.
- Pagination controls.
- Create and edit dialogs.
- Delete confirmation dialog.
- Inline status selector that calls the update API.
- Toast notifications for create, update, delete, status change, and errors.

Frontend files of interest:

- `client/components/leads/LeadDashboard.tsx`
- `client/components/leads/LeadsTable.tsx`
- `client/components/leads/LeadFormDialog.tsx`
- `client/components/leads/DeleteLeadDialog.tsx`
- `client/components/leads/hooks/useLeads.ts`
- `client/components/leads/hooks/useLeadActions.ts`
- `client/services/api.ts`

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Verify

```bash
npm run lint
npm run build
npm run format:check
```

Inspect the database visually:

```bash
npm run db:studio
```

Prisma Studio usually opens at `http://localhost:5555`.

## Fresh Clone Checklist

For a reviewer starting from scratch:

```bash
git clone <repo-url>
cd vehicle-lead-capture
npm install
cp server/.env.example server/.env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Then open:

```text
http://localhost:3000
```

If `npm run db:migrate` fails with the local Prisma schema engine issue:

```bash
npm run db:apply:sqlite
npm run db:generate
npm run db:seed
npm run dev
```

## Known Trade-offs

- SQLite is used for easy local setup. PostgreSQL would be the natural next step for production.
- The UI uses simple local React state instead of a cache library because the assessment scope is small.
- Tests are not included yet. The next polish step would be Vitest coverage for services, validators, and critical UI flows.
- Docker is not included. It would be a useful optional enhancement for fully reproducible local setup.
- In this local environment, Prisma migration commands returned a blank schema-engine error, so a checked-in SQLite SQL fallback is documented.
