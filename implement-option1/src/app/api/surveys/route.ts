import { NextResponse } from "next/server";
import { getAllSurveys, getSurveysByStatus, createSurvey } from "@/lib/store";
import { createSurveySchema } from "@/lib/validation";
import { seedDevelopmentData } from "@/lib/seed";
import type { SurveyStatus } from "@/types";

let seeded = false;
function ensureSeeded() {
  if (!seeded && process.env.NODE_ENV !== "production") {
    seedDevelopmentData();
    seeded = true;
  }
}

export async function GET(request: Request) {
  ensureSeeded();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as SurveyStatus | null;

  const surveys = status ? getSurveysByStatus(status) : getAllSurveys();
  return NextResponse.json(surveys);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSurveySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid survey data",
          details: parsed.error.issues.map((e) => e.message),
        },
      },
      { status: 400 }
    );
  }

  const survey = createSurvey(parsed.data);
  return NextResponse.json(survey, { status: 201 });
}
