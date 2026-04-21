import { eq, sql, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { surveys, questions, options, surveyResponses } from "../db/schema.js";
import { AppError } from "../middleware/errorHandler.js";
import type { CreateSurveyInput, UpdateStatusInput } from "../validators/survey.js";

export function listSurveys(status?: string, userRole?: string) {
  const baseSelect = {
    id: surveys.id,
    title: surveys.title,
    status: surveys.status,
    createdBy: surveys.createdBy,
    createdAt: surveys.createdAt,
    updatedAt: surveys.updatedAt,
  };

  const results = status
    ? db.select(baseSelect).from(surveys).where(eq(surveys.status, status as "draft" | "open" | "closed")).all()
    : db.select(baseSelect).from(surveys).all();

  // Non-coordinators cannot see draft surveys
  const filtered =
    userRole === "coordinator"
      ? results
      : results.filter((s) => s.status !== "draft");

  // Add question count and response count
  return filtered.map((survey) => {
    const questionCount = db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(eq(questions.surveyId, survey.id))
      .get();

    const responseCount = db
      .select({ count: sql<number>`count(*)` })
      .from(surveyResponses)
      .where(eq(surveyResponses.surveyId, survey.id))
      .get();

    return {
      ...survey,
      questionCount: questionCount?.count ?? 0,
      responseCount: responseCount?.count ?? 0,
    };
  });
}

export function getSurvey(surveyId: number, userRole?: string) {
  const survey = db
    .select()
    .from(surveys)
    .where(eq(surveys.id, surveyId))
    .get();

  if (!survey) {
    throw new AppError(404, "NOT_FOUND", "Survey not found");
  }

  if (survey.status === "draft" && userRole !== "coordinator") {
    throw new AppError(404, "NOT_FOUND", "Survey not found");
  }

  const surveyQuestions = db
    .select()
    .from(questions)
    .where(eq(questions.surveyId, surveyId))
    .orderBy(questions.orderIndex)
    .all();

  const questionsWithOptions = surveyQuestions.map((q) => {
    const questionOptions = db
      .select()
      .from(options)
      .where(eq(options.questionId, q.id))
      .orderBy(options.orderIndex)
      .all();

    return {
      id: q.id,
      text: q.text,
      orderIndex: q.orderIndex,
      options: questionOptions.map((o) => ({
        id: o.id,
        text: o.text,
        orderIndex: o.orderIndex,
      })),
    };
  });

  return {
    id: survey.id,
    title: survey.title,
    status: survey.status,
    createdBy: survey.createdBy,
    createdAt: survey.createdAt,
    updatedAt: survey.updatedAt,
    questions: questionsWithOptions,
  };
}

export function createSurvey(input: CreateSurveyInput, userId: number) {
  const survey = db
    .insert(surveys)
    .values({
      title: input.title,
      createdBy: userId,
    })
    .returning()
    .get();

  const createdQuestions = input.questions.map((q, qi) => {
    const question = db
      .insert(questions)
      .values({
        surveyId: survey.id,
        text: q.text,
        orderIndex: qi,
      })
      .returning()
      .get();

    const createdOptions = q.options.map((o, oi) => {
      return db
        .insert(options)
        .values({
          questionId: question.id,
          text: o.text,
          orderIndex: oi,
        })
        .returning()
        .get();
    });

    return {
      id: question.id,
      text: question.text,
      orderIndex: question.orderIndex,
      options: createdOptions.map((o) => ({
        id: o.id,
        text: o.text,
        orderIndex: o.orderIndex,
      })),
    };
  });

  return {
    id: survey.id,
    title: survey.title,
    status: survey.status,
    createdBy: survey.createdBy,
    createdAt: survey.createdAt,
    updatedAt: survey.updatedAt,
    questions: createdQuestions,
  };
}

export function updateSurveyStatus(surveyId: number, input: UpdateStatusInput) {
  const survey = db
    .select()
    .from(surveys)
    .where(eq(surveys.id, surveyId))
    .get();

  if (!survey) {
    throw new AppError(404, "NOT_FOUND", "Survey not found");
  }

  // Validate transitions
  const validTransitions: Record<string, string[]> = {
    draft: ["open"],
    open: ["closed"],
    closed: [],
  };

  const allowed = validTransitions[survey.status];
  if (!allowed?.includes(input.status)) {
    throw new AppError(
      400,
      "INVALID_TRANSITION",
      `Cannot transition from '${survey.status}' to '${input.status}'`
    );
  }

  // When opening, verify at least 1 question with at least 1 option
  if (input.status === "open") {
    const surveyQuestions = db
      .select()
      .from(questions)
      .where(eq(questions.surveyId, surveyId))
      .all();

    if (surveyQuestions.length === 0) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "Survey must have at least one question to be opened"
      );
    }

    for (const q of surveyQuestions) {
      const optionCount = db
        .select({ count: sql<number>`count(*)` })
        .from(options)
        .where(eq(options.questionId, q.id))
        .get();

      if (!optionCount || optionCount.count === 0) {
        throw new AppError(
          400,
          "VALIDATION_ERROR",
          `Question "${q.text}" must have at least one option`
        );
      }
    }
  }

  const updated = db
    .update(surveys)
    .set({
      status: input.status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(surveys.id, surveyId))
    .returning()
    .get();

  return updated;
}
