# Architectural Decision Records

> This document captures key architectural decisions made during the development of the Survey App.

## ADR-001: Next.js 15 with App Router

**Status:** Accepted

**Context:** The application needs a full-stack framework that supports both server-rendered and client-interactive pages, API routes, and modern React patterns.

**Decision:** Use Next.js 15 with the App Router as the application framework.

**Rationale:**
- App Router provides file-system based routing with layouts, templates, and server components by default
- Built-in API route support eliminates the need for a separate backend server
- Server Components reduce client-side JavaScript and improve performance
- Strong TypeScript support and ecosystem

**Consequences:**
- Team must understand Server Component vs. Client Component boundaries
- Must use `"use client"` directive for interactive components

---

## ADR-002: In-Memory Data Store for Initial Development

**Status:** Accepted

**Context:** The application needs data persistence, but the initial focus is on building the UI and business logic layers.

**Decision:** Use an in-memory data store for the initial phases, with a clear abstraction layer that allows swapping to a persistent database later.

**Rationale:**
- Reduces initial setup complexity
- Enables rapid prototyping and iteration
- Data access interface remains stable when migrating to a real database

**Consequences:**
- Data is lost on server restart during development
- Must define data access interfaces early to ensure clean migration path

---

## ADR-003: Tailwind CSS for Styling

**Status:** Accepted

**Context:** The application needs a styling approach that is consistent, maintainable, and productive.

**Decision:** Use Tailwind CSS as the sole styling solution. No inline styles, no CSS modules.

**Rationale:**
- Utility-first approach enables rapid UI development
- Built-in design system (spacing, colors, typography) ensures consistency
- No context switching between component files and style files
- Strong Next.js integration

**Consequences:**
- Component markup may contain many utility classes
- Team should establish reusable patterns for common UI elements

---

## ADR-004: TypeScript Strict Mode

**Status:** Accepted

**Context:** Code quality and maintainability are priorities for the project.

**Decision:** Enable TypeScript strict mode (`"strict": true`) with no `any` types allowed.

**Rationale:**
- Catches type errors at compile time
- Enforces explicit typing across all domain models and API shapes
- Improves IDE support and developer experience

**Consequences:**
- Requires explicit type definitions for all data shapes
- May require type assertions in rare edge cases (but never `any`)

---

## ADR-005: Survey Lifecycle State Machine

**Status:** Accepted

**Context:** Surveys transition through defined states (Draft, Open, Closed) with rules about what operations are valid in each state.

**Decision:** Implement survey state as an explicit state machine with enforced transitions.

**Rationale:**
- Prevents invalid state transitions (e.g., submitting responses to a draft survey)
- Makes business rules explicit and testable
- Aligns directly with the app spec requirements

**Consequences:**
- State transition logic must be enforced at the API/domain level, not just UI level
- All state changes must go through the state machine
