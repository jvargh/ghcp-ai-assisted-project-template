# API Specification

Base URL: `/api`

## Error Response Format

All errors follow this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": []
  }
}
```

Common error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`

---

## Auth Endpoints

### POST /api/auth/register

Create a new user account.

- **Auth:** None
- **Body:**

```json
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)",
  "name": "string (min 1 char, required)",
  "role": "respondent | coordinator (optional, default: respondent)"
}
```

- **201 Created:**

```json
{
  "user": { "id": 1, "email": "...", "name": "...", "role": "respondent" },
  "token": "jwt-token-string"
}
```

- **409 Conflict:** Email already registered

### POST /api/auth/login

Authenticate and receive a JWT.

- **Auth:** None
- **Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

- **200 OK:**

```json
{
  "user": { "id": 1, "email": "...", "name": "...", "role": "coordinator" },
  "token": "jwt-token-string"
}
```

- **401 Unauthorized:** Invalid credentials

### GET /api/auth/me

Get current authenticated user.

- **Auth:** Required (any role)
- **200 OK:**

```json
{
  "user": { "id": 1, "email": "...", "name": "...", "role": "coordinator" }
}
```

---

## Survey Endpoints

### GET /api/surveys

List surveys, optionally filtered by status.

- **Auth:** Required (any role)
- **Query params:** `status=draft|open|closed` (optional)
- **200 OK:**

```json
{
  "surveys": [
    {
      "id": 1,
      "title": "...",
      "status": "open",
      "createdBy": 1,
      "questionCount": 5,
      "responseCount": 12,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Note:** `draft` surveys are only visible to coordinators.

### POST /api/surveys

Create a new survey with questions and options.

- **Auth:** Required (coordinator only)
- **Body:**

```json
{
  "title": "string (1-200 chars, required)",
  "questions": [
    {
      "text": "string (1-500 chars, required)",
      "options": [
        { "text": "string (1-200 chars, required)" }
      ]
    }
  ]
}
```

**Validation:**
- 1-10 questions
- 1-5 options per question

- **201 Created:**

```json
{
  "survey": {
    "id": 1,
    "title": "...",
    "status": "draft",
    "questions": [
      {
        "id": 1,
        "text": "...",
        "orderIndex": 0,
        "options": [
          { "id": 1, "text": "...", "orderIndex": 0 }
        ]
      }
    ]
  }
}
```

### GET /api/surveys/:id

Get a single survey with all questions and options.

- **Auth:** Required (any role)
- **200 OK:** Full survey object with questions and options
- **404 Not Found:** Survey does not exist

**Note:** Draft surveys are only visible to coordinators.

### PATCH /api/surveys/:id/status

Change survey status (open or close).

- **Auth:** Required (coordinator only)
- **Body:**

```json
{
  "status": "open | closed"
}
```

**Validation:**
- `draft` → `open`: Survey must have ≥ 1 question, each with ≥ 1 option
- `open` → `closed`: Always allowed for coordinators
- Other transitions: Rejected

- **200 OK:** Updated survey object
- **400 Bad Request:** Invalid transition
- **404 Not Found:** Survey not found

---

## Response Endpoints

### POST /api/surveys/:id/responses

Submit a response to an open survey.

- **Auth:** Required (any role — respondents and coordinators can respond)
- **Body:**

```json
{
  "answers": [
    {
      "questionId": 1,
      "optionId": 3
    }
  ]
}
```

**Validation:**
- Survey must be `open`
- Must answer ALL questions in the survey
- Each `questionId` must belong to this survey
- Each `optionId` must belong to the corresponding question
- User must not have already responded to this survey

- **201 Created:**

```json
{
  "response": {
    "id": 1,
    "surveyId": 1,
    "submittedAt": "..."
  }
}
```

- **400 Bad Request:** Validation failure
- **409 Conflict:** Already responded

### GET /api/surveys/:id/results

Get aggregated results for a closed survey.

- **Auth:** Required (any role)
- **200 OK:**

```json
{
  "survey": {
    "id": 1,
    "title": "...",
    "totalResponses": 25,
    "questions": [
      {
        "id": 1,
        "text": "...",
        "options": [
          { "id": 1, "text": "...", "count": 10 },
          { "id": 2, "text": "...", "count": 8 },
          { "id": 3, "text": "...", "count": 7 }
        ]
      }
    ]
  }
}
```

- **400 Bad Request:** Survey is not closed
- **404 Not Found:** Survey not found
