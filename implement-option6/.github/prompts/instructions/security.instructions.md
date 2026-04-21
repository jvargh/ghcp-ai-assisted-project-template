---
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Security Conventions

## Input Validation
- Validate ALL user input at the system boundary (route handlers, form submissions)
- Use a schema validation library (e.g., Zod, Yup, Joi) — never trust raw input
- Reject invalid input early with descriptive error messages
- Validate types, ranges, lengths, and formats

## Authentication & Authorization
- Never store passwords in plain text — use bcrypt or argon2 with appropriate cost factor
- Use short-lived tokens (JWT) or secure session management
- Verify authentication on every protected endpoint
- Check authorization (role/permission) after authentication
- Never include secrets in client-side code or URL parameters

## Data Access
- Use parameterized queries or ORM methods — NEVER concatenate user input into queries
- Apply principle of least privilege for database connections
- Sanitize output to prevent XSS (escape HTML in user-generated content)
- Never expose internal IDs, stack traces, or system details in error responses

## API Security
- Set appropriate CORS policies — don't use `*` in production
- Apply rate limiting on authentication and sensitive endpoints
- Use HTTPS in production
- Set security headers (Content-Security-Policy, X-Content-Type-Options, etc.)
- Validate `Content-Type` headers on incoming requests

## Secrets Management
- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for all secrets
- Provide `.env.example` with placeholder values (never real secrets)
- Rotate secrets if they are accidentally exposed

## Frontend Security
- Sanitize any user content before rendering (prevent XSS)
- Use `rel="noopener noreferrer"` on external links
- Don't store sensitive data in localStorage — prefer httpOnly cookies for tokens
- Validate and sanitize file uploads (type, size, content)

## Dependencies
- Keep dependencies updated — monitor for known vulnerabilities
- Prefer well-maintained libraries with active security practices
- Audit new dependencies before adding them
