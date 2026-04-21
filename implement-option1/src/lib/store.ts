import type { Survey, SurveyResponse, SurveyStatus } from "@/types";
import { generateId } from "@/lib/id";
import { transition } from "@/lib/survey-lifecycle";
import type { CreateSurveyInput } from "@/lib/validation";

interface Store {
  surveys: Map<string, Survey>;
  responses: Map<string, SurveyResponse[]>;
}

const store: Store = {
  surveys: new Map(),
  responses: new Map(),
};

// --- Surveys ---

export function getAllSurveys(): Survey[] {
  return Array.from(store.surveys.values());
}

export function getSurveysByStatus(status: SurveyStatus): Survey[] {
  return getAllSurveys().filter((s) => s.status === status);
}

export function getSurveyById(id: string): Survey | undefined {
  return store.surveys.get(id);
}

export function createSurvey(input: CreateSurveyInput): Survey {
  const now = new Date().toISOString();
  const survey: Survey = {
    id: generateId(),
    title: input.title,
    status: "draft",
    questions: input.questions.map((q) => ({
      id: q.id || generateId(),
      text: q.text,
      selections: q.selections.map((s) => ({
        id: s.id || generateId(),
        text: s.text,
      })),
    })),
    createdAt: now,
    updatedAt: now,
  };

  store.surveys.set(survey.id, survey);
  store.responses.set(survey.id, []);
  return survey;
}

export function updateSurveyStatus(
  id: string,
  targetStatus: SurveyStatus
): Survey {
  const survey = store.surveys.get(id);
  if (!survey) {
    throw new Error(`Survey not found: ${id}`);
  }

  const newStatus = transition(survey.status, targetStatus);
  const updated: Survey = {
    ...survey,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  store.surveys.set(id, updated);
  return updated;
}

// --- Responses ---

export function getResponsesBySurveyId(
  surveyId: string
): SurveyResponse[] {
  return store.responses.get(surveyId) ?? [];
}

export function submitResponse(
  surveyId: string,
  answers: Record<string, string>
): SurveyResponse {
  const survey = store.surveys.get(surveyId);
  if (!survey) {
    throw new Error(`Survey not found: ${surveyId}`);
  }
  if (survey.status !== "open") {
    throw new Error("Responses can only be submitted to open surveys");
  }

  // Validate all questions are answered
  const questionIds = survey.questions.map((q) => q.id);
  const missingQuestions = questionIds.filter((qid) => !answers[qid]);
  if (missingQuestions.length > 0) {
    throw new Error(
      `All questions must be answered. Missing: ${missingQuestions.join(", ")}`
    );
  }

  // Validate each answer references a valid selection for its question
  for (const [questionId, selectionId] of Object.entries(answers)) {
    const question = survey.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error(`Invalid question ID: ${questionId}`);
    }
    const validSelection = question.selections.find(
      (s) => s.id === selectionId
    );
    if (!validSelection) {
      throw new Error(
        `Invalid selection "${selectionId}" for question "${questionId}"`
      );
    }
  }

  const response: SurveyResponse = {
    id: generateId(),
    surveyId,
    answers,
    submittedAt: new Date().toISOString(),
  };

  const existing = store.responses.get(surveyId) ?? [];
  existing.push(response);
  store.responses.set(surveyId, existing);

  return response;
}

// --- Results ---

export function tabulateResults(surveyId: string) {
  const survey = store.surveys.get(surveyId);
  if (!survey) {
    throw new Error(`Survey not found: ${surveyId}`);
  }

  const responses = store.responses.get(surveyId) ?? [];

  return {
    surveyId: survey.id,
    surveyTitle: survey.title,
    totalResponses: responses.length,
    questions: survey.questions.map((question) => ({
      questionId: question.id,
      questionText: question.text,
      selections: question.selections.map((selection) => ({
        selectionId: selection.id,
        selectionText: selection.text,
        count: responses.filter(
          (r) => r.answers[question.id] === selection.id
        ).length,
      })),
    })),
  };
}

// --- Testing utility ---

export function resetStore(): void {
  store.surveys.clear();
  store.responses.clear();
}
