# Architecture

> System architecture for the Survey App, derived from the [app spec](../Survey-App.md) and [requirements](requirements.md).

## Overview

The Survey App is a monolithic Next.js 15 application using the App Router. It serves both Survey Coordinators (admin) and Survey Respondents (end users) from a single deployment. The architecture favors simplicity and clear separation of concerns across well-defined layers.

## System Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Browser Client                    │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Coordinator  │  │  Respondent   │  │  Results   │ │
│  │    Views      │  │    Views      │  │   Views    │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │
│         │                  │                │       │
│  ┌──────┴──────────────────┴────────────────┴─────┐ │
│  │          Shared UI Components & Hooks          │ │
│  └────────────────────┬───────────────────────────┘ │
└───────────────────────┼─────────────────────────────┘
                        │ HTTP / Server Actions
┌───────────────────────┼─────────────────────────────┐
│              Next.js Server (Node.js)               │
│                       │                             │
│  ┌────────────────────┴───────────────────────────┐ │
│  │              API Routes / Actions              │ │
│  │         (validation, auth, routing)            │ │
│  └────────────────────┬───────────────────────────┘ │
│                       │                             │
│  ┌────────────────────┴───────────────────────────┐ │
│  │             Survey Engine (Domain)             │ │
│  │    (lifecycle, creation, response, results)    │ │
│  └────────────────────┬───────────────────────────┘ │
│                       │                             │
│  ┌────────────────────┴───────────────────────────┐ │
│  │              Data Management Layer             │ │
│  │          (in-memory store / future DB)         │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Component Boundaries

### Client-Side Boundaries

| Component | Scope | Boundary Rules |
|-----------|-------|----------------|
| **Page Components** | Route-specific views under `/src/app` | May import from `components`, `hooks`, `features`, `services` |
| **UI Components** | Reusable presentational components under `/src/components` | Must be stateless or use local state only. No direct API calls. |
| **Hooks** | Custom React hooks under `/src/hooks` | May call services. Must not import page components. |
| **Features** | Feature-specific logic under `/src/features` | Encapsulate business rules for a feature area. May import from `lib`, `types`. |
| **Services** | API client functions under `/src/services` | Only layer that makes HTTP calls. Thin wrappers over fetch. |

### Server-Side Boundaries

| Component | Scope | Boundary Rules |
|-----------|-------|----------------|
| **API Routes** | Endpoint handlers under `/src/app/api` | Validate input, delegate to domain logic, return responses. No direct data store access. |
| **Survey Engine** | Core domain logic under `/src/lib` or `/src/features` | Pure business logic. No framework dependencies. Testable in isolation. |
| **Data Store** | Persistence abstraction | Accessed only through defined interfaces. Swappable implementation. |

## Routing Architecture

```
/                        → Home page (survey lists by status)
/coordinator/login       → Coordinator login
/coordinator/surveys     → Survey management dashboard
/coordinator/surveys/new → Create new survey
/surveys/:id             → Take a survey (Respondent)
/surveys/:id/results     → View survey results
```

## Data Flow

### Survey Creation
1. Coordinator fills out survey form (Client Component)
2. Form data validated client-side (React Hook Form)
3. Submit triggers API call via service layer
4. API route validates request body (Zod schema)
5. Survey Engine creates and persists survey in Draft state
6. Response returned to client

### Survey Response
1. Respondent selects open survey from list
2. Survey data fetched via service layer → API route → data store
3. Respondent selects answers (radio-button behavior per question)
4. Submit triggers validation (all questions answered)
5. API route validates and stores response
6. Respondent redirected to confirmation or home

### Results Viewing
1. User selects closed survey from list
2. Results data fetched via API route
3. Survey Engine aggregates response counts per selection
4. Results rendered in tabular format

## State Management

- **Server state**: Fetched via API routes, cached by Next.js where appropriate
- **Client state**: React Context for global concerns (e.g., auth), component-local state for forms
- **No external state library** required for initial implementation

## Authentication & Authorization

- Survey Coordinators authenticate via a login page
- Session-based or token-based auth (implementation TBD)
- Role check at both API route level and UI rendering level
- Survey Respondents access surveys without authentication (initial implementation)

## Key Design Decisions

Architectural decisions are tracked in [decisions.md](decisions.md).
