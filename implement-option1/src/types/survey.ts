export type SurveyStatus = "draft" | "open" | "closed";

export interface Selection {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  selections: Selection[];
}

export interface Survey {
  id: string;
  title: string;
  status: SurveyStatus;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string>; // questionId -> selectionId
  submittedAt: string;
}

export interface SurveyResults {
  surveyId: string;
  surveyTitle: string;
  questions: QuestionResult[];
  totalResponses: number;
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  selections: SelectionResult[];
}

export interface SelectionResult {
  selectionId: string;
  selectionText: string;
  count: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}
