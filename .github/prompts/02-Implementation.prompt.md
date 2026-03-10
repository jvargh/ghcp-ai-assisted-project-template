---
name: 02-Implementation
description: Phased, milestone-based implementation guided by Survey-App.md, docs/requirements.md, and .github/copilot-instructions.md.
---

Begin the implementation using a phased, milestone-based approach. All work must align with `Survey-App.md`, `docs/requirements.md`, and the repository instructions, with `.github/copilot-instructions.md` serving as the primary implementation guide.

---

## Phase-Based Implementation Model

Organize the project into incremental phases, where each phase delivers a clearly defined part of the system and builds cleanly on previous work. Every phase must remain scoped, testable, and aligned with the documented architecture.

---

## Per-Phase Execution Requirements

### 1. Phase Planning

Before starting a phase:

- Define the phase objective and expected deliverables.
- Map planned work to `Survey-App.md` and `docs/requirements.md`.
- Identify the specific modules, components, services, routes, or infrastructure to be added or updated.
- Confirm dependencies from prior phases are complete.
- Keep the phase limited to a focused and achievable scope.

### 2. Implementation

Execute the work required for the current phase in accordance with the documented standards.

Implementation may include:

- Feature development
- UI components and pages
- Business logic and domain workflows
- API routes or service integrations
- State management and data handling
- Configuration and supporting infrastructure

All implementation must follow the project's architectural conventions:

- Modular structure
- Strict TypeScript usage
- Separation of concerns
- Reusable components
- Maintainable folder organization
- Consistency with `.github/copilot-instructions.md`

### 3. Validation and Testing

At the end of the phase, validate that the delivered work satisfies the documented requirements.

Validation should include:

- Functional verification of completed features
- Unit and integration testing where appropriate
- Validation against `docs/requirements.md`
- Confirmation that architectural boundaries remain intact
- Regression checks to ensure existing functionality is unaffected

> Any issues found during validation must be resolved before the phase is considered complete.

### 4. Documentation Updates

Once the phase is validated, update project documentation to reflect the current system state.

This includes, where applicable:

- Updating `docs/requirements.md` if scope or technical details evolved
- Documenting new modules, components, routes, or services
- Updating architecture or structural documentation
- Recording configuration or operational notes
- Updating guidance files if implementation workflow changed

**Documentation must remain synchronized with the actual implementation.**

### 5. Phase Completion

A phase is complete only when:

- [ ] All scoped deliverables are implemented
- [ ] Requirements are validated
- [ ] Tests pass
- [ ] The application builds and runs successfully
- [ ] Documentation is updated

Then mark the phase as complete.

### 6. Move to the Next Phase

After completing a phase:

1. Review the objectives of the next phase.
2. Confirm prerequisite work is already complete.
3. Proceed using the same workflow: **plan -> implement -> validate -> document -> complete**.

---

## Expected Execution Structure

Implementation should follow a structure similar to the planning approach:

| Concern                        | Source                                          |
| ------------------------------ | ----------------------------------------------- |
| Primary guidance               | `.github/copilot-instructions.md`               |
| Requirements baseline          | `docs/requirements.md`                          |
| Source requirements reference  | `Survey-App.md`                                 |
| Supporting guidance            | Additional files under `/instructions` if needed |

---

## Completion Criteria

Continue phase by phase until the full application is delivered.

The final state should ensure:

- All planned phases are completed.
- All requirements from `Survey-App.md` and `docs/requirements.md` are satisfied.
- Documentation accurately reflects the implemented system.
- The application is stable, maintainable, and ready for further development or deployment.