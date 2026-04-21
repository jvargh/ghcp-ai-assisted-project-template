---
name: design-phase
description: "Generate architecture, data model, and API specification from an app spec."
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/design-phase #file:Your-App-Spec.md`

Before starting, read the instruction files for project conventions:
- `.github/instructions/typescript.instructions.md`
- `.github/instructions/security.instructions.md`

# Design Phase

Analyze the attached app spec and produce a complete set of design documents that will guide implementation.

---

## Step 1: Architecture (`docs/architecture.md`)

Analyze the app spec to determine:

### Tech Stack
- Frontend framework and justification
- Backend framework and justification
- Database choice and justification
- Authentication approach
- Key libraries and tools

### System Design
- High-level architecture diagram (Mermaid)
- Component breakdown (frontend, backend, database, shared)
- Communication patterns (REST, WebSocket, etc.)

### Project Structure
- Complete directory tree
- Purpose of each top-level directory

### Non-Functional Requirements
- Security considerations from the app spec
- Performance targets
- Accessibility standards (WCAG 2.1 AA)

### Key Design Decisions
- State management approach
- Error handling patterns
- Environment configuration

---

## Step 2: Data Model (`docs/data-model.md`)

From the app spec, extract all entities and relationships:

### Entity Definitions
For each entity:
- Name and description
- All fields with types, constraints, and defaults
- Required vs. optional fields
- Unique constraints and indexes

### Relationships
- One-to-many, many-to-many, one-to-one
- Foreign keys and cascade behavior
- Ownership semantics

### State Machines
- Entity lifecycle transitions (e.g., DRAFT → ACTIVE → CLOSED)
- Transition rules and guards

### ER Diagram
- Mermaid ERD showing all entities and relationships

---

## Step 3: API Specification (`docs/api-spec.md`)

Define all API endpoints:

### For Each Endpoint
- HTTP method and path
- Description
- Authentication required (yes/no)
- Authorization (which roles)
- Request body schema (with validation rules)
- Success response schema and status code
- Error responses and status codes

### Grouping
- Group endpoints by resource/domain
- Document shared patterns (pagination, filtering, sorting)

### Error Format
- Define the standard error response shape
- List common error codes

---

## Step 4: Requirements Checklist (`docs/requirements.md`)

Create a trackable checklist from the app spec:

```markdown
## Features
- [ ] Feature name — brief description
```

Group by:
- User role (features per role)
- Domain area
- Priority (core vs. bonus)

---

## Step 5: Copilot Instructions

Populate `.github/copilot-instructions.md` with project-specific details:
- Project overview
- Technology stack (from architecture decisions)
- Business rules (from app spec)
- Key files table

---

## Output

After generating all documents, summarize:
- What was created
- Key architectural decisions made
- Any open questions or ambiguities in the app spec
- Recommended next steps (invoke `@orchestrator` or `@backend-dev`)
