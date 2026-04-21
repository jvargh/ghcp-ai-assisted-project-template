export interface User {
  id: number;
  email: string;
  name: string;
  role: "coordinator" | "respondent";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SurveyOption {
  id: number;
  text: string;
  orderIndex: number;
}

export interface SurveyQuestion {
  id: number;
  text: string;
  orderIndex: number;
  options: SurveyOption[];
}

export interface Survey {
  id: number;
  title: string;
  status: "draft" | "open" | "closed";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  questions?: SurveyQuestion[];
}

export interface SurveyListItem extends Omit<Survey, "questions"> {
  questionCount: number;
  responseCount: number;
}

export interface ResultOption {
  id: number;
  text: string;
  count: number;
}

export interface ResultQuestion {
  id: number;
  text: string;
  options: ResultOption[];
}

export interface SurveyResults {
  survey: {
    id: number;
    title: string;
    totalResponses: number;
    questions: ResultQuestion[];
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }>;
  };
}
