---
applyTo: "**/*.test.*"
---

# Testing Standards

## General Principles
- Every feature must have corresponding tests
- Tests should be independent — no shared mutable state between tests
- Use descriptive test names that explain the expected behavior
- Follow Arrange → Act → Assert pattern

## Unit Tests
- Test business logic functions in isolation
- Mock external dependencies (database, APIs, file system)
- Cover happy paths, edge cases, and error conditions
- Keep tests fast — no network calls or disk I/O

## Integration Tests
- Test API endpoints with a real or in-memory server
- Validate request validation, response shapes, and status codes
- Test authentication and authorization flows
- Use test fixtures or factories for consistent test data

## Component Tests (Frontend)
- Test components in isolation with React Testing Library (or equivalent)
- Test user interactions, not implementation details
- Prefer `getByRole`, `getByLabelText` over `getByTestId`
- Test accessibility: ensure ARIA roles and labels are correct

## Coverage
- Aim for meaningful coverage — not 100% for its own sake
- Critical paths (auth, payments, data mutations) must have thorough coverage
- Don't test trivial getters/setters or framework-provided behavior

## Naming Convention
- Test files live adjacent to the source: `module.ts` → `module.test.ts`
- Or in a mirrored `__tests__/` directory if preferred by the project
