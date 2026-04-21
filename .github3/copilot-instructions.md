# Copilot Instructions

> This file provides global project conventions. It is automatically loaded by GitHub Copilot for all interactions within this repository.
> Populate the sections below during project setup based on your application specification document.

## Project Overview

<!-- Describe the application purpose, roles, and high-level architecture here. -->

## Technology Stack

<!-- Define the core technologies used across the project. Example:
- Language: TypeScript (strict mode)
- Frontend: React + React Router + state management library
- Backend: Express/Fastify + validation library
- Styling: Tailwind CSS
- Testing: Vitest + React Testing Library
-->

## Architecture Principles

- Modular, feature-oriented folder structure
- Strict TypeScript — no `any` types
- Separation of concerns: routes, business logic, data access, UI
- All components must be accessible (WCAG 2.1 AA)
- Consistent error response format: `{ error: { code, message, details? } }`
- Role-based access control where applicable

## Development Workflow

- Implementation guided by `docs/requirements.md`
- Each feature must be validated against the app spec before completion
- Documentation stays synchronized with the codebase
- Tests accompany all new features and bug fixes

## Key Business Rules

<!-- Populate from your app spec. Examples:
- Entity lifecycle constraints (e.g., DRAFT → OPEN → CLOSED)
- Access control policies per role
- Validation limits (min/max constraints)
- Uniqueness or idempotency rules
-->
