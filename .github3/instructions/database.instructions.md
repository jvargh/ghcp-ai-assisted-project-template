---
applyTo: "src/models/**"
---

# Database & Data Access Patterns

## General Principles
- Use an ORM or query builder — avoid raw SQL unless necessary for performance
- Keep data access logic in a dedicated layer (repositories or models)
- Never expose database implementation details to route handlers

## Schema Design
- Use meaningful, descriptive table and column names
- Define explicit relationships (foreign keys, cascades)
- Add appropriate indexes for frequently queried fields
- Use enums for fixed-value columns where supported

## Queries
- Select only the fields you need — avoid `SELECT *`
- Use transactions for multi-step operations that must be atomic
- Paginate list queries with limit/offset or cursor-based pagination
- Handle not-found cases explicitly (don't rely on empty results silently)

## Migrations
- Every schema change requires a migration
- Migrations must be reversible where possible
- Never modify a migration that has already been applied in shared environments
- Seed scripts should be idempotent

## Connection Management
- Use a singleton or pooled client instance
- Configure connection timeouts and pool sizes appropriately
- Handle connection errors gracefully with retries where appropriate
