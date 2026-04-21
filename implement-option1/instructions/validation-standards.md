# Validation Standards

> Defines how each phase is validated against the application specification and architectural requirements.

## Validation Checklist

Every completed phase must pass the following checks:

### Functional Validation
- [ ] All requirements targeted by the phase are implemented
- [ ] Implemented features behave as described in `Survey-App.md`
- [ ] Requirement status is updated in `docs/requirements.md`

### Architectural Validation
- [ ] Component boundaries defined in `docs/architecture.md` are respected
- [ ] No cross-layer violations (e.g., UI components directly accessing data store)
- [ ] New code is placed in the correct directory per the project structure
- [ ] Imports follow the defined dependency rules

### Code Quality Validation
- [ ] TypeScript strict mode passes with no errors
- [ ] No `any` types introduced
- [ ] ESLint passes with no errors or warnings
- [ ] Code follows conventions in `instructions/development-guidelines.md`

### Test Validation
- [ ] New functionality has corresponding tests
- [ ] All existing tests continue to pass
- [ ] Test coverage does not decrease

### Documentation Validation
- [ ] `docs/requirements.md` status updated for completed requirements
- [ ] `project/roadmap.md` updated to reflect phase completion
- [ ] New architectural decisions recorded in `docs/decisions.md`

## Requirement Traceability

Each implemented feature should be traceable back to a specific requirement ID in `docs/requirements.md`. When marking a requirement as complete, verify:

1. The feature matches the description in the app spec (`Survey-App.md`)
2. The implementation covers edge cases described or implied
3. The feature is accessible through the expected user flow

## Regression Testing

Before marking a phase complete:

1. Run the full test suite: `npm run test`
2. Run the linter: `npm run lint`
3. Build the project: `npm run build`
4. Manually verify key user flows if applicable
