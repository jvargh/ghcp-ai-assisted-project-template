---
applyTo: "src/components/**"
---

# UI Component Conventions

## Structure
- One component per file, default export
- Colocate styles, tests, and types with the component when practical
- Separate reusable/shared components from page-level components

## React Patterns
- Use functional components with hooks
- Define TypeScript prop interfaces (exported for reuse)
- Use `'use client'` directive when the component uses hooks or event handlers (Next.js/RSC)
- Prefer controlled components for form inputs
- Extract custom hooks for reusable stateful logic

## Styling
- Use Tailwind CSS utility classes exclusively — no inline styles, no CSS modules
- Support dark mode: use `dark:` variants (e.g., `bg-white dark:bg-slate-800`)
- Use consistent spacing, sizing, and color tokens from the design system
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints

## Accessibility (WCAG 2.1 AA)
- All interactive elements must be keyboard accessible
- Use semantic HTML elements (`button`, `nav`, `main`, `section`)
- Provide `aria-label` or `aria-labelledby` for non-text elements
- Ensure sufficient color contrast (4.5:1 for text, 3:1 for large text)
- Form inputs must have associated labels

## State Management
- Local state for component-specific UI state
- Context or state library for shared/global state
- Avoid prop drilling beyond 2 levels — lift state or use context

## Performance
- Memoize expensive computations with `useMemo`
- Use `React.memo` for components that re-render with unchanged props
- Lazy load routes and heavy components with `React.lazy` / dynamic imports
