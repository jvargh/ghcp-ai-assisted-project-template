---
mode: agent
description: "Implement UI components, pages, and state management for the frontend"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/06-implement-frontend #file:Your-App-Spec.md`

# Phase 6: Frontend Implementation

Given the application requirements in the attached spec file (referred to as **"the app spec"**), the architecture in `docs/architecture.md`, the API spec in `docs/api-spec.md`, and the project scaffold, implement the full frontend application.

## Implementation Order

### Step 1: Foundation
- Set up routing with route definitions for all pages
- Implement API client service matching every backend endpoint in `docs/api-spec.md`
- Set up state management as defined in `docs/architecture.md`
- Create shared UI components: Layout, Navbar, Loading, ErrorMessage, ProtectedRoute

### Step 2: Authentication Pages
- **Login Page** — Credentials form, calls login API, stores auth token/session
- **Register Page** — Registration form with role selection for each role in the app spec
- Persist auth state across page refreshes
- Redirect unauthenticated users to login

### Step 3: Home / Dashboard
- **Home Page** — Landing page showing role-appropriate navigation
- For each user role in the app spec, show links to the features available to that role

### Step 4: Role-Specific Feature Pages
For each user role described in the app spec, implement pages for their capabilities:
- **Creation/Management pages** — Forms for creating and managing domain entities
  - Client-side validation matching business rules from the app spec
  - Save and Cancel actions
- **Interaction pages** — Pages for participating in or consuming domain features
  - Input controls appropriate to the data type (radio buttons, checkboxes, text, etc.)
  - Submit and Cancel actions
  - Validation with user-friendly error messages

### Step 5: List & Status Pages
- Pages showing lists of domain entities filtered by status or role
- Action buttons for status transitions (with confirmation dialogs)

### Step 6: Results / Reports
- Pages for viewing aggregated data, results, or reports as described in the app spec
- Tabular and/or graphical display as appropriate
- Accessible to all roles that the app spec grants access

## Conventions
- All components must be functional components with typed props
- Use accessible HTML elements (semantic tags, ARIA labels, form labels)
- Handle loading and error states for every API call
- Responsive design (mobile-friendly)
- No inline styles — use CSS modules or a utility CSS approach

After implementation, install dependencies and verify the app renders without errors.
