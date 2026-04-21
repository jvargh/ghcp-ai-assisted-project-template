import { render, screen } from "@testing-library/react";
import { SurveyResultsTable } from "@/components/survey-results-table";
import type { SurveyResults } from "@/types";

const mockResults: SurveyResults = {
  surveyId: "s1",
  surveyTitle: "Customer Feedback",
  totalResponses: 5,
  questions: [
    {
      questionId: "q1",
      questionText: "How satisfied are you?",
      selections: [
        { selectionId: "s1a", selectionText: "Very satisfied", count: 3 },
        { selectionId: "s1b", selectionText: "Satisfied", count: 2 },
        { selectionId: "s1c", selectionText: "Unsatisfied", count: 0 },
      ],
    },
  ],
};

describe("SurveyResultsTable", () => {
  it("renders the survey title", () => {
    render(<SurveyResultsTable results={mockResults} />);
    expect(screen.getByText("Customer Feedback")).toBeInTheDocument();
  });

  it("renders total responses", () => {
    render(<SurveyResultsTable results={mockResults} />);
    expect(screen.getByText("Total responses: 5")).toBeInTheDocument();
  });

  it("renders question text", () => {
    render(<SurveyResultsTable results={mockResults} />);
    expect(screen.getByText("1. How satisfied are you?")).toBeInTheDocument();
  });

  it("renders selection texts and counts", () => {
    render(<SurveyResultsTable results={mockResults} />);
    expect(screen.getByText("Very satisfied")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Satisfied")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Unsatisfied")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
