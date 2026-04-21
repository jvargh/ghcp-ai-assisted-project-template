import { createSurveySchema, submitResponseSchema } from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("createSurveySchema", () => {
    const validSurvey = {
      title: "Test Survey",
      questions: [
        {
          id: "q1",
          text: "Question 1?",
          selections: [
            { id: "s1", text: "Option A" },
            { id: "s2", text: "Option B" },
          ],
        },
      ],
    };

    it("accepts a valid survey", () => {
      const result = createSurveySchema.safeParse(validSurvey);
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = createSurveySchema.safeParse({
        ...validSurvey,
        title: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects survey with no questions", () => {
      const result = createSurveySchema.safeParse({
        ...validSurvey,
        questions: [],
      });
      expect(result.success).toBe(false);
    });

    it("rejects survey with more than 10 questions", () => {
      const questions = Array.from({ length: 11 }, (_, i) => ({
        id: `q${i}`,
        text: `Question ${i}?`,
        selections: [{ id: `s${i}`, text: "Option" }],
      }));
      const result = createSurveySchema.safeParse({
        ...validSurvey,
        questions,
      });
      expect(result.success).toBe(false);
    });

    it("rejects question with no selections", () => {
      const result = createSurveySchema.safeParse({
        ...validSurvey,
        questions: [{ id: "q1", text: "Q?", selections: [] }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects question with more than 5 selections", () => {
      const selections = Array.from({ length: 6 }, (_, i) => ({
        id: `s${i}`,
        text: `Option ${i}`,
      }));
      const result = createSurveySchema.safeParse({
        ...validSurvey,
        questions: [{ id: "q1", text: "Q?", selections }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("submitResponseSchema", () => {
    it("accepts valid response", () => {
      const result = submitResponseSchema.safeParse({
        surveyId: "survey-1",
        answers: { q1: "s1", q2: "s2" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty surveyId", () => {
      const result = submitResponseSchema.safeParse({
        surveyId: "",
        answers: { q1: "s1" },
      });
      expect(result.success).toBe(false);
    });
  });
});
