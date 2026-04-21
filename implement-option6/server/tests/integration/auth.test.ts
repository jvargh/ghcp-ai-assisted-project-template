import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createTestUser } from "../helpers/factories.js";

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user and return token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "new@test.com",
          password: "password123",
          name: "New User",
          role: "respondent",
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({
        email: "new@test.com",
        name: "New User",
        role: "respondent",
      });
      expect(res.body.token).toBeDefined();
    });

    it("should register a coordinator", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "coord@test.com",
          password: "password123",
          name: "Coord User",
          role: "coordinator",
        });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe("coordinator");
    });

    it("should return 409 for duplicate email", async () => {
      await createTestUser({ email: "dup@test.com" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "dup@test.com",
          password: "password123",
          name: "Dup User",
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    it("should return 400 for invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "not-an-email",
          password: "password123",
          name: "Bad Email",
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 for short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "short@test.com",
          password: "12345",
          name: "Short Pass",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      await createTestUser({
        email: "login@test.com",
        password: "password123",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "login@test.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("login@test.com");
      expect(res.body.token).toBeDefined();
    });

    it("should return 401 for wrong password", async () => {
      await createTestUser({
        email: "wrong@test.com",
        password: "correct-password",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@test.com", password: "wrong-password" });

      expect(res.status).toBe(401);
    });

    it("should return 401 for non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "noone@test.com", password: "password123" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return current user with valid token", async () => {
      const { token } = await createTestUser({ email: "me@test.com" });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("me@test.com");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should return 401 with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");
      expect(res.status).toBe(401);
    });
  });
});
