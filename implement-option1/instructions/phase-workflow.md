# Phase Workflow

> Defines how implementation phases are executed, tracked, and validated.

## Phase Execution Process

Each implementation phase follows this workflow:

### 1. Planning
- Review the phase objectives in `project/roadmap.md`
- Identify the requirements from `docs/requirements.md` covered by the phase
- Review architectural constraints in `docs/architecture.md`
- Break the phase into discrete, testable tasks

### 2. Implementation
- Implement features according to the planned tasks
- Follow coding standards defined in `development-guidelines.md`
- Respect architectural boundaries defined in `docs/architecture.md`
- Write code that is testable and well-typed

### 3. Testing
- Write unit tests for new domain logic and utilities
- Write component tests for new UI components
- Write API integration tests for new endpoints
- Ensure all existing tests continue to pass

### 4. Validation
- Verify all phase requirements are met (see `validation-standards.md`)
- Update requirement status in `docs/requirements.md`
- Update the roadmap in `project/roadmap.md`

### 5. Documentation
- Update or add architectural decision records in `docs/decisions.md` if new decisions were made
- Ensure inline code documentation is adequate
- Update any affected planning documents

## Phase Dependencies

Phases should be completed sequentially. Each phase builds on the outputs of the previous phase:

```
Phase 1: Project Initialization & Infrastructure
    ↓
Phase 2: Core Survey Engine & Domain Models
    ↓
Phase 3: UI Components & User Interaction Flows
    ↓
Phase 4: Survey Creation & Response Management
    ↓
Phase 5: Data Persistence & Integration
    ↓
Phase 6: Testing & Stabilization
```

## Completion Criteria

A phase is considered complete when:

1. All planned tasks are implemented
2. All related tests pass
3. Requirements covered by the phase are marked as implemented in `docs/requirements.md`
4. No regressions in existing functionality
5. Documentation is updated
