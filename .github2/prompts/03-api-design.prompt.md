---
mode: agent
description: "Generate API contracts and OpenAPI spec"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/03-api-design #file:Your-App-Spec.md`

# Phase 3: API Design

Given the application requirements in the attached spec file (referred to as **"the app spec"**), the architecture in `docs/architecture.md`, and the data model in `docs/data-model.md`, generate a complete API specification.

Derive all endpoints from the user stories and features in the app spec. Map each user role's capabilities to appropriate API operations.

## Deliverables

Create `docs/api-spec.md` containing:

### 1. API Overview
- Base URL structure
- Authentication mechanism (aligned with `docs/architecture.md`)
- Common headers
- Pagination approach
- Error response format (consistent across all endpoints)

### 2. Endpoint Definitions
For each endpoint, document:
- HTTP method and path
- Description
- Required role or access level
- Request parameters (path, query, body) with types
- Response body with types and status codes
- Example request and response

### 3. Endpoint Derivation
Analyze every user story in the app spec and create endpoints to support them:
- **Authentication** — Registration and login for each user role
- **CRUD operations** — For every domain entity that users create, read, update, or delete
- **State transitions** — For any lifecycle changes described in the app spec
- **Aggregations/Reports** — For any results, summaries, or analytics features

Ensure every user story in the app spec has at least one corresponding endpoint.

### 4. OpenAPI Specification
- Generate a valid OpenAPI 3.0 YAML file at `docs/openapi.yaml`

Write the API documentation to `docs/api-spec.md` and the OpenAPI spec to `docs/openapi.yaml`.
