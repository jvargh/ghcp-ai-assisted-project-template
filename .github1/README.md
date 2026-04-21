# How to Use These Prompts

This folder contains reusable GitHub Copilot prompt files that guide AI-assisted project development from planning through implementation.

## Prerequisites

1. An **app spec markdown file** in your repository root (e.g., `Survey-App.md`, `Todo-App.md`, `E-Commerce-App.md`) describing your application's functional and product requirements.
2. VS Code with GitHub Copilot Chat enabled.

## Workflow

### Step 1: Scaffolding

Run the scaffolding prompt to generate project structure, documentation, and Copilot instructions — **no application code is written in this step**.

In Copilot Chat, type:

```
/01-Scaffolding #file:Your-App-Spec.md
```

This will produce:
- `docs/requirements.md` — technical requirements derived from your spec
- `docs/architecture.md` — system architecture documentation
- `.github/copilot-instructions.md` — populated with project-specific guidance
- Folder structure for `src/`, `tests/`, `config/`, etc.
- Governance and planning documents

### Step 2: Implementation

Once scaffolding is complete, run the implementation prompt to begin phased development:

```
/02-Implementation #file:Your-App-Spec.md
```

This will:
- Build the application in incremental phases
- Follow the architecture defined during scaffolding
- Validate each phase against `docs/requirements.md`
- Update documentation as the system evolves

## Key Files

| File | Role |
|------|------|
| `prompts/01-Scaffolding.prompt.md` | Planning & project structure generation |
| `prompts/02-Implementation.prompt.md` | Phased code implementation |
| `copilot-instructions.md` | Template for project-wide Copilot guidance (populated by Step 1) |

## Tips

- **Always attach your app spec** when running either prompt — it's the single source of truth.
- You can re-run Step 1 with a different app spec to scaffold an entirely different project.
- The `copilot-instructions.md` in `.github/` is a template; the scaffolding phase fills it with specifics from your app spec.
- Use separate git branches or worktrees if you want to try multiple approaches in parallel.
