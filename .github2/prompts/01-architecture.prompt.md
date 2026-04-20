---
mode: agent
description: "Generate architecture decisions, tech stack, and folder structure"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/01-architecture #file:Your-App-Spec.md`

# Phase 1: Architecture & Tech Stack

Given the application requirements in the attached spec file (referred to as **"the app spec"** throughout this prompt), generate a complete architecture document.

Analyze the app spec to identify the functional scope, user roles, data entities, and interaction patterns, then make appropriate technology decisions.

## Deliverables

Create `docs/architecture.md` containing:

### 1. Tech Stack Decisions
- Frontend framework and justification
- Backend framework and justification
- Database choice and justification
- Authentication approach
- Key libraries and tools

Base all technology choices on the complexity and requirements described in the app spec.

### 2. System Architecture
- High-level architecture diagram (use Mermaid)
- Component breakdown (frontend, backend, database)
- Communication patterns (REST, WebSocket, etc.)

### 3. Project Folder Structure
- Complete directory tree for the project
- Explain the purpose of each top-level directory

### 4. Non-Functional Requirements
- Security considerations derived from the app spec (authentication, authorization, input validation)
- Performance targets
- Accessibility standards (WCAG 2.1 AA)

### 5. Key Design Decisions
- State management approach
- API versioning strategy
- Error handling patterns
- Environment configuration approach

Write the output to `docs/architecture.md`. Use clear headings and Mermaid diagrams where appropriate.
