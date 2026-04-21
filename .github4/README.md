# Option 4: Custom Agent

This approach uses a single **custom agent** (`@app-builder`) that understands the full project lifecycle — from architecture to testing. You talk to the agent conversationally and it builds your application step by step.

## How It Works

Instead of running numbered prompts in sequence, you invoke a dedicated agent that:

1. Reads your app spec to understand requirements.
2. Makes tech stack and architecture decisions.
3. Scaffolds the project and populates `copilot-instructions.md` with project-specific conventions.
4. Implements features end-to-end (backend → frontend → tests → docs).
5. Tracks progress against `docs/requirements.md`.

The `copilot-instructions.md` file provides default conventions that are **always active** for all Copilot interactions — ensuring consistency even outside of agent sessions.

## Folder Structure

```
.github/
├── agents/
│   └── app-builder.agent.md    # Custom agent definition
├── copilot-instructions.md     # Default project conventions (always active)
└── README.md                   # This file
```

## Prerequisites

1. An **app spec markdown file** in your repository root (e.g., `Survey-App.md`, `Todo-App.md`) describing your application's requirements.
2. VS Code with GitHub Copilot Chat enabled.
3. Copilot Chat set to **Agent** mode.

## Usage

### Getting Started

Invoke the agent by typing `@app-builder` in Copilot Chat, followed by your request and the spec file:

```
@app-builder Build this app from scratch #file:Your-App-Spec.md
```

The agent will:
- Analyze the spec and choose an appropriate tech stack
- Create `docs/architecture.md` and `docs/requirements.md`
- Populate `.github/copilot-instructions.md` with project-specific details
- Scaffold the entire project

### Building Features

Once the project is set up, ask the agent to implement features:

```
@app-builder Implement user authentication
```

```
@app-builder Build the dashboard page with role-based views
```

```
@app-builder Add the API endpoints for managing surveys
```

The agent follows a consistent workflow for each feature:
1. Review the spec for relevant user stories
2. Plan the changes (data model → API → UI)
3. Implement backend then frontend
4. Write tests
5. Update documentation

### Checking Progress

```
@app-builder What features are left to implement?
```

```
@app-builder Review docs/requirements.md and summarize status
```

## How `copilot-instructions.md` Fits In

The `copilot-instructions.md` file serves as always-on default conventions:

- **During agent sessions**: The agent reads it and follows its conventions. During first-time setup, the agent populates the template sections with project-specific details.
- **Outside agent sessions**: Copilot automatically loads it for code completions, inline chat, and any other interaction — ensuring conventions are consistent whether or not you're talking to the agent.

## How This Differs from Other Options

| Aspect | Option 1 (2 Prompts) | Option 2 (8 Prompts) | Option 3 (Instructions + Prompt) | **Option 4 (Agent)** |
|--------|----------------------|---------------------|----------------------------------|---------------------|
| Interaction | Run prompts in order | Run 8 prompts in order | Run 1 prompt | Conversational |
| Granularity | 2 phases | 8 fine-grained phases | Single pass | Feature-by-feature |
| Convention enforcement | Embedded in prompts | Embedded in prompts | Instruction files | Agent persona + copilot-instructions |
| Flexibility | Low — fixed phases | Medium — skip phases | Medium — single prompt | High — ask for anything |
| Context retention | Per-prompt | Per-prompt | Per-prompt + instructions | Conversational memory |

## Customization

- **Edit the agent** (`app-builder.agent.md`) to change the workflow, conventions, or tool access.
- **Edit `copilot-instructions.md`** to adjust default conventions that apply everywhere.
- **Create additional agents** for specialized roles (e.g., `code-reviewer.agent.md`, `devops.agent.md`).

## Adapting to Your Project

1. Copy this folder into your repo as `.github/`.
2. Place your app spec markdown file in the repo root.
3. Run `@app-builder Build this app from scratch #file:Your-App-Spec.md` in Copilot Chat.
4. The agent reads the spec, sets up everything, and starts building.
