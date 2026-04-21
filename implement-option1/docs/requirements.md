# Requirements

> Technical requirements document derived from the [Survey App specification](../Survey-App.md).

## Objectives

### Purpose

The Survey App is a web-based application that provides end-to-end survey management — from survey creation through response collection to results visualization. It serves two distinct user personas with tailored capabilities.

### Target Users

| Role | Description |
|------|-------------|
| **Survey Coordinator** | Administrative user who defines, opens, and closes surveys. Has access to survey management functions. |
| **Survey Respondent** | End user who completes open surveys and views results of closed surveys. No administrative privileges. |

### Key Capabilities

- Define surveys with multiple-choice questions (1–10 questions, 1–5 selections each)
- Manage survey lifecycle: Draft → Open → Closed
- Collect survey responses with validation (all questions must be answered)
- Display survey results in tabular format with response counts per selection
- Role-based access: Coordinators have admin access; Respondents have standard access

---

## Functional Requirements

### FR-1: General

| ID | Requirement | Status |
|----|------------|--------|
| FR-1.1 | Survey Coordinators and Survey Respondents can define, conduct, and view surveys and survey results from a common website | ✅ Complete |
| FR-1.2 | Survey Coordinators can login to the app to access administrative functions | ✅ Complete |

### FR-2: Defining a Survey

| ID | Requirement | Status |
|----|------------|--------|
| FR-2.1 | Survey Coordinator can define a survey containing 1–10 multiple choice questions | ✅ Complete |
| FR-2.2 | Survey Coordinator can define 1–5 mutually exclusive selections to each question | ✅ Complete |
| FR-2.3 | Survey Coordinator can enter a title for the survey | ✅ Complete |
| FR-2.4 | Survey Coordinator can click a 'Cancel' button to return to the home page without saving | ✅ Complete |
| FR-2.5 | Survey Coordinator can click a 'Save' button to save a survey | ✅ Complete |

### FR-3: Conducting a Survey

| ID | Requirement | Status |
|----|------------|--------|
| FR-3.1 | Survey Coordinator can open a survey by selecting it from a list of previously defined surveys | ✅ Complete |
| FR-3.2 | Survey Coordinator can close a survey by selecting it from a list of open surveys | ✅ Complete |
| FR-3.3 | Survey Respondent can complete a survey by selecting it from a list of open surveys | ✅ Complete |
| FR-3.4 | Survey Respondent can select responses to survey questions by clicking on a checkbox | ✅ Complete |
| FR-3.5 | Previously selected response is automatically unchecked if a different response is clicked (radio-button behavior) | ✅ Complete |
| FR-3.6 | Survey Respondent can click a 'Cancel' button to return to the home page without submitting | ✅ Complete |
| FR-3.7 | Survey Respondent can click a 'Submit' button to submit responses | ✅ Complete |
| FR-3.8 | Survey Respondent sees an error message if 'Submit' is clicked but not all questions are answered | ✅ Complete |

### FR-4: Viewing Survey Results

| ID | Requirement | Status |
|----|------------|--------|
| FR-4.1 | Coordinators and Respondents can select a survey to display from a list of closed surveys | ✅ Complete |
| FR-4.2 | Coordinators and Respondents can view survey results in tabular format showing response counts per selection | ✅ Complete |

### FR-5: Bonus Features (Optional)

| ID | Requirement | Status |
|----|------------|--------|
| FR-5.1 | Survey Respondents can create a unique account in the app | Not Started |
| FR-5.2 | Survey Respondents can login to the app | Not Started |
| FR-5.3 | Survey Respondents cannot complete the same survey more than once | Not Started |
| FR-5.4 | Coordinators and Respondents can view graphical representations of survey results (charts) | Not Started |

---

## Functional Architecture

### Layer 1: UI Layer

**Responsibility:** Render the user interface, handle user interactions, and manage client-side state.

- Page components organized by route (`/src/app`)
- Reusable presentational components (`/src/components`)
- Tailwind CSS for styling
- React Hook Form for form management
- Client-side validation and error display

### Layer 2: Application Logic Layer

**Responsibility:** Coordinate workflows, manage application state, and enforce UI-level business rules.

- React Context and hooks for state management (`/src/hooks`)
- Feature-specific logic modules (`/src/features`)
- Navigation and routing logic (Next.js App Router)
- Role-based UI rendering (Coordinator vs. Respondent views)

### Layer 3: Survey Engine Layer

**Responsibility:** Implement core survey domain logic — creation, lifecycle management, response processing, and result tabulation.

- Survey creation and validation logic
- Survey lifecycle state machine (Draft → Open → Closed)
- Response collection and validation (all questions answered)
- Result aggregation and tabulation
- Question/selection constraint enforcement (1–10 questions, 1–5 selections)

### Layer 4: Service / API Layer

**Responsibility:** Expose server-side endpoints for data operations and business logic execution.

