import type { Survey, SurveyResponse, SurveyResults, SurveyStatus, ApiError } from "@/types";
import type { CreateSurveyInput } from "@/lib/validation";

const API_BASE = "/api/surveys";

async function handleResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();
  if (!response.ok) {
    const errorData = data as ApiError;
    throw new Error(errorData.error?.message ?? "Request failed");
  }
  return data as T;
}

export async function fetchSurveys(status?: SurveyStatus): Promise<Survey[]> {
  const url = status ? `${API_BASE}?status=${status}` : API_BASE;
  const response = await fetch(url);
  return handleResponse<Survey[]>(response);
}

export async function fetchSurveyById(id: string): Promise<Survey> {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse<Survey>(response);
}

export async function createSurveyRequest(data: CreateSurveyInput): Promise<Survey> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Survey>(response);
}

export async function updateSurveyStatusRequest(
  id: string,
  status: SurveyStatus
): Promise<Survey> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Survey>(response);
}

export async function submitSurveyResponse(
  surveyId: string,
  answers: Record<string, string>
): Promise<SurveyResponse> {
  const response = await fetch(`${API_BASE}/${surveyId}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return handleResponse<SurveyResponse>(response);
}

export async function fetchSurveyResults(surveyId: string): Promise<SurveyResults> {
  const response = await fetch(`${API_BASE}/${surveyId}/results`);
  return handleResponse<SurveyResults>(response);
}
