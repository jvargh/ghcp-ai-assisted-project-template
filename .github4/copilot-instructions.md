# Copilot Instructions

> This file provides default project conventions loaded automatically for all Copilot interactions. The `@app-builder` agent populates the project-specific sections below during initial setup.

## Project Overview

<!-- Populated by the agent during first-time setup based on the app spec. -->

## Technology Stack

<!-- Populated by the agent. Example:
- Language: TypeScript (strict mode)
- Frontend: React + Router + state management
- Backend: Express/Fastify + validation + auth
- Database: PostgreSQL/SQLite/MongoDB
- Testing: Vitest + React Testing Library
-->

## Architecture Principles

- Modular, feature-oriented folder structure
- Strict TypeScript — no `any` types
- Separation of concerns: routes → services → data access → UI
- Consistent error handling across all layers
- Role-based access control where applicable

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- Prefer `const` over `let`; never use `var`
- Use explicit return types on exported functions
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

<!-- Populated by the agent from the app spec. -->

## Key Files

| File | Purpose |
|------|---------|
| App spec (repo root) | Source requirements |
| `docs/requirements.md` | Tracked requirements with status |
| `docs/architecture.md` | System architecture and tech stack |
