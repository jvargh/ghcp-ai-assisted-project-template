---
applyTo: "**/*.{ts,tsx}"
---

# TypeScript Conventions

## Strict Mode
- `"strict": true` in all `tsconfig.json` files
- No `any` types — use proper interfaces, type aliases, or `unknown` with type guards
- Enable `noUncheckedIndexedAccess` where possible

## Types & Interfaces
- Export interfaces for all public API shapes (props, request/response, service params)
- Use `type` for unions, intersections, and computed types
- Use `interface` for object shapes that may be extended
- Prefer discriminated unions over optional fields for variant types

## Variables & Functions
- `const` by default; `let` only when reassignment is necessary; never `var`
- Explicit return types on all exported functions
- Use arrow functions for callbacks; named functions for top-level declarations
- Prefer early returns over nested conditionals

## Async
- `async/await` throughout — no raw `.then()` chains or callbacks
- Always handle or propagate errors from async operations
- Use `Promise.all()` for independent parallel operations

## Imports
- Use path aliases where configured (e.g., `@/`, `@shared/`)
- Group: external libraries → internal modules → relative imports
- No circular dependencies
- Import types with `import type` where possible

## General
- No commented-out code
- No `console.log` in production code — use a logger
- Prefer composition over inheritance
- Keep functions small and single-purpose
