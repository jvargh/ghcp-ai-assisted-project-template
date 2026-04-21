---
mode: agent
description: "Generate project skeleton, configs, and dependencies"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/04-scaffold #file:Your-App-Spec.md`

# Phase 4: Project Scaffold

Given the architecture in `docs/architecture.md`, the data model in `docs/data-model.md`, and the API spec in `docs/api-spec.md`, generate the full project skeleton.

The folder structure, tech stack, and dependencies must match the decisions made in `docs/architecture.md`. Reference the attached app spec for context on the application's scope.

## Deliverables

### 1. Project Root Configuration
Create root-level configuration files appropriate for the chosen tech stack:
- Package manager configuration (e.g., `package.json` with workspaces if monorepo)
- Language configuration (e.g., `tsconfig.base.json` for TypeScript)
- `.gitignore` — Language/framework-appropriate ignores
- `.env.example` — Template for required environment variables
- Linting and formatting configuration

### 2. Backend Scaffold
Create the backend project structure as defined in `docs/architecture.md`:
- Package/dependency file with all libraries chosen in the architecture
- Database schema or ORM configuration matching `docs/data-model.md`
- Entry point file (placeholder)
- Directory structure for routes, services, middleware, config, and types
- Empty/placeholder files for each API resource identified in `docs/api-spec.md`

### 3. Frontend Scaffold
Create the frontend project structure as defined in `docs/architecture.md`:
- Package/dependency file with all libraries chosen in the architecture
- Entry point and root component (placeholder)
- Directory structure for components, pages, services, state, and types
- Empty/placeholder files for each page derived from the app spec's user flows

### 4. Verify Scaffold
After creating all files:
- List the complete directory tree
- Ensure all configuration files are syntactically valid
- Confirm the structure matches `docs/architecture.md`

Do NOT install dependencies yet — just create the files. All source files should have minimal placeholder content with TODO comments indicating what will be implemented in subsequent phases.
