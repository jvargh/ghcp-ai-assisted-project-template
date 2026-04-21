import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createTestUser, createFullSurvey } from "../helpers/factories.js";

describe("Response API", () => {
  describe("POST /api/surveys/:id/responses", () => {
    it("should submit a response to an open survey", async () => {
      const { user } = await createTestUser({
        role: "coordinator",
        email: "owner@test.com",
      });

      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "resp@test.com",
      });

      const { survey, questions: qs } = createFullSurvey(user.id, "open");

      const res = await request(app)
        .post(`/api/surveys/${survey.id}/responses`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({
          answers: [
            { questionId: qs[0]!.question.id, optionId: qs[0]!.options[0]!.id },
            { questionId: qs[1]!.question.id, optionId: qs[1]!.options[0]!.id },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.response.surveyId).toBe(survey.id);
    });

    it("should reject duplicate response", async () => {
      const { user } = await createTestUser({
        role: "coordinator",
        email: "owner2@test.com",
      });

      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "resp2@test.com",
      });

      const { survey, questions: qs } = createFullSurvey(user.id, "open");

      const answers = [
        { questionId: qs[0]!.question.id, optionId: qs[0]!.options[0]!.id },
        { questionId: qs[1]!.question.id, optionId: qs[1]!.options[0]!.id },
      ];

      await request(app)
        .post(`/api/surveys/${survey.id}/responses`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({ answers });

      const res = await request(app)
        .post(`/api/surveys/${survey.id}/responses`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({ answers });

      expect(res.status).toBe(409);
    });

    it("should reject if not all questions answered", async () => {
      const { user } = await createTestUser({
        role: "coordinator",
        email: "owner3@test.com",
      });

      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "resp3@test.com",
      });

      const { survey, questions: qs } = createFullSurvey(user.id, "open");

      const res = await request(app)
        .post(`/api/surveys/${survey.id}/responses`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({
          answers: [
            { questionId: qs[0]!.question.id, optionId: qs[0]!.options[0]!.id },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain("All questions must be answered");
    });

    it("should reject response to non-open survey", async () => {
      const { user } = await createTestUser({
        role: "coordinator",
        email: "owner4@test.com",
      });

      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "resp4@test.com",
      });

      const { survey, questions: qs } = createFullSurvey(user.id, "draft");

      const res = await request(app)
        .post(`/api/surveys/${survey.id}/responses`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({
          answers: [
            { questionId: qs[0]!.question.id, optionId: qs[0]!.options[0]!.id },
            { questionId: qs[1]!.question.id, optionId: qs[1]!.options[0]!.id },
          ],
        });

      expect(res.status).toBe(400);
    });

    it("should return 401 without authentication", async () => {
      const res = await request(app)
        .post("/api/surveys/1/responses")
        .send({ answers: [] });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/surveys/:id/responses/results", () => {
    it("should get results for a closed survey", async () => {
      const { user, token: coordToken } = await createTestUser({
        role: "coordinator",
        email: "owner5@test.com",
      });

      const { survey, questions: qs } = createFullSurvey(user.id, "open");

      // Submit a response
      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "resp5@test.com",
      });

      await request(app)
        .post(`/api/surveys/${survey.id}/responses`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({
          answers: [
            { questionId: qs[0]!.question.id, optionId: qs[0]!.options[0]!.id },
            { questionId: qs[1]!.question.id, optionId: qs[1]!.options[1]!.id },
          ],
        });

      // Close the survey
      await request(app)
        .patch(`/api/surveys/${survey.id}/status`)
        .set("Authorization", `Bearer ${coordToken}`)
        .send({ status: "closed" });

      // Get results
      const res = await request(app)
        .get(`/api/surveys/${survey.id}/responses/results`)
        .set("Authorization", `Bearer ${respondentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.survey.totalResponses).toBe(1);
      expect(res.body.survey.questions).toHaveLength(2);
      expect(res.body.survey.questions[0].options[0].count).toBe(1);
    });

    it("should reject results for non-closed survey", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "owner6@test.com",
      });

      const { survey } = createFullSurvey(user.id, "open");

      const res = await request(app)
        .get(`/api/surveys/${survey.id}/responses/results`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });
});
