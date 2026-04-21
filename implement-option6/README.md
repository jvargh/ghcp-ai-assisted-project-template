# Survey App

A full-featured survey application built with React, Express, SQLite, and TypeScript.

## Prerequisites

- Node.js 18+
- npm

## Quick Start

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
cd ..

# Start both server and client (from project root)
npm install        # installs concurrently
npm run dev        # runs server on :3001 and client on :5173
```

Or start them individually:

```bash
# Terminal 1 — Backend
cd server
JWT_SECRET=your-secret npm run dev
# Server runs on http://localhost:3001

# Terminal 2 — Frontend
cd client
npm run dev
# Client runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Seed Data (Optional)

```bash
cd server
JWT_SECRET=your-secret npm run seed
```

Creates two test accounts:

| Role | Email | Password |
|------|-------|----------|
| Coordinator | `coordinator@example.com` | `password123` |
| Respondent | `respondent@example.com` | `password123` |

## Environment Variables

Copy `.env.example` and set values:

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | — | Secret for signing JWT tokens (required) |
| `DATABASE_URL` | `./survey.db` | Path to SQLite database file |
| `PORT` | `3001` | Backend server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

## Running Tests

```bash
# Server tests (31 integration tests)
cd server && npm test

# Client tests (4 component tests)
cd client && npm test
```

## Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Chart.js
- **Backend:** Express.js, Drizzle ORM, Zod validation
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT + bcryptjs
- **Testing:** Vitest, React Testing Library, Supertest