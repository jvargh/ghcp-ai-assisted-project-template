import type { AuthResponse, Survey, SurveyListItem, SurveyResults, User } from "../types";

const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({
      error: { code: "UNKNOWN", message: "An unknown error occurred" },
    }));
    throw body;
  }

  return response.json() as Promise<T>;
}

// Auth
export async function register(
  email: string,
  password: string,
  name: string,
  role: "coordinator" | "respondent"
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name, role }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>("/auth/me");
}

// Surveys
export async function listSurveys(
  status?: string
): Promise<{ surveys: SurveyListItem[] }> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<{ surveys: SurveyListItem[] }>(`/surveys${query}`);
}

export async function getSurvey(
  id: number
): Promise<{ survey: Survey }> {
  return request<{ survey: Survey }>(`/surveys/${id}`);
}

export async function createSurvey(data: {
  title: string;
  questions: Array<{
    text: string;
    options: Array<{ text: string }>;
  }>;
}): Promise<{ survey: Survey }> {
  return request<{ survey: Survey }>("/surveys", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSurveyStatus(
  id: number,
  status: "open" | "closed"
): Promise<{ survey: Survey }> {
  return request<{ survey: Survey }>(`/surveys/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Responses
export async function submitResponse(
  surveyId: number,
  answers: Array<{ questionId: number; optionId: number }>
): Promise<{ response: { id: number; surveyId: number; submittedAt: string } }> {
  return request(`/surveys/${surveyId}/responses`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export async function getSurveyResults(
  surveyId: number
): Promise<SurveyResults> {
  return request<SurveyResults>(`/surveys/${surveyId}/responses/results`);
}