- Next.js API routes (`/src/app/api`)
- Request validation using a schema validation library (e.g., Zod)
- Consistent error response format: `{ error: { code, message, details? } }`
- Authentication and authorization middleware
- Thin route handlers delegating to business logic

### Layer 5: Data Management Layer

**Responsibility:** Persist and retrieve survey data, responses, and user information.

- In-memory data store for initial development (replaceable with database later)
- Data access abstractions for surveys, questions, selections, and responses
- CRUD operations for all domain entities
- Data integrity and constraint enforcement

### Layer 6: Utility Layer

**Responsibility:** Provide shared helpers, constants, and cross-cutting utilities.

- Shared utility functions (`/src/lib`)
- Common type definitions (`/src/types`)
- Validation helpers
- Date/time formatting
- ID generation

### Layer 7: Configuration Layer

**Responsibility:** Centralize application configuration and environment management.

- Environment variable management
- Application constants
- Feature flags (if needed)
- Build and runtime configuration (`/config`)

---

## Technical Architecture

### Next.js 15

- **App Router** for file-system based routing under `/src/app`
- **Server Components** as the default rendering strategy for data fetching and layout
- **Client Components** (with `"use client"` directive) for interactive UI elements
- **API Routes** under `/src/app/api` for server-side data operations
- **Server Actions** for form submissions and mutations where appropriate
- **Layouts and Templates** for shared UI structure across routes

### TypeScript

- **Strict mode** enabled (`"strict": true` in `tsconfig.json`)
- **Domain model interfaces** for Survey, Question, Selection, Response
- **API request/response types** for all endpoints
- **No `any` types** — all data shapes explicitly typed
- **Path aliases** (`@/`) for clean imports

### Tailwind CSS

- **Utility-first styling** for all components
- **Consistent design tokens** via Tailwind config (colors, spacing, typography)
- **Responsive design** patterns for mobile and desktop
- **Reusable component patterns** using Tailwind class composition
- **No inline styles or CSS modules** — Tailwind only

---

## Planned Project Structure

```text
/src
  /app             — Next.js App Router pages and API routes
  /components      — Reusable UI components
  /features        — Feature-specific business logic modules
  /services        — API client wrappers and service functions
  /lib             — Shared utilities and helpers
  /types           — TypeScript type definitions and interfaces
  /hooks           — Custom React hooks
  /styles          — Global styles and Tailwind configuration
```

---

## Implementation Roadmap

### Phase 1: Project Initialization & Infrastructure
- Initialize Next.js 15 project with TypeScript
- Configure Tailwind CSS
- Set up ESLint, Prettier, and project tooling
- Configure path aliases and tsconfig
- Establish testing infrastructure (Jest + React Testing Library)

### Phase 2: Core Survey Engine & Domain Models
- Define TypeScript interfaces for domain entities (Survey, Question, Selection, Response)
- Implement survey lifecycle state machine (Draft → Open → Closed)
- Build in-memory data store with CRUD operations
- Implement survey creation and validation logic
- Implement response collection and result tabulation logic

### Phase 3: UI Components & User Interaction Flows
- Build shared layout components (header, navigation, footer)
- Create survey list views (draft, open, closed)
- Build survey creation form with dynamic question/selection management
- Build survey response form with radio-button behavior
- Build survey results table view

### Phase 4: Survey Creation & Response Management
- Implement API routes for survey CRUD operations
- Implement API routes for response submission
- Implement API routes for results retrieval
- Connect UI components to API endpoints via service layer
- Add form validation and error handling

### Phase 5: Data Persistence & Integration
- Implement persistent data storage (if moving beyond in-memory)
- Add authentication for Survey Coordinators
- Implement role-based access control
- Add session management

### Phase 6: Testing & Stabilization
- Write unit tests for domain logic and utilities
- Write component tests for UI components
- Write API integration tests for all endpoints
- Perform end-to-end validation against all functional requirements
- Fix bugs and stabilize

---

## Technical Constraints

### Performance
- Pages should load within acceptable thresholds for a single-page application
- Leverage Next.js Server Components for efficient server-side rendering
- Minimize client-side JavaScript bundle size

### Security
- Validate all inputs on both client and server
- Sanitize user-provided content to prevent XSS
- Implement proper authentication for administrative functions
- Use CSRF protection for state-changing operations
- Follow OWASP Top 10 guidelines

### Scalability
- Architecture should support future migration to a persistent database
- Data access patterns should be abstracted behind interfaces
- Component design should support extension without modification

### Dependency Management
- Minimize external dependencies
- Pin dependency versions for reproducible builds
- Audit dependencies for known vulnerabilities

### Maintainability
- Consistent code style enforced by ESLint and Prettier
- Clear separation of concerns across architectural layers
- Comprehensive type coverage with strict TypeScript
- Documentation kept in sync with implementation
