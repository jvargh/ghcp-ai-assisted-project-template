import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  getSurveysByStatus,
  updateSurveyStatus,
  submitResponse,
  getResponsesBySurveyId,
  tabulateResults,
  resetStore,
} from "@/lib/store";

beforeEach(() => {
  resetStore();
});

const validSurveyInput = {
  title: "Customer Satisfaction",
  questions: [
    {
      id: "q1",
      text: "How satisfied are you?",
      selections: [
        { id: "s1a", text: "Very satisfied" },
        { id: "s1b", text: "Satisfied" },
        { id: "s1c", text: "Unsatisfied" },
      ],
    },
    {
      id: "q2",
      text: "Would you recommend us?",
      selections: [
        { id: "s2a", text: "Yes" },
        { id: "s2b", text: "No" },
      ],
    },
  ],
};

describe("Store - Survey CRUD", () => {
  it("creates a survey in draft status", () => {
    const survey = createSurvey(validSurveyInput);
    expect(survey.id).toBeDefined();
    expect(survey.title).toBe("Customer Satisfaction");
    expect(survey.status).toBe("draft");
    expect(survey.questions).toHaveLength(2);
    expect(survey.questions[0].selections).toHaveLength(3);
  });

  it("retrieves all surveys", () => {
    createSurvey(validSurveyInput);
    createSurvey({ ...validSurveyInput, title: "Second Survey" });
    expect(getAllSurveys()).toHaveLength(2);
  });

  it("retrieves survey by id", () => {
    const survey = createSurvey(validSurveyInput);
    const found = getSurveyById(survey.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe("Customer Satisfaction");
  });

  it("returns undefined for non-existent id", () => {
    expect(getSurveyById("nonexistent")).toBeUndefined();
  });

  it("filters surveys by status", () => {
    const survey = createSurvey(validSurveyInput);
    createSurvey({ ...validSurveyInput, title: "Another" });

    expect(getSurveysByStatus("draft")).toHaveLength(2);
    expect(getSurveysByStatus("open")).toHaveLength(0);

    updateSurveyStatus(survey.id, "open");
    expect(getSurveysByStatus("draft")).toHaveLength(1);
    expect(getSurveysByStatus("open")).toHaveLength(1);
  });
});

describe("Store - Survey Lifecycle", () => {
  it("transitions draft → open → closed", () => {
    const survey = createSurvey(validSurveyInput);
    expect(survey.status).toBe("draft");

    const opened = updateSurveyStatus(survey.id, "open");
    expect(opened.status).toBe("open");

    const closed = updateSurveyStatus(survey.id, "closed");
    expect(closed.status).toBe("closed");
  });

  it("throws on invalid transition", () => {
    const survey = createSurvey(validSurveyInput);
    expect(() => updateSurveyStatus(survey.id, "closed")).toThrow();
  });

  it("throws when survey not found", () => {
    expect(() => updateSurveyStatus("bad-id", "open")).toThrow(
      "Survey not found"
    );
  });
});

describe("Store - Response Submission", () => {
  it("submits a valid response to an open survey", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");

    const response = submitResponse(survey.id, {
      q1: "s1a",
      q2: "s2b",
    });

    expect(response.id).toBeDefined();
    expect(response.surveyId).toBe(survey.id);
    expect(response.answers.q1).toBe("s1a");
    expect(response.answers.q2).toBe("s2b");
  });

  it("rejects response to a draft survey", () => {
    const survey = createSurvey(validSurveyInput);
    expect(() =>
      submitResponse(survey.id, { q1: "s1a", q2: "s2a" })
    ).toThrow("Responses can only be submitted to open surveys");
  });

  it("rejects response to a closed survey", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");
    updateSurveyStatus(survey.id, "closed");
    expect(() =>
      submitResponse(survey.id, { q1: "s1a", q2: "s2a" })
    ).toThrow("Responses can only be submitted to open surveys");
  });

  it("rejects response with missing answers", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");
    expect(() => submitResponse(survey.id, { q1: "s1a" })).toThrow(
      "All questions must be answered"
    );
  });

  it("rejects response with invalid selection", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");
    expect(() =>
      submitResponse(survey.id, { q1: "invalid", q2: "s2a" })
    ).toThrow("Invalid selection");
  });

  it("rejects response with invalid question id", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");
    expect(() =>
      submitResponse(survey.id, { q1: "s1a", q2: "s2a", q99: "x" })
    ).toThrow("Invalid question ID");
  });

  it("retrieves responses by survey id", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");
    submitResponse(survey.id, { q1: "s1a", q2: "s2a" });
    submitResponse(survey.id, { q1: "s1b", q2: "s2b" });

    const responses = getResponsesBySurveyId(survey.id);
    expect(responses).toHaveLength(2);
  });
});

describe("Store - Results Tabulation", () => {
  it("tabulates results correctly", () => {
    const survey = createSurvey(validSurveyInput);
    updateSurveyStatus(survey.id, "open");

    submitResponse(survey.id, { q1: "s1a", q2: "s2a" });
    submitResponse(survey.id, { q1: "s1a", q2: "s2b" });
    submitResponse(survey.id, { q1: "s1b", q2: "s2a" });

    const results = tabulateResults(survey.id);

    expect(results.totalResponses).toBe(3);
    expect(results.surveyTitle).toBe("Customer Satisfaction");
    expect(results.questions).toHaveLength(2);

    // Question 1: s1a=2, s1b=1, s1c=0
    const q1 = results.questions[0];
    expect(q1.selections.find((s) => s.selectionId === "s1a")?.count).toBe(2);
    expect(q1.selections.find((s) => s.selectionId === "s1b")?.count).toBe(1);
    expect(q1.selections.find((s) => s.selectionId === "s1c")?.count).toBe(0);

    // Question 2: s2a=2, s2b=1
    const q2 = results.questions[1];
    expect(q2.selections.find((s) => s.selectionId === "s2a")?.count).toBe(2);
    expect(q2.selections.find((s) => s.selectionId === "s2b")?.count).toBe(1);
  });

  it("returns zero counts for survey with no responses", () => {
    const survey = createSurvey(validSurveyInput);
    const results = tabulateResults(survey.id);
    expect(results.totalResponses).toBe(0);
    results.questions.forEach((q) => {
      q.selections.forEach((s) => {
        expect(s.count).toBe(0);
      });
    });
  });

  it("throws for non-existent survey", () => {
    expect(() => tabulateResults("bad-id")).toThrow("Survey not found");
  });
});
