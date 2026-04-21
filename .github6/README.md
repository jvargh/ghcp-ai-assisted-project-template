# Option 6: Skills + Agent Orchestration (Full Stack)

The most comprehensive approach — combines all Copilot customization layers into a cohesive system. An orchestrator agent coordinates specialized skills, reusable prompts, and auto-applied instruction files to build a complete application.

## How It Works

This option layers every customization mechanism available:

| Layer | What It Does | When It Activates |
|-------|-------------|-------------------|
| **`copilot-instructions.md`** | Global project conventions | Always — every Copilot interaction |
| **Instruction files** | TypeScript and security rules | Auto-applied by file pattern |
| **Orchestrator agent** | Coordinates the full build lifecycle | When you invoke `@orchestrator` |
| **Prompts** | Reusable design and review workflows | When you run `/design-phase` or `/review-phase` |
| **Skills** | Domain-specific generators | Referenced by the orchestrator or used directly |

Skills are the key differentiator — they are **portable, composable knowledge modules** that can be reused across projects. Each skill encapsulates how to generate a specific type of artifact (schemas, APIs, components, tests).

## Folder Structure

```
.github/
├── copilot-instructions.md                # Global conventions (always active)
├── instructions/
│   ├── typescript.instructions.md         # applyTo: "**/*.{ts,tsx}"
│   └── security.instructions.md           # applyTo: "**/*.{ts,tsx,js,jsx}"
├── agents/
│   └── orchestrator.agent.md              # Orchestrator agent
├── prompts/
│   ├── design-phase.prompt.md             # Architecture + data model + API design
│   └── review-phase.prompt.md             # Code review against requirements
└── skills/
    ├── data-modeling/
    │   └── SKILL.md                       # Generate database schemas from design docs
    ├── api-generator/
    │   └── SKILL.md                       # Generate API routes from spec
    ├── component-builder/
    │   └── SKILL.md                       # Generate UI components from design
    └── test-generator/
        └── SKILL.md                       # Generate tests from implementation
```

## Prerequisites

1. An **app spec markdown file** in your repository root (e.g., `Survey-App.md`, `Todo-App.md`) describing your application's requirements.
2. VS Code with GitHub Copilot Chat enabled.
3. Copilot Chat set to **Agent** mode.

## Workflow

### Option A: Let the Orchestrator Drive Everything

```
@orchestrator Build this app from scratch #file:Your-App-Spec.md
```

The orchestrator will:
1. **Design** — Run the design-phase workflow (architecture, data model, API spec)
2. **Gate** — Present design docs for your review before building
3. **Build** — Invoke skills in order: data-modeling → api-generator → component-builder
4. **Quality** — Invoke test-generator, then run the review-phase workflow
5. **Complete** — Verify all requirements are met

### Option B: Run Components Individually

You can also use each layer independently:

**Design only:**
```
/design-phase #file:Your-App-Spec.md
```

**Review only:**
```
/review-phase #file:Your-App-Spec.md
```

**Ask the orchestrator for a specific phase:**
```
@orchestrator Run the data-modeling skill to generate the database schema
```

```
@orchestrator Run the api-generator skill for the authentication endpoints
```

## Component Details

### Instruction Files (Always Active)

| File | Pattern | What It Enforces |
|------|---------|-----------------|
| `typescript.instructions.md` | `**/*.{ts,tsx}` | Strict types, async/await, naming, imports |
| `security.instructions.md` | `**/*.{ts,tsx,js,jsx}` | Input validation, auth, XSS prevention, secrets |

These apply automatically during any Copilot interaction — completions, chat, agents, prompts.

### Prompts (On-Demand Workflows)

| Prompt | Purpose | Usage |
|--------|---------|-------|
| `design-phase.prompt.md` | Generate architecture, data model, and API spec | `/design-phase #file:Spec.md` |
| `review-phase.prompt.md` | Review code against requirements and conventions | `/review-phase` |

Both prompts explicitly read instruction files upfront for convention awareness.

### Skills (Specialized Generators)

| Skill | Input | Output |
|-------|-------|--------|
| **data-modeling** | `docs/data-model.md` | Schema files, migrations, seed scripts |
| **api-generator** | `docs/api-spec.md` | Routes, services, middleware, validators |
| **component-builder** | `docs/architecture.md`, `docs/api-spec.md` | Components, pages, routing, state, API client |
| **test-generator** | Source code, `docs/requirements.md` | Unit, integration, and component tests |

Skills are **portable** — they work with any app spec and any tech stack (the skill reads the architecture doc to determine which tools to use).

### Orchestrator Agent

The `@orchestrator` ties everything together:
- Reads the app spec and instruction files upfront
- Drives the 3-phase workflow: Design → Build → Quality
- Invokes skills in the correct order with proper inputs
- Gates design approval before building
- Tracks progress against `docs/requirements.md`

## How This Differs from Other Options

| Aspect | Option 4 (Single Agent) | Option 5 (Multi-Agent) | **Option 6 (Full Stack)** |
|--------|------------------------|------------------------|--------------------------|
| Agents | 1 generalist | 5 specialists | 1 orchestrator |
| Skills | None | None | 4 specialized skills |
| Prompts | None | None | 2 reusable prompts |
| Instructions | copilot-instructions only | copilot-instructions only | copilot-instructions + 2 instruction files |
| Reusability | Agent per project | Agents per project | Skills portable across projects |
| Convention enforcement | Agent persona | Agent scope restrictions | Layered: instructions + prompts + agent |
| Setup complexity | Low | Medium | Highest |
| Best for | Solo/quick projects | Team role simulation | Recurring use, team-wide standards |

## Customization

### Add More Skills
Create a new `skills/<name>/SKILL.md` for any repeatable generation task:
- `deployment/SKILL.md` — Generate CI/CD pipelines and Docker configs
- `documentation/SKILL.md` — Generate API docs and user guides
- `migration/SKILL.md` — Generate database migration scripts

### Add More Instruction Files
- `testing.instructions.md` with `applyTo: "**/*.test.*"` for test conventions
- `api.instructions.md` with `applyTo: "src/api/**"` for API conventions

### Add More Prompts
- `migration-phase.prompt.md` — Database migration workflow
- `deploy-phase.prompt.md` — Deployment preparation workflow

## Adapting to Your Project

1. Copy this folder into your repo as `.github/`.
2. Place your app spec markdown file in the repo root.
3. Run `@orchestrator Build this app from scratch #file:Your-App-Spec.md`.
4. The orchestrator reads the spec, runs the design phase, and builds using skills.
