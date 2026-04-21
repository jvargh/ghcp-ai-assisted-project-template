# Option 3: Instruction Files + Single Prompt

This approach uses `.instructions.md` files combined with a single implementation prompt. Conventions are enforced in two ways:

1. **Explicitly** — The prompt reads all instruction files upfront before starting any work.
2. **Automatically** — Instruction files also activate via `applyTo` glob patterns during ongoing Copilot interactions (completions, edits, follow-up chats).

This dual approach ensures conventions are applied both during prompt-driven implementation and during any subsequent Copilot-assisted work in the editor.

## How It Works

Unlike Option 2 (multiple prompts for scaffolding + implementation), this option relies on:

1. **`copilot-instructions.md`** — Global project context, always loaded by Copilot.
2. **Instruction files** — Context-specific conventions loaded explicitly by the prompt at the start, and also activated automatically via `applyTo` patterns during later interactions.
3. **One prompt** — A single `implement.prompt.md` that drives the entire build process.

## Folder Structure

```
.github/
├── copilot-instructions.md                 # Global project conventions (always active)
├── instructions/
│   ├── coding-standards.instructions.md    # applyTo: "**/*.{ts,tsx}"
│   ├── api-patterns.instructions.md        # applyTo: "src/api/**"
│   ├── database.instructions.md            # applyTo: "src/models/**"
│   ├── testing.instructions.md             # applyTo: "**/*.test.*"
│   └── ui-components.instructions.md       # applyTo: "src/components/**"
├── prompts/
│   └── implement.prompt.md                 # Single prompt for full implementation
└── README.md                               # This file
```

## Prerequisites

1. An **app spec markdown file** in your repository root (e.g., `Survey-App.md`, `Todo-App.md`) describing your application's requirements.
2. VS Code with GitHub Copilot Chat enabled.

## Usage

### Step 1: Run the Implementation Prompt

In Copilot Chat, type:

```
/implement #file:Your-App-Spec.md
```

This single prompt will:
- **Read all 5 instruction files** upfront to load conventions into context
- Read your app spec and set up the project structure
- Populate `copilot-instructions.md` with your project's specifics
- Create `docs/requirements.md` from the app spec
- Implement the application in phases, validating as it goes

### Step 2: Instruction Files Stay Active After the Prompt

Once the project is set up, instruction files continue to apply automatically during any Copilot interaction:

| File you're editing | Instructions that apply |
|---|---|
| Any `.ts` or `.tsx` file | `coding-standards.instructions.md` |
| Files in `src/api/` | `api-patterns.instructions.md` |
| Files in `src/models/` | `database.instructions.md` |
| Any `.test.*` file | `testing.instructions.md` |
| Files in `src/components/` | `ui-components.instructions.md` |

You don't need to reference these — Copilot loads them based on what file you're working in.

## How This Differs from Option 2

| Aspect | Option 2 (Prompts) | Option 3 (Instructions + Prompt) |
|--------|--------------------|---------------------------------|
| Prompts | 2 (scaffolding + implementation) | 1 (implementation only) |
| Convention enforcement | Manual — embedded in prompts | Dual: explicit load in prompt + automatic pattern matching |
| Context-aware guidance | Same rules everywhere | Different rules per file type |
| Setup complexity | Lower | Slightly higher (more files) |
| Ongoing benefit | Must re-run prompts | Instructions always active in editor |

## Customization

- **Add more instruction files** for additional patterns (e.g., `deployment.instructions.md` with `applyTo: "infra/**"`).
- **Adjust `applyTo` patterns** to match your project's folder structure.
- **Edit `copilot-instructions.md`** after scaffolding to refine project-specific rules.

## Adapting to Your Project

To use this with **any** app spec:

1. Copy this folder into your repo as `.github/`.
2. Place your app spec markdown file in the repo root.
3. Run `/implement #file:Your-App-Spec.md` in Copilot Chat.
4. The prompt reads all instruction files, then populates the generic templates with your project's specifics.
