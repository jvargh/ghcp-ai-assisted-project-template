# AI-Assisted Project Development: Options & Patterns

This guide outlines multiple approaches for building a project using GitHub Copilot's customization features - prompts, instruction files, agents, and skills - ranging from simple to fully orchestrated.

---

## Getting Started

### Step 1: Pick a Use-Case

Choose a project idea from one of the 3 tiers below (based on your comfort level):

| Tier | Level | Link |
| --- | --- | --- |
| Tier 1 | Beginner | [Beginner Projects](https://github.com/florinpop17/app-ideas#tier-1-beginner-projects) |
| Tier 2 | Intermediate | [Intermediate Projects](https://github.com/florinpop17/app-ideas?tab=readme-ov-file#tier-2-intermediate-projects) |
| Tier 3 | Expert | [Advanced Projects](https://github.com/florinpop17/app-ideas?tab=readme-ov-file#tier-3-advanced-projects) |

### Step 2: Pick a Pattern

Once you have your use-case, choose one of the development patterns below (Option 1 onwards) to build it with GitHub Copilot. Each option increases in sophistication - start simple and graduate to more advanced patterns as needed.

---

## Option 1: Two-Prompt Sequential

**Components:** 2 prompts (manual, ad-hoc)

| Phase | Action |
| --- | --- |
| Prompt 1 | "Given these requirements, generate the project scaffold, architecture doc, API spec, data model, and tech stack decisions" |
| Prompt 2 | "Based on the documents generated, implement the full application" |

**Pros:** Simple, low setup cost  
**Cons:** Context can be lost between prompts; no enforced conventions; relies on prompt quality each time

---

## Option 2: Prompt Files Pipeline (`.prompt.md`)

**Components:** Multiple reusable `.prompt.md` files, one per phase

Create a series of prompt files that can be invoked in sequence:

```
.github/prompts/
├── 01-architecture.prompt.md       # Generate architecture decisions, tech stack, folder structure
├── 02-data-model.prompt.md         # Generate data models, DB schema, ERD
├── 03-api-design.prompt.md         # Generate API contracts, OpenAPI spec
├── 04-scaffold.prompt.md           # Generate project skeleton, configs, dependencies
├── 05-implement-backend.prompt.md  # Implement API routes, services, data layer
├── 06-implement-frontend.prompt.md # Implement UI components, pages, state management
├── 07-testing.prompt.md            # Generate unit/integration/e2e tests
└── 08-documentation.prompt.md      # Generate README, deployment guide, user docs
```

Each prompt file references the requirements and outputs from prior steps. Example:

```
---
mode: agent
description: "Generate API design from architecture docs"
---
Given the Survey App requirements in Survey-App.md and the architecture
decisions in docs/architecture.md, generate a complete REST API specification...
```

**Pros:** Reusable, version-controlled, shareable across team, each phase is focused  
**Cons:** Manual invocation of each prompt; need to manage dependencies between steps

---

## Option 3: Instruction Files + Single Prompt

**Components:** `.instructions.md` files + `copilot-instructions.md` + 1 prompt

Set up project-level instruction files that automatically load and guide all Copilot interactions:

```
.github/
├── copilot-instructions.md                 # Global project conventions
├── instructions/
│   ├── coding-standards.instructions.md    # applyTo: "**/*.{ts,tsx}"
│   ├── api-patterns.instructions.md        # applyTo: "src/api/**"
│   ├── database.instructions.md            # applyTo: "src/models/**"
│   ├── testing.instructions.md             # applyTo: "**/*.test.*"
│   └── ui-components.instructions.md       # applyTo: "src/components/**"
```

Example `copilot-instructions.md`:

```
This is a Survey App built with React + Node.js + PostgreSQL.
- Two roles: Survey Coordinator (admin) and Survey Respondent (user)
- Use TypeScript throughout, strict mode
- REST API with Express, Prisma ORM
- React with React Router, Zustand for state
- All components must be accessible (WCAG 2.1 AA)
- Use role-based access control for coordinator vs respondent features
```

Then a single prompt drives all implementation, with instructions automatically applying context-aware conventions.

**Pros:** Conventions enforced automatically on every interaction; great for team consistency  
**Cons:** Instructions are passive (only apply when relevant files are touched); still need a prompt to drive work

---

## Option 4: Custom Agent (`.agent.md`)

**Components:** 1 custom agent + requirements doc

Create a dedicated agent that understands the full project lifecycle:

```
.github/agents/
└── survey-app-builder.agent.md
```

```
---
name: survey-app-builder
description: "Full-stack Survey App development agent"
tools: ["run_in_terminal", "create_file", "replace_string_in_file", "semantic_search"]
---

You are a senior full-stack developer building a Survey App.

## Context
- Requirements: Survey-App.md
- Two user roles: Survey Coordinator, Survey Respondent
- Tech stack: React 18 + TypeScript, Node.js + Express, PostgreSQL + Prisma

## Workflow
When asked to build a feature:
1. Review requirements in Survey-App.md for the relevant user stories
2. Design the data model changes needed
3. Implement backend (model → service → route → middleware)
4. Implement frontend (component → page → routing → state)
5. Write tests for both layers
6. Update API documentation

## Conventions
- RESTful API design, consistent error handling
- All endpoints require authentication; coordinator endpoints require admin role
- React components: functional with hooks, no class components
- File naming: kebab-case for files, PascalCase for components
```

Usage: `@survey-app-builder implement the survey creation feature`

**Pros:** Encapsulates full domain knowledge; enforces a consistent workflow; reusable across features  
**Cons:** Single agent doing everything can be broad; works best when paired with instruction files

---

## Option 5: Multi-Agent Specialization

**Components:** Multiple custom agents, each specialized for a domain

```
.github/agents/
├── architect.agent.md       # Architecture decisions, tech stack, system design
├── backend-dev.agent.md     # API implementation, database, authentication
├── frontend-dev.agent.md    # UI components, pages, state management
├── qa-engineer.agent.md     # Test strategy, test implementation, coverage analysis
└── tech-writer.agent.md     # Documentation, API docs, deployment guides
```

Each agent has its own tool restrictions and expertise:

```
# backend-dev.agent.md
---
name: backend-dev
description: "Backend developer for Survey App"
tools: ["run_in_terminal", "create_file", "replace_string_in_file"]
---
You are a backend developer specializing in Node.js + Express + Prisma.
You only work on files in src/api/, src/models/, src/services/, src/middleware/.
Always check existing code patterns before creating new files.
Refer to docs/api-spec.md for API contracts.
```

Workflow: `@architect` → `@backend-dev` → `@frontend-dev` → `@qa-engineer` → `@tech-writer`

**Pros:** Each agent is focused and expert; mirrors real team roles; prevents scope creep  
**Cons:** More setup; need to manage handoff context between agents

---

## Option 6: Skills + Agent Orchestration (Full Stack)

**Components:** Custom skills + orchestrator agent + instruction files

This is the most comprehensive approach, combining all customization layers:

```
.github/
├── copilot-instructions.md                # Global conventions (auto-loaded)
├── instructions/
│   ├── typescript.instructions.md         # TS conventions (auto-applied)
│   └── security.instructions.md           # Security rules (auto-applied)
├── agents/
│   └── survey-orchestrator.agent.md       # Orchestrator agent
├── prompts/
│   ├── design-phase.prompt.md             # Reusable design prompt
│   └── review-phase.prompt.md             # Code review prompt
└── skills/
    ├── data-modeling/
    │   └── SKILL.md                       # Generate Prisma schemas from requirements
    ├── api-generator/
    │   └── SKILL.md                       # Generate Express routes from API specs
    ├── component-builder/
    │   └── SKILL.md                       # Build React components from wireframes
    └── test-generator/
        └── SKILL.md                       # Generate tests from implementation
```

The orchestrator agent coordinates everything:

```
# survey-orchestrator.agent.md
---
name: survey-orchestrator
description: "Orchestrates full Survey App development lifecycle"
---
You coordinate the Survey App build using specialized skills.

## Phase 1: Design
- Use /design-phase prompt to generate architecture + data model + API spec
- Validate against requirements in Survey-App.md

## Phase 2: Build
- Invoke data-modeling skill for Prisma schema
- Invoke api-generator skill for Express routes
- Invoke component-builder skill for React UI

## Phase 3: Quality
- Invoke test-generator skill for test suites
- Use /review-phase prompt for code review

Always check .github/instructions/ for applicable coding standards.
```

**Pros:** Maximum reusability; skills are portable across projects; layered conventions; clear separation of concerns  
**Cons:** Highest setup investment; best suited for recurring/team-wide use

---

## Comparison Matrix

| Approach | Setup Effort | Reusability | Team Scalability | Context Continuity | Best For |
| --- | --- | --- | --- | --- | --- |
| **1\. Two Prompts** | Minimal | Low | Low | Weak | Quick prototypes, solo dev |
| **2\. Prompt Pipeline** | Low | Medium | Medium | Medium | Phased builds, repeatable projects |
| **3\. Instructions + Prompt** | Medium | High | High | Strong (auto-loaded) | Team conventions, ongoing projects |
| **4\. Single Custom Agent** | Medium | Medium | Medium | Strong | Feature-driven development |
| **5\. Multi-Agent** | High | High | High | Medium (handoff needed) | Large projects, team simulation |
| **6\. Skills + Orchestrator** | Highest | Highest | Highest | Strongest | Enterprise, reusable across projects |

---

## Recommendation

Start with **Option 4** (single custom agent) + **Option 3** (instruction files). This gives you an agent that knows the domain deeply, with instruction files enforcing conventions automatically. As the project matures or if you plan to reuse patterns, graduate to **Option 6** by extracting reusable skills.