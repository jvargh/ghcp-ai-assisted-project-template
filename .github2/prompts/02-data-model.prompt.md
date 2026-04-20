---
mode: agent
description: "Generate data models, DB schema, and ERD"
---

> **Usage:** Attach your application specification markdown file to the chat when running this prompt.
> Example: `/02-data-model #file:Your-App-Spec.md`

# Phase 2: Data Model & Database Schema

Given the application requirements in the attached spec file (referred to as **"the app spec"**) and the architecture decisions in `docs/architecture.md`, generate the complete data model.

Analyze the app spec to identify all data entities, their attributes, relationships, and lifecycle states.

## Deliverables

Create `docs/data-model.md` containing:

### 1. Entity-Relationship Diagram
- Mermaid ERD showing all entities and relationships
- Cardinality annotations on all relationships

### 2. Entity Definitions
For each entity identified from the app spec, document:
- Table name
- All columns with types, constraints, and descriptions
- Primary keys and foreign keys
- Indexes needed for query performance

### 3. Entity Identification
Derive entities from the app spec's user stories and features. At minimum, include:
- Entities for each user role described in the app spec
- Core domain entities (the primary objects users create and interact with)
- Relationship/junction entities linking users to domain objects
- Any status or lifecycle tracking needed

### 4. Seed Data
- Example seed data for testing, covering all user roles and representative domain objects

### 5. Migration Strategy
- How schema migrations will be managed (aligned with the ORM/database chosen in `docs/architecture.md`)
- Initial migration script or ORM schema file

Write the output to `docs/data-model.md`.
