---
name: review-phase
description: "Code review against requirements, conventions, and security standards."
---

> **Usage:** Run this prompt after implementation is complete to review the codebase.
> Optionally attach your app spec: `/review-phase #file:Your-App-Spec.md`

Before starting, read the instruction files for project conventions:
- `.github/instructions/typescript.instructions.md`
- `.github/instructions/security.instructions.md`

# Code Review Phase

Perform a comprehensive code review of the current implementation against the project's design documents and conventions.

---

## Step 1: Requirements Coverage

Read `docs/requirements.md` and verify each feature:

- [ ] Is the feature implemented?
- [ ] Does it match the acceptance criteria from the app spec?
- [ ] Are edge cases handled?

Produce a **coverage summary**:
```
✅ Implemented: X features
⚠️ Partial: Y features (list what's missing)
❌ Missing: Z features
```

---

## Step 2: Architecture Compliance

Compare the implementation against `docs/architecture.md`:

- Does the folder structure match the design?
- Is the tech stack used as specified?
- Are architectural boundaries respected (separation of concerns)?
- Is the data model implemented as designed in `docs/data-model.md`?
- Do API endpoints match `docs/api-spec.md`?

---

## Step 3: TypeScript Conventions

Check all `.ts`/`.tsx` files against `instructions/typescript.instructions.md`:

- Strict mode enabled?
- Any `any` types?
- Proper use of `const`/`let`?
- Explicit return types on exports?
- Async/await used correctly?
- Import organization?

---

## Step 4: Security Review

Check all code against `instructions/security.instructions.md`:

- Input validation on all endpoints?
- Parameterized queries (no SQL injection)?
- Passwords hashed properly?
- No secrets in code or client bundles?
- CORS configured correctly?
- Error responses don't leak internals?
- XSS prevention in place?

---

## Step 5: Code Quality

General quality checks:

- No dead code or commented-out blocks
- No TODO/FIXME items left unaddressed
- Consistent naming conventions
- Functions are small and single-purpose
- Error handling is comprehensive
- Loading/error/empty states handled in UI

---

## Step 6: Test Coverage

Review test files:

- Do critical paths have tests (auth, data mutations, business rules)?
- Are tests independent and descriptive?
- Do integration tests cover all API endpoints?
- Do component tests cover user interactions?

---

## Output

Produce a **review report** with:

### Summary
- Overall assessment (Ready / Needs Work / Critical Issues)
- Number of issues by severity (Critical / Warning / Suggestion)

### Issues
For each issue:
- **File**: path to the file
- **Severity**: Critical / Warning / Suggestion
- **Issue**: what's wrong
- **Fix**: recommended resolution

### Recommendations
- Priority-ordered list of improvements
- Quick wins vs. larger refactors

Update `docs/requirements.md` with the review findings.
