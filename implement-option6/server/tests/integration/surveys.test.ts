import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import {
  createTestUser,
  createFullSurvey,
  createTestSurvey,
} from "../helpers/factories.js";

describe("Survey API", () => {
  describe("POST /api/surveys", () => {
    it("should create a survey as coordinator", async () => {
      const { token } = await createTestUser({
        role: "coordinator",
        email: "coord@test.com",
      });

      const res = await request(app)
        .post("/api/surveys")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "My Survey",
          questions: [
            {
              text: "Q1?",
              options: [{ text: "A" }, { text: "B" }],
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.survey.title).toBe("My Survey");
      expect(res.body.survey.status).toBe("draft");
      expect(res.body.survey.questions).toHaveLength(1);
      expect(res.body.survey.questions[0].options).toHaveLength(2);
    });

    it("should return 403 for respondent trying to create survey", async () => {
      const { token } = await createTestUser({
        role: "respondent",
        email: "resp@test.com",
      });

      const res = await request(app)
        .post("/api/surveys")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Denied",
          questions: [{ text: "Q?", options: [{ text: "A" }] }],
        });

      expect(res.status).toBe(403);
    });

    it("should return 400 for too many questions", async () => {
      const { token } = await createTestUser({
        role: "coordinator",
        email: "coord2@test.com",
      });

      const questions = Array.from({ length: 11 }, (_, i) => ({
        text: `Q${i}?`,
        options: [{ text: "A" }],
      }));

      const res = await request(app)
        .post("/api/surveys")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Too Many", questions });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/surveys", () => {
    it("should list surveys for authenticated user", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "list@test.com",
      });

      createFullSurvey(user.id, "open");

      const res = await request(app)
        .get("/api/surveys")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.surveys).toHaveLength(1);
      expect(res.body.surveys[0].questionCount).toBe(2);
    });

    it("should filter by status", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "filter@test.com",
      });

      createFullSurvey(user.id, "open");
      createFullSurvey(user.id, "closed");

      const res = await request(app)
        .get("/api/surveys?status=open")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.surveys).toHaveLength(1);
      expect(res.body.surveys[0].status).toBe("open");
    });

    it("should hide draft surveys from respondents", async () => {
      const { user } = await createTestUser({
        role: "coordinator",
        email: "owner@test.com",
      });

      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "viewer@test.com",
      });

      createFullSurvey(user.id, "draft");
      createFullSurvey(user.id, "open");

      const res = await request(app)
        .get("/api/surveys")
        .set("Authorization", `Bearer ${respondentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.surveys).toHaveLength(1);
      expect(res.body.surveys[0].status).toBe("open");
    });
  });

  describe("GET /api/surveys/:id", () => {
    it("should get a survey with questions and options", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "get@test.com",
      });

      const { survey } = createFullSurvey(user.id, "open");

      const res = await request(app)
        .get(`/api/surveys/${survey.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.survey.questions).toHaveLength(2);
      expect(res.body.survey.questions[0].options).toHaveLength(2);
    });

    it("should return 404 for non-existent survey", async () => {
      const { token } = await createTestUser({
        role: "respondent",
        email: "miss@test.com",
      });

      const res = await request(app)
        .get("/api/surveys/9999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/surveys/:id/status", () => {
    it("should open a draft survey", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "open@test.com",
      });

      const { survey } = createFullSurvey(user.id, "draft");

      const res = await request(app)
        .patch(`/api/surveys/${survey.id}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "open" });

      expect(res.status).toBe(200);
      expect(res.body.survey.status).toBe("open");
    });

    it("should close an open survey", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "close@test.com",
      });

      const { survey } = createFullSurvey(user.id, "open");

      const res = await request(app)
        .patch(`/api/surveys/${survey.id}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "closed" });

      expect(res.status).toBe(200);
      expect(res.body.survey.status).toBe("closed");
    });

    it("should reject invalid transition (closed → open)", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "invalid@test.com",
      });

      const { survey } = createFullSurvey(user.id, "closed");

      const res = await request(app)
        .patch(`/api/surveys/${survey.id}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "open" });

      expect(res.status).toBe(400);
    });

    it("should reject opening survey with no questions", async () => {
      const { user, token } = await createTestUser({
        role: "coordinator",
        email: "noq@test.com",
      });

      const survey = createTestSurvey(user.id, "draft");

      const res = await request(app)
        .patch(`/api/surveys/${survey.id}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "open" });

      expect(res.status).toBe(400);
    });

    it("should return 403 for respondent", async () => {
      const { user } = await createTestUser({
        role: "coordinator",
        email: "own@test.com",
      });

      const { token: respondentToken } = await createTestUser({
        role: "respondent",
        email: "resp2@test.com",
      });

      const { survey } = createFullSurvey(user.id, "draft");

      const res = await request(app)
        .patch(`/api/surveys/${survey.id}/status`)
        .set("Authorization", `Bearer ${respondentToken}`)
        .send({ status: "open" });

      expect(res.status).toBe(403);
    });
  });
});
