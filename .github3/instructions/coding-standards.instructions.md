---
applyTo: "**/*.{ts,tsx}"
---

# Coding Standards

## TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types — use proper interfaces or type aliases
- Prefer `const` over `let`; never use `var`
- Use explicit return types on exported functions
- Prefer early returns over nested conditionals

## Naming Conventions
- PascalCase for types, interfaces, classes, and React components
- camelCase for variables, functions, and methods
- UPPER_SNAKE_CASE for constants and environment variables
- Prefix interfaces with descriptive names (not `I` prefix)

## Imports
- Use path aliases where configured (e.g., `@/`, `@shared/`)
- Group imports: external libraries → internal modules → relative imports
- No circular dependencies

## Error Handling
- Use typed error classes or result patterns
- Never swallow errors silently
- Log errors with sufficient context for debugging

## General
- Keep functions focused and small (single responsibility)
- Prefer composition over inheritance
- Use async/await over raw Promises
- No commented-out code in production
