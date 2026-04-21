import { render, screen } from "@testing-library/react";
import { SurveyList } from "@/components/survey-list";
import type { Survey } from "@/types";

const mockSurveys: Survey[] = [
  {
    id: "1",
    title: "First Survey",
    status: "open",
    questions: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Second Survey",
    status: "draft",
    questions: [],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

describe("SurveyList", () => {
  it("renders survey titles", () => {
    render(<SurveyList surveys={mockSurveys} />);
    expect(screen.getByText("First Survey")).toBeInTheDocument();
    expect(screen.getByText("Second Survey")).toBeInTheDocument();
  });

  it("renders survey status", () => {
    render(<SurveyList surveys={mockSurveys} />);
    expect(screen.getByText("Status: open")).toBeInTheDocument();
    expect(screen.getByText("Status: draft")).toBeInTheDocument();
  });

  it("renders empty message when no surveys", () => {
    render(<SurveyList surveys={[]} emptyMessage="No surveys available." />);
    expect(screen.getByText("No surveys available.")).toBeInTheDocument();
  });

  it("renders default empty message", () => {
    render(<SurveyList surveys={[]} />);
    expect(screen.getByText("No surveys found.")).toBeInTheDocument();
  });

  it("renders action buttons when onAction provided", () => {
    const mockAction = jest.fn();
    render(
      <SurveyList surveys={mockSurveys} actionLabel="Open" onAction={mockAction} />
    );
    expect(screen.getAllByText("Open")).toHaveLength(2);
  });
});
