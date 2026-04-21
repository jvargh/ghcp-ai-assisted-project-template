import { eq, sql, and } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  surveys,
  questions,
  options,
  surveyResponses,
  answers,
} from "../db/schema.js";
import { AppError } from "../middleware/errorHandler.js";
import type { SubmitResponseInput } from "../validators/response.js";

export function submitResponse(
  surveyId: number,
  userId: number,
  input: SubmitResponseInput
) {
  // Verify survey exists and is open
  const survey = db
    .select()
    .from(surveys)
    .where(eq(surveys.id, surveyId))
    .get();

  if (!survey) {
    throw new AppError(404, "NOT_FOUND", "Survey not found");
  }

  if (survey.status !== "open") {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Survey is not open for responses"
    );
  }

  // Check for duplicate response
  const existingResponse = db
    .select()
    .from(surveyResponses)
    .where(
      and(
        eq(surveyResponses.surveyId, surveyId),
        eq(surveyResponses.respondentId, userId)
      )
    )
    .get();

  if (existingResponse) {
    throw new AppError(
      409,
      "CONFLICT",
      "You have already responded to this survey"
    );
  }

  // Get all questions for this survey
  const surveyQuestions = db
    .select()
    .from(questions)
    .where(eq(questions.surveyId, surveyId))
    .all();

  // Verify all questions are answered
  const answeredQuestionIds = new Set(
    input.answers.map((a) => a.questionId)
  );
  const surveyQuestionIds = new Set(surveyQuestions.map((q) => q.id));

  for (const qId of surveyQuestionIds) {
    if (!answeredQuestionIds.has(qId)) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "All questions must be answered"
      );
    }
  }

  // Verify each answer references valid question/option pairs
  for (const answer of input.answers) {
    if (!surveyQuestionIds.has(answer.questionId)) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        `Question ${answer.questionId} does not belong to this survey`
      );
    }

    const option = db
      .select()
      .from(options)
      .where(
        and(
          eq(options.id, answer.optionId),
          eq(options.questionId, answer.questionId)
        )
      )
      .get();

    if (!option) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        `Option ${answer.optionId} does not belong to question ${answer.questionId}`
      );
    }
  }

  // Create response and answers
  const response = db
    .insert(surveyResponses)
    .values({
      surveyId,
      respondentId: userId,
    })
    .returning()
    .get();

  for (const answer of input.answers) {
    db.insert(answers)
      .values({
        responseId: response.id,
        questionId: answer.questionId,
        optionId: answer.optionId,
      })
      .run();
  }

  return {
    id: response.id,
    surveyId: response.surveyId,
    submittedAt: response.submittedAt,
  };
}

export function getSurveyResults(surveyId: number) {
  const survey = db
    .select()
    .from(surveys)
    .where(eq(surveys.id, surveyId))
    .get();

  if (!survey) {
    throw new AppError(404, "NOT_FOUND", "Survey not found");
  }

  if (survey.status !== "closed") {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Results are only available for closed surveys"
    );
  }

  const totalResponses = db
    .select({ count: sql<number>`count(*)` })
    .from(surveyResponses)
    .where(eq(surveyResponses.surveyId, surveyId))
    .get();

  const surveyQuestions = db
    .select()
    .from(questions)
    .where(eq(questions.surveyId, surveyId))
    .orderBy(questions.orderIndex)
    .all();

  const questionsWithResults = surveyQuestions.map((q) => {
    const questionOptions = db
      .select()
      .from(options)
      .where(eq(options.questionId, q.id))
      .orderBy(options.orderIndex)
      .all();

    const optionsWithCounts = questionOptions.map((o) => {
      const count = db
        .select({ count: sql<number>`count(*)` })
        .from(answers)
        .where(eq(answers.optionId, o.id))
        .get();

      return {
        id: o.id,
        text: o.text,
        count: count?.count ?? 0,
      };
    });

    return {
      id: q.id,
      text: q.text,
      options: optionsWithCounts,
    };
  });

  return {
    survey: {
      id: survey.id,
      title: survey.title,
      totalResponses: totalResponses?.count ?? 0,
      questions: questionsWithResults,
    },
  };
}
