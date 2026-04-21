---
applyTo: "src/api/**"
---

# API Patterns

## Route Handlers
- Keep route handlers thin — delegate to service/business logic layer
- Validate all request bodies with a schema library (e.g., Zod) before processing
- Return consistent response shapes:
  - Success: `{ data: T }` or `{ data: T, meta: { pagination } }`
  - Error: `{ error: { code: string, message: string, details?: unknown } }`

## HTTP Conventions
- Use appropriate HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- Use appropriate status codes: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500
- Version APIs if needed (e.g., `/api/v1/`)

## Middleware
- Authentication middleware validates tokens/sessions before route handlers
- Authorization middleware checks role/permission after authentication
- Validation middleware parses and validates request payloads
- Error handling middleware catches and formats unhandled errors

## Security
- Never expose internal error details to clients in production
- Sanitize and validate all user input
- Use parameterized queries — never concatenate user input into queries
- Apply rate limiting on sensitive endpoints
- Set appropriate CORS policies
