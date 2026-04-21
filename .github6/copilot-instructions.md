# Copilot Instructions

> This file provides default project conventions loaded automatically for all Copilot interactions. The `@orchestrator` agent (or `/design-phase` prompt) populates the project-specific sections during initial setup.

## Project Overview

<!-- Populated during design phase based on the app spec. -->

## Technology Stack

<!-- Populated during design phase. Example:
- Language: TypeScript (strict mode)
- Frontend: React + Router + state management
- Backend: Express/Fastify + validation + auth
- Database: PostgreSQL/SQLite/MongoDB + ORM
- Testing: Vitest + React Testing Library + Supertest
-->

## Architecture Principles

- Modular, feature-oriented folder structure
- Strict TypeScript — no `any` types
- Separation of concerns: routes → services → data access → UI
- Consistent error handling across all layers
- Role-based access control where applicable
- Security-first: validate input, sanitize output, parameterize queries

## Available Tools

This project uses a layered customization approach:

| Layer | Files | Purpose |
|-------|-------|---------|
| Instructions | `instructions/typescript.instructions.md` | TypeScript conventions (auto-applied to `**/*.{ts,tsx}`) |
| Instructions | `instructions/security.instructions.md` | Security rules (auto-applied to `**/*.{ts,tsx,js,jsx}`) |
| Agent | `agents/orchestrator.agent.md` | Coordinates full build lifecycle |
| Prompt | `prompts/design-phase.prompt.md` | Architecture + data model + API design |
| Prompt | `prompts/review-phase.prompt.md` | Code review against requirements |
| Skill | `skills/data-modeling/SKILL.md` | Generate database schemas from design docs |
| Skill | `skills/api-generator/SKILL.md` | Generate API routes from spec |
| Skill | `skills/component-builder/SKILL.md` | Generate UI components from design |
| Skill | `skills/test-generator/SKILL.md` | Generate tests from implementation |

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types; prefer `const`; async/await throughout
- See `instructions/typescript.instructions.md` for full conventions

### Security
- Validate all input; parameterize queries; hash passwords
- See `instructions/security.instructions.md` for full conventions

### Backend
- RESTful API; thin route handlers; service layer for logic
- Error format: `{ error: { code, message, details? } }`

### Frontend
- Functional components with hooks; semantic HTML; WCAG 2.1 AA
- Responsive mobile-first; centralized API client

### Testing
- Unit + integration + component tests
- Descriptive names; isolated; factory-based test data

## Key Business Rules

<!-- Populated during design phase from the app spec. -->

## Key Files

| File | Purpose |
|------|---------|
| App spec (repo root) | Source requirements |
| `docs/requirements.md` | Tracked requirements with status |
| `docs/architecture.md` | System architecture and tech stack |
| `docs/data-model.md` | Entity definitions and relationships |
| `docs/api-spec.md` | API contracts and endpoints |
