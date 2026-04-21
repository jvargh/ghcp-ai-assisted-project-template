# Data Modeling Skill

Generate database schemas and ORM configurations from a data model design document.

## When to Use

Use this skill when you need to:
- Generate a database schema from `docs/data-model.md`
- Create ORM model/schema files (e.g., Prisma, TypeORM, Drizzle, Mongoose)
- Generate migration files
- Create seed scripts with sample data

## Inputs

This skill requires:
1. `docs/data-model.md` — Entity definitions, relationships, and constraints
2. `docs/architecture.md` — To determine which ORM/database technology to use

## Process

### Step 1: Read the Data Model
- Parse all entities, their fields, types, and constraints from `docs/data-model.md`
- Identify all relationships (one-to-many, many-to-many, one-to-one)
- Note indexes, unique constraints, and cascade rules
- Identify enum types and state machines

### Step 2: Generate Schema
Based on the ORM chosen in `docs/architecture.md`:

**For Prisma:**
- Create `prisma/schema.prisma` with all models, relations, enums, and indexes
- Use appropriate field types (`String`, `Int`, `DateTime`, `Boolean`, `Enum`)
- Add `@id`, `@unique`, `@default`, `@relation`, `@@index` annotations
- Configure the datasource and generator blocks

**For TypeORM/Drizzle/Other:**
- Create model files in the appropriate directory
- Follow the ORM's conventions for defining entities and relations

**For raw SQL:**
- Generate `CREATE TABLE` statements with constraints
- Generate `CREATE INDEX` statements
- Generate enum types or check constraints

### Step 3: Generate Migrations
- Create initial migration from the schema
- Ensure migrations are idempotent and reversible where possible

### Step 4: Generate Seed Script
- Create a seed script that populates the database with representative sample data
- Cover all entity types and relationships
- Include data for each user role defined in the app spec
- Make the seed script idempotent (safe to run multiple times)

### Step 5: Validate
- Verify all entities from `docs/data-model.md` are represented
- Verify all relationships are correctly modeled
- Verify all constraints and indexes are in place
- Verify enum values match the design

## Output

| File | Contents |
|------|----------|
| Schema file(s) | ORM schema or SQL DDL |
| Migration file(s) | Initial database migration |
| Seed script | Sample data for development |
| Database utility | Connection singleton or pool configuration |

## Conventions

- Use singular model names (e.g., `User`, not `Users`)
- Add `createdAt` and `updatedAt` timestamps to all entities
- Use UUID or auto-increment IDs as specified in the architecture
- Add soft delete (`deletedAt`) only if explicitly required
- Index foreign keys and frequently queried fields
