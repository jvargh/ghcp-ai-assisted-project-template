import bcrypt from "bcrypt";
import { db } from "../../src/db/index.js";
import { users, surveys, questions, options } from "../../src/db/schema.js";
import { generateToken } from "../../src/middleware/auth.js";

export async function createTestUser(overrides: {
  email?: string;
  name?: string;
  role?: "coordinator" | "respondent";
  password?: string;
} = {}) {
  const password = overrides.password ?? "password123";
  const passwordHash = await bcrypt.hash(password, 4); // Low rounds for speed

  const user = db
    .insert(users)
    .values({
      email: overrides.email ?? `user-${Date.now()}@test.com`,
      passwordHash,
      name: overrides.name ?? "Test User",
      role: overrides.role ?? "respondent",
    })
    .returning()
    .get();

  const token = generateToken({ userId: user.id, role: user.role });

  return { user, token, password };
}

export function createTestSurvey(createdBy: number, status: "draft" | "open" | "closed" = "draft") {
  const survey = db
    .insert(surveys)
    .values({
      title: `Test Survey ${Date.now()}`,
      status,
      createdBy,
    })
    .returning()
    .get();

  return survey;
}

export function createTestQuestion(surveyId: number, text?: string, orderIndex = 0) {
  const question = db
    .insert(questions)
    .values({
      surveyId,
      text: text ?? `Test Question ${Date.now()}`,
      orderIndex,
    })
    .returning()
    .get();

  return question;
}

export function createTestOption(questionId: number, text?: string, orderIndex = 0) {
  const option = db
    .insert(options)
    .values({
      questionId,
      text: text ?? `Option ${Date.now()}`,
      orderIndex,
    })
    .returning()
    .get();

  return option;
}

export function createFullSurvey(createdBy: number, status: "draft" | "open" | "closed" = "draft") {
  const survey = createTestSurvey(createdBy, status);
  
  const q1 = createTestQuestion(survey.id, "Question 1", 0);
  const q1o1 = createTestOption(q1.id, "Option A", 0);
  const q1o2 = createTestOption(q1.id, "Option B", 1);

  const q2 = createTestQuestion(survey.id, "Question 2", 1);
  const q2o1 = createTestOption(q2.id, "Option C", 0);
  const q2o2 = createTestOption(q2.id, "Option D", 1);

  return {
    survey,
    questions: [
      { question: q1, options: [q1o1, q1o2] },
      { question: q2, options: [q2o1, q2o2] },
    ],
  };
}
