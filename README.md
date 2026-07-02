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
client/   Next.js dashboard
server/   Express REST API and Prisma database
```

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
