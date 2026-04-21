---
mode: agent
description: "Generate README, deployment guide, and user documentation"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/08-documentation #file:Your-App-Spec.md`

# Phase 8: Documentation

Given the complete application codebase, the app spec, and existing docs in `docs/`, generate comprehensive project documentation.

## Deliverables

### 1. Project README (`README.md`)
Replace or update the root README with:
- Project title and description (derived from the app spec)
- Features list (mapped to user stories from the app spec)
- Tech stack summary with versions (from `docs/architecture.md`)
- Prerequisites
- Quick start guide:
  1. Clone the repo
  2. Install dependencies
  3. Set up environment variables (reference `.env.example`)
  4. Run database migrations and seed
  5. Start development servers
- Available scripts (build, test, lint, format)
- Project structure overview (directory tree with descriptions)

### 2. Deployment Guide (`docs/deployment.md`)
- Production build steps for backend and frontend
- Environment variable reference (all required vars with descriptions)
- Database setup for production (migrations, connection pooling)
- Deployment options:
  - Docker / Docker Compose setup (create `Dockerfile` and `docker-compose.yml` if not present)
  - Cloud deployment guidance
- Health check endpoint documentation

### 3. User Guide (`docs/user-guide.md`)
For each user role defined in the app spec, document:
- How to register and log in
- Step-by-step walkthrough of each feature available to that role
- Include screenshot placeholders (describe what each screenshot should show)

### 4. Contributing Guide (`CONTRIBUTING.md`)
- Development setup
- Branch naming conventions
- Commit message format
- Pull request process
- Code style and linting rules

### 5. API Documentation
- Ensure `docs/api-spec.md` is up to date with any changes made during implementation
- Verify `docs/openapi.yaml` matches the implemented endpoints

Write all documentation in clear, concise Markdown. Use code blocks for commands and configuration examples.
