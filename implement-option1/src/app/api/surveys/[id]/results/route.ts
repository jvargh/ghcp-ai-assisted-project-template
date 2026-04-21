import { NextResponse } from "next/server";
import { getSurveyById, tabulateResults } from "@/lib/store";

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

  const results = tabulateResults(id);
  return NextResponse.json(results);
}
