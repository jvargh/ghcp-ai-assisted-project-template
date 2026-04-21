---
mode: agent
description: "Generate unit, integration, and e2e tests"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/07-testing #file:Your-App-Spec.md`

# Phase 7: Testing

Given the implemented backend and frontend code, the app spec, and the documentation in `docs/`, generate comprehensive tests.

## Test Strategy

### 1. Backend Unit Tests
Use a test framework appropriate to the tech stack (from `docs/architecture.md`) to test:

**Services:**
- Test every service function for each domain entity
- Cover CRUD operations, status transitions, and business rule validations
- Edge cases: duplicate operations, invalid state transitions, constraint violations

**Middleware:**
- Auth middleware: valid token, expired token, missing token, invalid format
- Role middleware: test access for each role defined in the app spec, plus unauthorized access
- Error handler: known errors, unknown errors, validation errors

### 2. Backend Integration Tests
Test full request/response cycles against a test database:

- **Auth flow:** Register → Login → Access protected route
- **Domain lifecycle:** Walk through the primary user workflows described in the app spec end-to-end
- **Authorization:** Verify each role can only access its permitted endpoints
- **Validation:** Reject invalid or incomplete input as defined by business rules

### 3. Frontend Unit Tests
Use a test framework with a component testing library:

- **Components:** Render correctly with required props, handle empty states
- **Forms:** Validate client-side rules matching the app spec's business constraints
- **Pages:** Render with mocked API data, handle loading/error states

### 4. Frontend Integration Tests
- **Auth flow:** Login form submits, auth persisted, redirected to dashboard
- **Primary user flows:** Walk through each role's main workflow from the app spec
- **Results/Reports:** Navigate to results views, verify data displayed

### 5. Test Configuration
- Create test configuration files appropriate to the chosen test framework
- Set up test utilities and helpers (mock factories, test database setup)
- Add test scripts to the package manager configuration

## Conventions
- Each test file should live alongside the source file it tests (co-located)
- Use descriptive test names derived from user stories in the app spec
- Mock external dependencies (database, API) at the boundary
- Aim for high coverage on business logic (services), lower bar on UI rendering

Generate the tests and verify they can be discovered by the test runner (they don't need to pass yet if the app isn't fully wired).
