# Copilot Instructions

> This file provides default project conventions loaded automatically for all Copilot interactions — including inline completions, chat, and agent sessions. The `@architect` agent populates the project-specific sections during initial setup.

## Project Overview

<!-- Populated by @architect during initial setup based on the app spec. -->

## Technology Stack

<!-- Populated by @architect. Example:
- Language: TypeScript (strict mode)
- Frontend: React + Router + state management
- Backend: Express/Fastify + validation + auth
- Database: PostgreSQL/SQLite/MongoDB
- Testing: Vitest + React Testing Library
-->

## Agent Roles

This project uses specialized agents. Each has a defined scope:

| Agent | Responsibility | Scope |
|-------|---------------|-------|
| `@architect` | Architecture, tech stack, system design | `docs/` |
| `@backend-dev` | API, database, auth, business logic | `src/api/`, `src/models/`, `src/services/`, `src/middleware/` |
| `@frontend-dev` | UI components, pages, state, routing | `src/components/`, `src/pages/`, `src/hooks/` |
| `@qa-engineer` | Tests, coverage, quality assurance | `**/*.test.*`, `tests/` |
| `@tech-writer` | Documentation, guides, README | `docs/`, `README.md` |

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types — use proper interfaces
- Prefer `const` over `let`; never use `var`
- Async/await throughout — no callbacks

### File Naming
- kebab-case for files (e.g., `user-service.ts`)
- PascalCase for components (e.g., `UserProfile`)
- Colocate tests: `module.ts` → `module.test.ts`

### Backend
- RESTful API with appropriate HTTP methods and status codes
- Thin route handlers — delegate to service layer
- Validate all input at the boundary
- Error format: `{ error: { code, message, details? } }`
- Never expose internal errors to clients

### Frontend
- Functional components with hooks only
- Semantic HTML and accessibility (WCAG 2.1 AA)
- Responsive, mobile-first design
- Handle loading, error, and empty states

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI
- Descriptive test names

## Key Business Rules

<!-- Populated by @architect from the app spec. -->

## Key Files

| File | Purpose |
|------|---------|
| App spec (repo root) | Source requirements |
| `docs/requirements.md` | Tracked requirements with status |
| `docs/architecture.md` | System architecture and tech stack |
| `docs/data-model.md` | Entity definitions and relationships |
| `docs/api-spec.md` | API contracts and endpoints |
