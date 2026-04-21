# Component Builder Skill

Generate frontend UI components, pages, routing, and state management from design documents.

## When to Use

Use this skill when you need to:
- Generate UI components from architectural specifications
- Build page layouts and routing
- Create API client integration
- Set up state management
- Build forms with validation

## Inputs

This skill requires:
1. `docs/architecture.md` — Frontend framework, styling approach, component structure
2. `docs/api-spec.md` — API endpoints for client integration
3. `docs/data-model.md` — Entity shapes for TypeScript interfaces
4. App spec — User roles, pages, and interaction flows

## Process

### Step 1: Generate Shared Types
- Create TypeScript interfaces for all API request/response shapes
- Create enums for status values and roles
- Create utility types (pagination, error response, etc.)
- Place in a shared types location accessible to all frontend code

### Step 2: Generate API Client
- Create a centralized fetch/HTTP client wrapper
- Handle auth token injection (headers)
- Handle response parsing and error extraction
- Create one function per API endpoint from `docs/api-spec.md`
- Type all request parameters and responses

### Step 3: Generate Layout Components
Create shared structural components:
- **App Layout** — Header/navbar, main content area, footer
- **Navigation** — Links appropriate to the current user's role
- **Protected Route** — Redirect unauthenticated users to login
- **Error Boundary** — Catch and display rendering errors gracefully
- **Loading Spinner** — Consistent loading indicator
- **Error Message** — Consistent error display

### Step 4: Generate Auth Pages
- **Login Page** — Credentials form, calls auth API, stores token/session
- **Register Page** — Registration form with role selection (if applicable)
- Auth state management (context, store, or hook)
- Persist auth across page refreshes
- Logout functionality

### Step 5: Generate Feature Pages
For each feature area in the app spec:

**List pages:**
- Fetch and display collections of entities
- Filtering, sorting, pagination where appropriate
- Action buttons (create, edit, delete, transition)
- Empty state messaging

**Detail pages:**
- Fetch and display a single entity
- Related data display
- Action buttons appropriate to the entity's state

**Form pages:**
- Create and edit forms
- Client-side validation matching backend rules
- Loading state during submission
- Success/error feedback

**Dashboard/Home:**
- Role-appropriate overview
- Navigation to key features
- Summary statistics where applicable

### Step 6: Generate Routing
- Define all routes with appropriate nesting
- Protect routes by authentication and role
- Handle 404 and unauthorized redirects
- Wire up navigation components

### Step 7: Generate State Management
Based on `docs/architecture.md`:
- Set up the chosen state management approach (Context, Zustand, Redux, etc.)
- Create stores/slices for auth, domain entities, and UI state
- Connect components to state

### Step 8: Validate
- Verify all pages from the app spec are implemented
- Verify API client covers all endpoints in `docs/api-spec.md`
- Verify forms validate according to business rules
- Verify role-based visibility/access is enforced in the UI

## Output

| Directory | Contents |
|-----------|----------|
| `src/components/` | Reusable UI components |
| `src/pages/` or `src/views/` | Page-level components |
| `src/api/` or `src/services/` | API client functions |
| `src/hooks/` | Custom hooks |
| `src/context/` or `src/store/` | State management |
| `src/types/` | Shared TypeScript interfaces |
| `src/App.tsx` | Root component with routing |

## Conventions

- Functional components with hooks only — no class components
- Typed props interfaces exported from each component
- Semantic HTML (`button`, `nav`, `main`, `form`, `section`)
- Accessibility: keyboard navigation, ARIA labels, color contrast (WCAG 2.1 AA)
- Responsive: mobile-first with breakpoints
- No inline styles — use the project's styling approach
- Handle loading, error, and empty states for every async operation
- No scattered `fetch()` calls — use the centralized API client
