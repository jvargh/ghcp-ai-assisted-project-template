# Test Generator Skill

Generate comprehensive test suites from implementation code and design documents.

## When to Use

Use this skill when you need to:
- Generate unit tests for services and utilities
- Generate integration tests for API endpoints
- Generate component tests for UI components
- Analyze and improve test coverage

## Inputs

This skill requires:
1. `docs/requirements.md` — Feature checklist and acceptance criteria
2. `docs/api-spec.md` — API contracts for integration tests
3. `docs/data-model.md` — Entity rules for validation tests
4. Source code — The implementation to test
5. `docs/architecture.md` — Testing tools and framework choices

## Process

### Step 1: Set Up Test Infrastructure
- Configure the test runner (Vitest, Jest, etc.) as specified in `docs/architecture.md`
- Create test utilities:
  - **Test factories** — Functions to generate valid test data for each entity
  - **Mock helpers** — Reusable mocks for database, API calls, auth
  - **Test setup** — Database reset, auth token generation, app bootstrap
- Create `.env.test` for test environment configuration

### Step 2: Generate Unit Tests
For each service/utility module:

**Business logic tests:**
- Test each function with valid inputs (happy path)
- Test boundary values (min/max lengths, empty arrays, zero values)
- Test invalid inputs (wrong types, missing fields, out-of-range)
- Test error conditions (not found, unauthorized, conflict)
- Test state transitions (valid and invalid)

**Utility tests:**
- Test pure functions with various inputs
- Test edge cases (null, undefined, empty string, special characters)

### Step 3: Generate Integration Tests
For each API endpoint in `docs/api-spec.md`:

**Success cases:**
- Test with valid request and correct auth → expected status code and response shape
- Test with different roles to verify authorization

**Auth tests:**
- Test without auth token → 401
- Test with expired/invalid token → 401
- Test with wrong role → 403

**Validation tests:**
- Test missing required fields → 400/422
- Test invalid field types → 400/422
- Test boundary values → appropriate error

**Business rule tests:**
- Test domain constraints (e.g., can't transition from closed to open)
- Test uniqueness constraints (e.g., duplicate submission)
- Test relationship constraints (e.g., referenced entity must exist)

### Step 4: Generate Component Tests
For each UI component:

**Rendering tests:**
- Test renders with required props
- Test renders with various prop combinations
- Test conditional rendering based on state/props

**Interaction tests:**
- Test button clicks trigger expected actions
- Test form submissions with valid and invalid data
- Test navigation and routing

**State tests:**
- Test loading state displays correctly
- Test error state displays error message
- Test empty state displays appropriate message

**Accessibility tests:**
- Test ARIA roles and labels are present
- Test keyboard navigation works
- Test form inputs have associated labels

### Step 5: Run and Analyze
- Execute the full test suite
- Report: total tests, passing, failing, skipped
- Identify untested critical paths
- Prioritize gaps by risk

## Output

| Location | Contents |
|----------|----------|
| `src/**/*.test.ts` | Colocated unit and component tests |
| `tests/integration/` | API integration tests |
| `tests/helpers/` or `test-utils/` | Factories, mocks, setup |
| Test config file | Runner configuration |

## Conventions

- **Naming**: `should [expected behavior] when [condition]`
- **Pattern**: Arrange → Act → Assert
- **Isolation**: Each test runs independently — no shared mutable state
- **Data**: Use factories — no magic strings or hardcoded IDs
- **Mocking**: Mock at the boundary (database, external APIs) — not internal modules
- **Focus**: One behavior per test (multiple expects are fine if testing one concept)
- **Coverage priority**: Auth → data mutations → business rules → CRUD → UI display
