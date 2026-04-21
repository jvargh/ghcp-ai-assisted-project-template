# Copilot Instructions

> This file provides global project conventions that are automatically loaded by GitHub Copilot for all interactions in this repository. It complements the 8-prompt pipeline in `prompts/` by ensuring consistent conventions are applied even outside of prompt-driven sessions.

## Project Overview

This project is built using the **Prompt Files Pipeline** (Option 2) — an 8-phase sequential workflow where each prompt generates artifacts that subsequent prompts build on. The application requirements come from an app spec file attached at runtime.

## Source of Truth

| Document | Purpose |
|----------|---------|
| App spec (repo root `.md` file) | Functional and product requirements |
| `docs/architecture.md` | Tech stack, system design, folder structure |
| `docs/data-model.md` | Entities, relationships, database schema |
| `docs/api-spec.md` | API contracts, endpoints, request/response shapes |
| `docs/requirements.md` | Tracked requirements with completion status |

All implementation must align with these documents. If a conflict exists, the app spec takes precedence.

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types — use proper interfaces or type aliases
- Prefer `const` over `let`; never use `var`
- Use explicit return types on exported functions

### General
- Async/await throughout — no callbacks
- Early returns over nested conditionals
- Single responsibility per function/module
- No commented-out code in committed files

## Backend Conventions
- Routes are thin handlers that delegate to service/business logic
- Middleware for cross-cutting concerns: auth, validation, error handling
- All request bodies validated with a schema validation library before processing
- Consistent error response format: `{ error: { code, message, details? } }`
- Database transactions for multi-write operations
- Never expose internal error details to clients

## Frontend Conventions
- Functional components with typed props
- Pages organized by route; reusable components separated
- API calls through a centralized client wrapper
- Handle loading, error, and empty states for every async operation
- Semantic HTML and accessibility (WCAG 2.1 AA)
- Responsive design — mobile-first
- No inline styles; use the styling approach defined in `docs/architecture.md`

## Testing Conventions
- Tests live adjacent to source files or in a mirrored directory
- Cover happy paths, edge cases, and error conditions
- Mock external dependencies in unit tests
- Integration tests validate full request/response cycles
- Descriptive test names explaining expected behavior

## Development Workflow
- Follow prompts sequentially: architecture → data model → API → scaffold → backend → frontend → testing → docs
- Each phase builds on artifacts from prior phases
- Review generated docs before proceeding to the next phase
- Keep documentation synchronized with implementation
