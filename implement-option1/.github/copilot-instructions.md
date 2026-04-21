# Copilot Instructions

> Primary guidance document for development agents and contributors working on the Survey App.

## Project Overview

The Survey App is a full-featured web application that enables Survey Coordinators to define, conduct, and manage surveys, and Survey Respondents to complete surveys and view results. Built as a modern Next.js single-page application with a clear separation between administrative and respondent functionality. Surveys are accessed from the app's web page (no email distribution).

## Source of Requirements

- The system requirements are defined in the app spec document: `Survey-App.md` (repository root).
- All implementation must align with the functionality described in that document.
- `docs/requirements.md` translates those product requirements into a technical architecture.
- `docs/architecture.md` describes the system architecture and component boundaries.

## Architecture

- **Structure**: Monorepo single-app (Next.js App Router)
- **Frontend**: Next.js 15 with React, TypeScript, Tailwind CSS, App Router for routing, React Context/hooks for state management
- **Backend**: Next.js API routes / Server Actions, TypeScript, schema-based validation
- **Shared**: Common types and utilities under `/src/types` and `/src/lib`

## Planned Technology Stack

| Concern          | Technology       |
| ---------------- | ---------------- |
| Framework        | Next.js 15       |
| Language         | TypeScript       |
| Styling          | Tailwind CSS     |
| Runtime          | Node.js          |
| Package Manager  | npm              |

## Architectural Principles

- Modular and maintainable architecture
- Strict TypeScript usage — no `any` types
- Separation of concerns across clearly defined layers
- Reusable UI components separated from page-level components
- Feature-oriented folder organization
- Centralized configuration management

## Coding Standards

### TypeScript
- Strict mode enabled everywhere (`"strict": true`)
- No `any` types — use proper interfaces
- Prefer `const` over `let`; never use `var`
- All API request/response shapes defined in `/src/types`
- Import using path aliases where possible (e.g., `@/`)

### Backend Conventions
- Routes should be thin handlers that delegate to business logic
- Middleware for cross-cutting concerns: auth, validation, error handling
- All request bodies validated with a schema validation library before processing
- Consistent error response format: `{ error: { code, message, details? } }`

### Frontend Conventions
- Pages organized by route under `/src/app`
- Reusable components separated from page-level components in `/src/components`
- Feature-specific logic organized under `/src/features`
- API calls through a centralized fetch/client wrapper in `/src/services`
- Tailwind CSS for all styling — no inline styles, no CSS modules
- Forms use a form management library (e.g., React Hook Form)

## Key Business Rules

- **Two user roles**: Survey Coordinators (admin) and Survey Respondents (end users)
- Survey Coordinators can define surveys with 1–10 multiple choice questions
- Each question supports 1–5 mutually exclusive selections
- Surveys have a lifecycle: **Draft → Open → Closed**
- Only open surveys can accept responses
- All questions must be answered before a survey can be submitted
- Survey results are displayed in tabular format showing response counts per selection
- Previously selected responses are automatically unchecked when a different response is clicked (radio-button behavior)

## Development Workflow

- Implementation must proceed in structured phases as defined in `project/roadmap.md`
- Each phase must meet requirements defined in `docs/requirements.md`
- Documentation must be updated alongside development
- Architecture constraints defined in `docs/architecture.md` must be respected
- Refer to `/instructions` for detailed workflow, validation, and development guidelines

## Validation Expectations

Each completed phase must include:

- Validation against requirements derived from the app spec (`Survey-App.md`)
- Confirmation that architectural boundaries are maintained
- Documentation updates where appropriate
- Tests covering the implemented functionality

## Testing

- Test runner: Jest + React Testing Library (unit/component tests)
- Backend: API integration tests
- Frontend: Component tests
- All tests reside in `/tests`

## Scripts

- `npm run dev` — start the development environment
- `npm run build` — build for production
- `npm run test` — run all tests
- `npm run lint` — lint the codebase

## Key Files

| File | Purpose |
|------|---------|
| `Survey-App.md` | Source application specification |
| `docs/requirements.md` | Technical requirements with implementation status |
| `docs/architecture.md` | System architecture |
| `docs/decisions.md` | Architectural decision records |
| `project/roadmap.md` | Implementation roadmap and phases |
