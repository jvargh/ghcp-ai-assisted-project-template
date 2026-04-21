# Option 5: Multi-Agent Specialization

This approach uses **multiple specialized agents**, each focused on a specific domain — mirroring a real development team. Each agent has its own expertise, scope restrictions, and tool access.

## How It Works

Instead of one agent doing everything, you invoke the right specialist for the job:

```
@architect → @backend-dev → @frontend-dev → @qa-engineer → @tech-writer
```

Each agent:
- Has a **defined scope** — it only works on files in its domain
- Reads **shared design documents** (`docs/`) as its source of truth
- Follows **project conventions** from `copilot-instructions.md` (always active)
- Provides a **handoff message** telling you which agent to invoke next

## Folder Structure

```
.github/
├── agents/
│   ├── architect.agent.md       # Architecture, tech stack, system design
│   ├── backend-dev.agent.md     # API, database, auth, business logic
│   ├── frontend-dev.agent.md    # UI components, pages, state management
│   ├── qa-engineer.agent.md     # Test strategy, implementation, coverage
│   └── tech-writer.agent.md     # Documentation, API docs, guides
├── copilot-instructions.md      # Default project conventions (always active)
└── README.md                    # This file
```

## Prerequisites

1. An **app spec markdown file** in your repository root (e.g., `Survey-App.md`, `Todo-App.md`) describing your application's requirements.
2. VS Code with GitHub Copilot Chat enabled.
3. Copilot Chat set to **Agent** mode.

## Workflow

### Phase 1: Architecture (`@architect`)

```
@architect Design the architecture for this app #file:Your-App-Spec.md
```

The architect will:
- Analyze the spec and choose a tech stack
- Create `docs/architecture.md`, `docs/data-model.md`, `docs/api-spec.md`
- Create `docs/requirements.md` with a feature checklist
- Populate `.github/copilot-instructions.md` with project-specific conventions

**Do not proceed to implementation until you've reviewed the architecture docs.**

### Phase 2: Backend (`@backend-dev`)

```
@backend-dev Scaffold and implement the backend
```

The backend dev will:
- Set up the backend project structure, dependencies, and configuration
- Implement the database schema matching `docs/data-model.md`
- Build API endpoints matching `docs/api-spec.md`
- Implement authentication, authorization, and middleware

You can also ask for specific features:
```
@backend-dev Implement the user authentication endpoints
```

### Phase 3: Frontend (`@frontend-dev`)

```
@frontend-dev Scaffold and implement the frontend
```

The frontend dev will:
- Set up the frontend project structure and dependencies
- Create the API client matching backend endpoints
- Build UI components, pages, and routing
- Implement state management and form handling

You can also ask for specific pages:
```
@frontend-dev Build the dashboard page with role-based views
```

### Phase 4: Testing (`@qa-engineer`)

```
@qa-engineer Create a test strategy and implement tests
```

The QA engineer will:
- Review `docs/requirements.md` to identify testable features
- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Write component tests for UI components
- Run tests and report coverage

You can also target specific areas:
```
@qa-engineer Write integration tests for the authentication API
```

### Phase 5: Documentation (`@tech-writer`)

```
@tech-writer Create project documentation
```

The tech writer will:
- Create/update `README.md` with setup and usage instructions
- Polish API documentation
- Create a deployment guide
- Create a contributing guide
- Verify all docs match the actual implementation

## Agent Scope Summary

| Agent | Creates/Modifies | Reads | Does NOT Touch |
|-------|-----------------|-------|---------------|
| `@architect` | `docs/`, `.github/copilot-instructions.md` | App spec | Application code |
| `@backend-dev` | `src/api/`, `src/models/`, `src/services/`, `src/middleware/`, `server/` | `docs/`, source code | Frontend files |
| `@frontend-dev` | `src/components/`, `src/pages/`, `src/hooks/`, `client/` | `docs/`, source code | Backend files |
| `@qa-engineer` | `**/*.test.*`, `tests/` | Everything | Source code (flags bugs) |
| `@tech-writer` | `docs/`, `README.md`, `CONTRIBUTING.md` | Everything | Application code |

## How `copilot-instructions.md` Fits In

The `copilot-instructions.md` file:
- Is **always loaded** for every Copilot interaction (agents, inline chat, completions)
- Gets **populated by `@architect`** during Phase 1 with project-specific details
- Provides a **shared reference** that all agents follow for coding standards and conventions
- Ensures consistency **between agent sessions** and during manual editing

## How This Differs from Other Options

| Aspect | Option 4 (Single Agent) | **Option 5 (Multi-Agent)** |
|--------|------------------------|---------------------------|
| Agents | 1 generalist | 5 specialists |
| Scope control | Agent handles everything | Each agent restricted to its domain |
| Expertise depth | Broad | Deep per domain |
| Workflow | Conversational | Sequential phases with handoffs |
| Scope creep risk | Higher | Lower — agents stay in their lane |
| Setup complexity | Low | Higher — 5 agent files |

## Customization

- **Add more agents** for additional roles (e.g., `devops.agent.md`, `security-reviewer.agent.md`).
- **Adjust scope** in each agent's "You only work on files in" section to match your folder structure.
- **Modify tool access** in the YAML frontmatter to restrict or expand what each agent can do.
- **Pair with instruction files** (from Option 3) for automatic convention enforcement between agent sessions.

## Adapting to Your Project

1. Copy this folder into your repo as `.github/`.
2. Place your app spec markdown file in the repo root.
3. Start with `@architect Design the architecture for this app #file:Your-App-Spec.md`.
4. Follow the workflow: architect → backend-dev → frontend-dev → qa-engineer → tech-writer.
