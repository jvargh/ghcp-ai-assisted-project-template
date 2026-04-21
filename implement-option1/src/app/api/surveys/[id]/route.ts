import { NextResponse } from "next/server";
import { getSurveyById, updateSurveyStatus } from "@/lib/store";
import type { SurveyStatus } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const survey = getSurveyById(id);

  if (!survey) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Survey not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json(survey);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as { status?: SurveyStatus };

  if (!body.status) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Status field is required",
        },
      },
      { status: 400 }
    );
  }

  try {
    const updated = updateSurveyStatus(id, body.status);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message } },
      { status }
    );
  }
}
