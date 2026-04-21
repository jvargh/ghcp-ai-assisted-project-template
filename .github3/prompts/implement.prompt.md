---
name: Implement
description: Full project implementation driven by the app spec, with instruction files providing automatic context-aware conventions.
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.

Before starting any work, read and internalize the following instruction files for project conventions:
- `.github/instructions/coding-standards.instructions.md` — TypeScript standards for all `.ts`/`.tsx` files
- `.github/instructions/api-patterns.instructions.md` — API route, middleware, and security patterns
- `.github/instructions/database.instructions.md` — Data access, schema, and migration conventions
- `.github/instructions/testing.instructions.md` — Testing standards, naming, and coverage expectations
- `.github/instructions/ui-components.instructions.md` — UI component structure, styling, and accessibility

You are implementing a full application based on the attached app spec document. The `.github/copilot-instructions.md` file defines the global project context, and the instruction files listed above define context-specific conventions that must be followed throughout implementation.

---

## Your Responsibilities

### 1. Project Setup

Before writing any feature code:

- Read the attached app spec to understand the full scope.
- Set up the project structure (folders, config files, dependencies).
- Populate `.github/copilot-instructions.md` with project-specific details derived from the app spec (technology stack, business rules, roles).
- Create `docs/requirements.md` with a checklist of all features and constraints from the app spec.

### 2. Phased Implementation

Build the application incrementally. For each phase:

1. **Plan** — Define the phase scope and map it to requirements.
2. **Implement** — Write the code following the conventions enforced by instruction files:
   - `coding-standards.instructions.md` applies to all `.ts`/`.tsx` files
   - `api-patterns.instructions.md` applies to `src/api/**`
   - `database.instructions.md` applies to `src/models/**`
   - `testing.instructions.md` applies to all `*.test.*` files
   - `ui-components.instructions.md` applies to `src/components/**`
3. **Test** — Write tests that validate the phase deliverables.
4. **Validate** — Confirm requirements are met and the app builds/runs.
5. **Document** — Update `docs/requirements.md` and other docs as needed.

### 3. Phase Progression

A phase is complete when:
- [ ] All scoped features are implemented
- [ ] Tests pass
- [ ] The application builds and runs successfully
- [ ] Documentation is updated

Then proceed to the next phase following the same cycle.

---

## Completion Criteria

The project is done when:
- All requirements from the app spec and `docs/requirements.md` are satisfied.
- All instruction file conventions are followed throughout the codebase.
- The application is stable, tested, and documented.
