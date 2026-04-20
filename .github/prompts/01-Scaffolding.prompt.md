---
name: 01-Scaffolding
description: Create the initial project planning scaffold with documentation, Copilot instructions, and requirements — no application code.
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.

Create the initial planning scaffold for the project. **Do not implement any application code.** The objective is to establish a best-practices project structure, a top-level Copilot instruction file, and a `requirements.md` that will guide future development.

All planning and documentation must be derived from the attached application specification document (referred to as **"the app spec"** throughout this prompt), which defines the functional and product requirements of the application.

---

## Phase 1: Project Planning Scaffold

Create a repository structure focused on documentation, architecture planning, and development governance.

### Suggested Structure

```text
/.github
  copilot-instructions.md

/docs
  requirements.md
  architecture.md
  decisions.md

/instructions
  development-guidelines.md
  phase-workflow.md
  validation-standards.md

/project
  README.md
  roadmap.md

/src
  (reserved for future implementation)

/tests
  (reserved for future testing)

/config
  (reserved for future configuration)
```

The scaffold should clearly separate:

- Governance and instruction files
- Architectural documentation
- Project planning artifacts
- Locations reserved for future code and tests

---

### Top-Level Instruction File

Create the default Copilot instruction file: `.github/copilot-instructions.md`

This file acts as the primary guidance document for development agents and contributors. It should include:

#### Source of Requirements

- The system requirements are defined in the app spec document provided in the repository root.
- All implementation must align with the functionality described in that document.
- `docs/requirements.md` translates those product requirements into a technical architecture.

#### Planned Technology Stack

| Concern          | Technology       |
| ---------------- | ---------------- |
| Framework        | Next.js 15       |
| Language         | TypeScript       |
| Styling          | Tailwind CSS     |
| Runtime          | Node.js          |
| Package Manager  | npm or pnpm      |

#### Architectural Principles

- Modular and maintainable architecture
- Strict TypeScript usage
- Separation of concerns
- Reusable UI components
- Feature-oriented folder organization
- Centralized configuration management

#### Development Workflow

- Implementation must proceed in structured phases.
- Each phase must meet requirements defined in `docs/requirements.md`.
- Documentation must be updated alongside development.
- Architecture constraints must be respected.

#### Validation Expectations

Each completed phase must include:

- Validation against requirements derived from the app spec
- Confirmation that architectural boundaries are maintained
- Documentation updates where appropriate

> Additional instruction files may be created under `/instructions` to expand on workflow, validation, or architectural guidelines.

---

## Phase 2: Requirements Document

Create: `/docs/requirements.md`

This document should convert the functional requirements described in `Survey-App.md` into a structured technical blueprint.

### Objectives

Summarize:

- The purpose of the survey application
- Target users
- Key capabilities described in `Survey-App.md`

### Functional Architecture

Define the logical layers of the application and describe the responsibilities and boundaries of each:

1. **UI Layer**
2. **Application Logic Layer**
3. **Survey Engine Layer**
4. **Service / API Layer**
5. **Data Management Layer**
6. **Utility Layer**
7. **Configuration Layer**

### Technical Architecture

Define how the selected stack will support the system:

- **Next.js 15** — App Router structure, server and client component boundaries, routing and API capabilities
- **TypeScript** — Strict type configuration, typed domain models and interfaces
- **Tailwind CSS** — Utility-first styling, reusable UI patterns

### Planned Project Structure

Document the intended implementation layout:

```text
/src
  /app
  /components
  /features
  /services
  /lib
  /types
  /hooks
  /styles
```

### Implementation Roadmap

Define high-level phases required to build the system described in `Survey-App.md`:

1. Project initialization and infrastructure
2. Core survey engine and domain models
3. UI components and user interaction flows
4. Survey creation and response management
5. Data persistence and integrations
6. Testing and stabilization

### Technical Constraints

Document considerations including:

- Performance expectations
- Security requirements
- Scalability goals
- Dependency management strategy
- Maintainability standards

---

## Expected Outcome

The repository should contain:

- `.github/copilot-instructions.md` as the primary development instruction file
- Supporting instruction files if necessary
- `docs/requirements.md` derived from `Survey-App.md`
- A clean project scaffold prepared for future implementation

**No application code or implementation should be created during this step.**