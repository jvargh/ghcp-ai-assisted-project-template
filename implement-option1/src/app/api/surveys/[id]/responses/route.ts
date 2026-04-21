import { NextResponse } from "next/server";
import { getSurveyById, submitResponse } from "@/lib/store";
import { submitResponseSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body: unknown = await request.json();

  const parsed = submitResponseSchema.safeParse({ ...body as object, surveyId: id });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid response data",
          details: parsed.error.issues.map((e) => e.message),
        },
      },
      { status: 400 }
    );
  }

  const survey = getSurveyById(id);
  if (!survey) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Survey not found" } },
      { status: 404 }
    );
  }

  try {
    const response = submitResponse(id, parsed.data.answers);
    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "SUBMISSION_FAILED", message } },
      { status: 400 }
    );
  }
}
