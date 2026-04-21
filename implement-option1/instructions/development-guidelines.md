# Development Guidelines

> Standards and conventions for all contributors and development agents working on the Survey App.

## Code Organization

### File Naming
- Use **kebab-case** for file and folder names (e.g., `survey-list.tsx`, `use-survey.ts`)
- React components use `.tsx` extension
- Non-JSX TypeScript files use `.ts` extension
- Test files use `.test.ts` or `.test.tsx` suffix

### Import Order
1. External dependencies (React, Next.js, third-party libraries)
2. Internal aliases (`@/lib`, `@/types`, `@/components`)
3. Relative imports (sibling/child modules)
4. Styles (if any Tailwind config imports)

Separate each group with a blank line.

### Component Structure
- One component per file (default export)
- Props interface exported alongside the component
- Hooks extracted to `/src/hooks` when reused across components
- Keep components focused — split when exceeding ~150 lines

## TypeScript Conventions

- **Strict mode** is mandatory (`"strict": true`)
- **No `any` types** — use `unknown` and narrow, or define proper interfaces
- Use `interface` for object shapes; use `type` for unions, intersections, and utility types
- All function parameters and return types should be explicitly typed
- Prefer `const` over `let`; never use `var`

## API Route Conventions

- Place API routes under `/src/app/api/[resource]/route.ts`
- Validate all request bodies with Zod schemas before processing
- Return consistent error responses: `{ error: { code, message, details? } }`
- Keep route handlers thin — delegate to domain logic functions
- Use appropriate HTTP status codes (200, 201, 400, 401, 404, 500)

## Styling Rules

- Use **Tailwind CSS exclusively** — no inline styles, no CSS modules, no styled-components
- Extract repeated class patterns into component composition (not `@apply` overuse)
- Use Tailwind responsive prefixes for mobile-first design
- Maintain a consistent color and spacing palette via `tailwind.config.ts`

## Git Conventions

- Commit messages should be clear and descriptive
- One logical change per commit
- Branch names should reflect the feature or phase being worked on

## Error Handling

- Validate at system boundaries (API routes, form submissions)
- Display user-friendly error messages in the UI
- Log detailed errors server-side
- Never expose stack traces or internal details to the client

## Documentation

- Update `docs/requirements.md` status when implementing features
- Record architectural decisions in `docs/decisions.md`
- Keep `project/roadmap.md` in sync with implementation progress
