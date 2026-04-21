---
mode: agent
description: "Implement API routes, services, and data layer for the backend"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/05-implement-backend #file:Your-App-Spec.md`

# Phase 5: Backend Implementation

Given the application requirements in the attached spec file (referred to as **"the app spec"**), the architecture in `docs/architecture.md`, the data model in `docs/data-model.md`, the API spec in `docs/api-spec.md`, and the project scaffold, implement the full backend application.

## Implementation Order

Follow this order to manage dependencies between modules:

### Step 1: Database & Configuration
- Finalize the database schema/ORM configuration with all models, relations, and indexes from `docs/data-model.md`
- Create a seed script with sample data covering all user roles and domain entities
- Implement configuration — env vars, database connection, app constants

### Step 2: Authentication & Middleware
- Implement authentication (register, login, token/session management) as defined in `docs/architecture.md`
- Implement role-based authorization middleware for each role identified in the app spec
- Implement error handling middleware with consistent error response format from `docs/api-spec.md`
- Implement request validation middleware

### Step 3: Core Domain Features
For each user role described in the app spec, implement the features assigned to that role:
- Create services for every CRUD operation and state transition
- Create routes matching every endpoint in `docs/api-spec.md`
- Enforce role-based access as documented
- Implement business rules and validations from the app spec's user stories

### Step 4: Aggregations & Reports
- Implement any results, summaries, or analytics features described in the app spec
- Ensure appropriate access control

### Step 5: App Assembly
- Wire all routes into the application entry point
- Add CORS configuration
- Add request logging

## Conventions
- Every service function should handle errors and throw typed errors
- Use database transactions where multiple writes are needed
- Input validation on all endpoints (reject malformed requests early)
- Never expose internal error details to clients in production
- Use async/await throughout, no callbacks

After implementation, install dependencies and verify the server starts without errors.
