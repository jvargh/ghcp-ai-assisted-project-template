/**
 * API integration tests — test the full survey lifecycle through the store + validation layer.
 * This validates the same logic the API route handlers use, without needing Next.js runtime.
 */
import {
  resetStore,
  createSurvey,
  getAllSurveys,
  getSurveysByStatus,
  getSurveyById,
  updateSurveyStatus,
  submitResponse,
  tabulateResults,
} from "@/lib/store";
import { createSurveySchema, submitResponseSchema } from "@/lib/validation";
import type { Survey } from "@/types";

const validSurveyInput = {
  title: "Customer Satisfaction",
  questions: [
    {
      id: "q1",
      text: "How satisfied are you?",
      selections: [
        { id: "s1", text: "Very satisfied" },
        { id: "s2", text: "Satisfied" },
        { id: "s3", text: "Unsatisfied" },
      ],
    },
    {
      id: "q2",
      text: "Would you recommend us?",
      selections: [
        { id: "s4", text: "Yes" },
        { id: "s5", text: "No" },
      ],
    },
  ],
};

beforeEach(() => {
  resetStore();
});

// --- Survey creation via validation + store ---

describe("survey creation (POST /api/surveys equivalent)", () => {
  it("validates and creates a survey in draft status", () => {
    const parsed = createSurveySchema.safeParse(validSurveyInput);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const survey = createSurvey(parsed.data);
    expect(survey.title).toBe("Customer Satisfaction");
    expect(survey.status).toBe("draft");
    expect(survey.questions).toHaveLength(2);
  });

  it("rejects invalid survey data", () => {
    const parsed = createSurveySchema.safeParse({ title: "" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("rejects survey with no questions", () => {
    const parsed = createSurveySchema.safeParse({
      title: "Empty Survey",
      questions: [],
    });
    expect(parsed.success).toBe(false);
  });
});

// --- Survey listing and filtering (GET /api/surveys equivalent) ---

describe("survey listing (GET /api/surveys equivalent)", () => {
  it("returns empty array when no surveys exist", () => {
    expect(getAllSurveys()).toEqual([]);
  });

  it("returns all surveys", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    createSurvey(parsed);
    expect(getAllSurveys()).toHaveLength(1);
  });

  it("filters by status", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    createSurvey(parsed);

    expect(getSurveysByStatus("draft")).toHaveLength(1);
    expect(getSurveysByStatus("open")).toHaveLength(0);
    expect(getSurveysByStatus("closed")).toHaveLength(0);
  });
});

// --- Get survey by ID (GET /api/surveys/[id] equivalent) ---

describe("get survey by id (GET /api/surveys/[id] equivalent)", () => {
  it("returns undefined for unknown id", () => {
    expect(getSurveyById("unknown")).toBeUndefined();
  });

  it("returns the correct survey", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const created = createSurvey(parsed);
    const found = getSurveyById(created.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.title).toBe("Customer Satisfaction");
  });
});

// --- Survey status update (PATCH /api/surveys/[id] equivalent) ---

describe("survey status update (PATCH /api/surveys/[id] equivalent)", () => {
  it("opens a draft survey", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);

    const updated = updateSurveyStatus(survey.id, "open");
    expect(updated.status).toBe("open");
  });

  it("rejects invalid transition (draft → closed)", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);

    expect(() => updateSurveyStatus(survey.id, "closed")).toThrow();
  });

  it("throws for non-existent survey", () => {
    expect(() => updateSurveyStatus("missing", "open")).toThrow();
  });
});

// --- Response submission (POST /api/surveys/[id]/responses equivalent) ---

describe("response submission (POST /api/surveys/[id]/responses equivalent)", () => {
  function createOpenSurvey(): Survey {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);
    return updateSurveyStatus(survey.id, "open");
  }

  it("validates and submits a response to open survey", () => {
    const survey = createOpenSurvey();
    const input = { surveyId: survey.id, answers: { q1: "s1", q2: "s4" } };
    const parsed = submitResponseSchema.safeParse(input);
    expect(parsed.success).toBe(true);

    const response = submitResponse(survey.id, input.answers);
    expect(response.surveyId).toBe(survey.id);
  });

  it("rejects response to draft survey", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);

    expect(() => submitResponse(survey.id, { q1: "s1", q2: "s4" })).toThrow();
  });

  it("validates response schema", () => {
    const parsed = submitResponseSchema.safeParse({ answers: {} });
    expect(parsed.success).toBe(false);
  });
});

// --- Results tabulation (GET /api/surveys/[id]/results equivalent) ---

describe("results tabulation (GET /api/surveys/[id]/results equivalent)", () => {
  it("returns tabulated results with correct counts", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);
    updateSurveyStatus(survey.id, "open");

    submitResponse(survey.id, { q1: "s1", q2: "s4" });
    submitResponse(survey.id, { q1: "s2", q2: "s4" });
    submitResponse(survey.id, { q1: "s1", q2: "s5" });

    const results = tabulateResults(survey.id);
    expect(results.surveyId).toBe(survey.id);
    expect(results.totalResponses).toBe(3);
    expect(results.questions).toHaveLength(2);

    // q1: s1=2, s2=1, s3=0
    const q1 = results.questions.find((q) => q.questionId === "q1");
    expect(q1).toBeDefined();
    const s1Count = q1!.selections.find((s) => s.selectionId === "s1");
    expect(s1Count!.count).toBe(2);

    // q2: s4=2, s5=1
    const q2 = results.questions.find((q) => q.questionId === "q2");
    const s4Count = q2!.selections.find((s) => s.selectionId === "s4");
    expect(s4Count!.count).toBe(2);
  });
});

// --- Full lifecycle integration ---

describe("full survey lifecycle", () => {
  it("create → open → respond → close → view results", () => {
    // 1. Create (draft)
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);
    expect(survey.status).toBe("draft");

    // 2. Open
    const opened = updateSurveyStatus(survey.id, "open");
    expect(opened.status).toBe("open");

    // 3. Respond
    const response = submitResponse(survey.id, { q1: "s1", q2: "s5" });
    expect(response.surveyId).toBe(survey.id);

    // 4. Close
    const closed = updateSurveyStatus(survey.id, "closed");
    expect(closed.status).toBe("closed");

    // 5. View results
    const results = tabulateResults(survey.id);
    expect(results.totalResponses).toBe(1);
    expect(results.questions).toHaveLength(2);

    // Cannot submit to closed survey
    expect(() => submitResponse(survey.id, { q1: "s2", q2: "s4" })).toThrow();
  });

  it("multiple respondents submit to same survey", () => {
    const parsed = createSurveySchema.parse(validSurveyInput);
    const survey = createSurvey(parsed);
    updateSurveyStatus(survey.id, "open");

    submitResponse(survey.id, { q1: "s1", q2: "s4" });
    submitResponse(survey.id, { q1: "s2", q2: "s4" });
    submitResponse(survey.id, { q1: "s3", q2: "s5" });

    const results = tabulateResults(survey.id);
    expect(results.totalResponses).toBe(3);
  });
});
