# AI-Assisted Project Development: Options & Patterns

This template repository provides **6 progressively sophisticated approaches** for building applications with GitHub Copilot's customization features - prompts, instruction files, agents, and skills. Each option is **app-agnostic**: you supply your own spec file at runtime via `#file:`.

---

## Repository Structure

Each option lives in its own folder (`.github1/` through `.github6/`). To use an option, copy it into a new repo as `.github/` - or use the worktree workflow below.

```
├── .github1/          # Option 1: Two-Prompt Sequential
├── .github2/          # Option 2: 8-Prompt Pipeline
├── .github3/          # Option 3: Instruction Files + Single Prompt
├── .github4/          # Option 4: Custom Agent
├── .github5/          # Option 5: Multi-Agent Specialization
├── .github6/          # Option 6: Skills + Agent Orchestration
├── Survey-App.md      # Example app spec (use your own)
└── README.md          # This file
```

> Each option folder has its own `README.md` with detailed usage instructions.

---

## Getting Started

### Step 1: Pick a Use-Case

Choose a project idea from one of the 3 tiers below (ideally **Tier 3** for the best demonstration of Copilot's capabilities) and save the application spec as a markdown file in your repository root (e.g., `Your-App-Spec.md`):

| Tier | Level | Link |
| --- | --- | --- |
| Tier 1 | Beginner | [Beginner Projects](https://github.com/florinpop17/app-ideas#tier-1-beginner-projects) |
| Tier 2 | Intermediate | [Intermediate Projects](https://github.com/florinpop17/app-ideas?tab=readme-ov-file#tier-2-intermediate-projects) |
| Tier 3 | Expert | [Advanced Projects](https://github.com/florinpop17/app-ideas?tab=readme-ov-file#tier-3-advanced-projects) |

### Step 2: Pick an Option

Choose one of the 6 implementation options below based on your comfort level and project complexity.

### Step 3: Set Up Your Workspace

**Quick start - copy to a new repo:**
```bash
# Create a new repo, then copy the option folder as .github/
cp -r .github4/ my-project/.github/
cp Survey-App.md my-project/   # or your own spec file
cd my-project
```

**Worktree workflow - test options from this repo:**
```bash
# Create a branch and worktree for the option you want to test
git branch try-option6
git worktree add ../try-option6 try-option6
cd ../try-option6
# Rename .github6 to .github so Copilot recognizes it
mv .github6 .github
```

Then open the worktree folder in VS Code and ensure Copilot Chat is in **Agent** mode.

---

## Option 1: Two-Step Prompt Sequential Pattern (`.github1/`)

**Components:** `copilot-instructions.md` + 2 prompt files

```
.github1/
├── copilot-instructions.md          # Global conventions (populated during scaffolding)
├── prompts/
│   ├── 01-Scaffolding.prompt.md     # Scaffold project + generate design docs
│   └── 02-Implementation.prompt.md  # Implement the full application
└── README.md
```

**Usage:**
```
/01-Scaffolding #file:Your-App-Spec.md
/02-Implementation #file:Your-App-Spec.md
```

**Pros:** Simple, low setup cost, fast to get started
**Cons:** Context can be lost between prompts; no enforced conventions

---

## Option 2: Prompt Pipeline Pattern (`.github2/`)

**Components:** `copilot-instructions.md` + 8 prompt files (one per phase)

```
.github2/
├── copilot-instructions.md
├── prompts/
│   ├── 01-architecture.prompt.md        # Architecture decisions, tech stack
│   ├── 02-data-model.prompt.md          # Data models, DB schema, ERD
│   ├── 03-api-design.prompt.md          # API contracts, OpenAPI spec
│   ├── 04-scaffold.prompt.md            # Project skeleton, configs, dependencies
│   ├── 05-implement-backend.prompt.md   # API routes, services, data layer
│   ├── 06-implement-frontend.prompt.md  # UI components, pages, state
│   ├── 07-testing.prompt.md             # Unit/integration/e2e tests
│   └── 08-documentation.prompt.md       # README, deployment, user docs
└── README.md
```

**Usage:** Run prompts in order, each referencing your spec:
```
/01-architecture #file:Your-App-Spec.md
/02-data-model #file:Your-App-Spec.md
...
```

**Pros:** Reusable, version-controlled, each phase is focused
**Cons:** Manual invocation of each prompt; need to manage dependencies between steps

---

## Option 3: Single-Command Orchestrated Pattern - Instruction Files + Single Prompt (`.github3/`)

**Components:** `copilot-instructions.md` + 5 instruction files + 1 prompt

```
.github3/
├── copilot-instructions.md
├── instructions/
│   ├── coding-standards.instructions.md    # applyTo: "**/*.{ts,tsx}"
│   ├── api-patterns.instructions.md        # applyTo: "src/api/**"
│   ├── database.instructions.md            # applyTo: "src/models/**"
│   ├── testing.instructions.md             # applyTo: "**/*.test.*"
│   └── ui-components.instructions.md       # applyTo: "src/components/**"
├── prompts/
│   └── implement.prompt.md                 # Single prompt - reads all instructions upfront
└── README.md
```

Instruction files auto-apply by file pattern. The prompt also **explicitly reads** all instruction files upfront to ensure conventions are loaded even during prompt sessions.

**Usage:**
```
/implement #file:Your-App-Spec.md
```

**Pros:** Conventions enforced automatically on every interaction; dual enforcement (auto + explicit)
**Cons:** Instructions are passive when no matching files are open; still need a prompt to drive work

---

## Option 4: App Builder Custom Agent Pattern (`.github4/`)

**Components:** `copilot-instructions.md` + 1 custom agent

```
.github4/
├── copilot-instructions.md
├── agents/
│   └── app-builder.agent.md     # Full-stack generalist agent
└── README.md
```

```yaml
# app-builder.agent.md frontmatter
name: app-builder
description: "Full-stack application development agent - builds any app from a spec file."
tools: [execute, read, edit, search, todo]
```

The agent encapsulates the full lifecycle: project setup → feature implementation → testing.

**Usage:**
```
@app-builder Build this app from scratch #file:Your-App-Spec.md
@app-builder Implement the user authentication feature
```

**Pros:** Encapsulates full domain knowledge; enforces consistent workflow; conversational
**Cons:** Single agent doing everything can be broad; works best when paired with instruction files

---

## Option 5: Multi-Agent Collaboration Pattern (`.github5/`)

**Components:** `copilot-instructions.md` + 5 specialized agents

```
.github5/
├── copilot-instructions.md
├── agents/
│   ├── architect.agent.md       # Design docs only (no terminal access)
│   ├── backend-dev.agent.md     # Scoped to src/api/, src/models/, src/services/
│   ├── frontend-dev.agent.md    # Scoped to src/components/, src/pages/, src/hooks/
│   ├── qa-engineer.agent.md     # Tests only - flags bugs, doesn't fix app code
│   └── tech-writer.agent.md     # Documentation only (no terminal access)
└── README.md
```

Each agent has **scoped tool access** and **file boundaries**:

| Agent | Tools | Scope |
| --- | --- | --- |
| `@architect` | `read, edit, search` | Design docs only |
| `@backend-dev` | `execute, read, edit, search` | `src/api/`, `src/models/`, `src/services/` |
| `@frontend-dev` | `execute, read, edit, search` | `src/components/`, `src/pages/`, `src/hooks/` |
| `@qa-engineer` | `execute, read, edit, search` | Test files only |
| `@tech-writer` | `read, edit, search` | Documentation only |

**Workflow:** `@architect` → `@backend-dev` → `@frontend-dev` → `@qa-engineer` → `@tech-writer`

**Usage:**
```
@architect Design this app #file:Your-App-Spec.md
@backend-dev Implement the API from docs/api-spec.md
@frontend-dev Build the UI from docs/architecture.md
@qa-engineer Write tests for the application
@tech-writer Generate documentation
```

**Pros:** Each agent is focused; mirrors real team roles; prevents scope creep
**Cons:** More setup; need to manage handoff context between agents

---

## Option 6:Orchestrated Agent System with Skills Pattern (`.github6/`)

**Components:** `copilot-instructions.md` + 2 instruction files + 1 orchestrator agent + 2 prompts + 4 skills

```
.github6/
├── copilot-instructions.md
├── instructions/
│   ├── typescript.instructions.md         # applyTo: "**/*.{ts,tsx}"
│   └── security.instructions.md           # applyTo: "**/*.{ts,tsx,js,jsx}"
├── agents/
│   └── orchestrator.agent.md              # Orchestrates Design → Build → Quality
├── prompts/
│   ├── design-phase.prompt.md             # Generate architecture + data model + API spec
│   └── review-phase.prompt.md             # Code review against requirements
└── skills/
    ├── data-modeling/SKILL.md             # Generate DB schemas from design docs
    ├── api-generator/SKILL.md             # Generate API routes from spec
    ├── component-builder/SKILL.md         # Generate UI components from design
    └── test-generator/SKILL.md            # Generate tests from implementation
```

The orchestrator coordinates all layers through three phases:
1. **Design** - Runs `/design-phase` to generate architecture, data model, API spec, and requirements
2. **Build** - Invokes skills in order: data-modeling → api-generator → component-builder
3. **Quality** - Invokes test-generator, then runs `/review-phase` for code review

**Usage (orchestrator-driven):**
```
@orchestrator Build this app from scratch #file:Your-App-Spec.md
```

**Usage (individual components):**
```
/design-phase #file:Your-App-Spec.md
/review-phase
```

**Pros:** Maximum reusability; skills are portable across projects; layered convention enforcement
**Cons:** Highest setup investment; best suited for recurring/team-wide use

---

## Copilot Customization Layers Reference

| Layer | File | Behavior |
| --- | --- | --- |
| **Agent instructions** | `copilot-instructions.md` | Always loaded in every Copilot interaction |
| **Instruction files** | `*.instructions.md` | Auto-applied by `applyTo` file pattern |
| **Prompts** | `*.prompt.md` | On-demand via `/prompt-name` |
| **Custom agents** | `*.agent.md` | On-demand via `@agent-name` |
| **Skills** | `skills/<name>/SKILL.md` | Referenced by agents or prompts |

> **Important:** Agent tool declarations must use **aliases** (`execute`, `read`, `edit`, `search`, `todo`, `web`, `agent`), not internal tool names.

---

## Comparison Matrix

| Approach | Setup | Reusability | Team Scale | Context | Best For |
| --- | --- | --- | --- | --- | --- |
| **1. Two Prompts** | Minimal | Low | Low | Weak | Quick prototypes, learning |
| **2. Prompt Pipeline** | Low | Medium | Medium | Medium | Phased builds, repeatable projects |
| **3. Instructions + Prompt** | Medium | High | High | Strong | Team conventions, ongoing projects |
| **4. Single Agent** | Medium | Medium | Medium | Strong | Feature-driven development |
| **5. Multi-Agent** | High | High | High | Medium | Large projects, team simulation |
| **6. Skills + Orchestrator** | Highest | Highest | Highest | Strongest | Enterprise, reusable across projects |

---

## Recommendation

- **Learning Copilot?** Start with **Option 1** or **Option 2** to understand prompt workflows.
- **Solo development?** Use **Option 4** (single agent) + **Option 3** (instruction files) together.
- **Team standardization?** Graduate to **Option 6** and extract reusable skills.
- **Large projects?** Use **Option 5** to simulate team roles with scoped agents.