import { render, screen, fireEvent } from "@testing-library/react";
import { SurveyResponseForm } from "@/components/survey-response-form";
import type { Survey } from "@/types";

const mockSurvey: Survey = {
  id: "s1",
  title: "Test Survey",
  status: "open",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  questions: [
    {
      id: "q1",
      text: "What is your favorite color?",
      selections: [
        { id: "s1a", text: "Red" },
        { id: "s1b", text: "Blue" },
      ],
    },
    {
      id: "q2",
      text: "What is your favorite food?",
      selections: [
        { id: "s2a", text: "Pizza" },
        { id: "s2b", text: "Sushi" },
      ],
    },
  ],
};

describe("SurveyResponseForm", () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders survey title and questions", () => {
    render(
      <SurveyResponseForm survey={mockSurvey} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(screen.getByText("Test Survey")).toBeInTheDocument();
    expect(screen.getByText("1. What is your favorite color?")).toBeInTheDocument();
    expect(screen.getByText("2. What is your favorite food?")).toBeInTheDocument();
  });

  it("renders all selection options as radio buttons", () => {
    render(
      <SurveyResponseForm survey={mockSurvey} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Sushi")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("shows error when submitting without answering all questions", () => {
    render(
      <SurveyResponseForm survey={mockSurvey} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.click(screen.getByText("Submit"));
    expect(
      screen.getByText("All questions must be answered before submitting.")
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with answers when all questions are answered", () => {
    render(
      <SurveyResponseForm survey={mockSurvey} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.click(screen.getByLabelText("Red"));
    fireEvent.click(screen.getByLabelText("Pizza"));
    fireEvent.click(screen.getByText("Submit"));
    expect(mockSubmit).toHaveBeenCalledWith({ q1: "s1a", q2: "s2a" });
  });

  it("allows changing selection (radio behavior)", () => {
    render(
      <SurveyResponseForm survey={mockSurvey} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.click(screen.getByLabelText("Red"));
    fireEvent.click(screen.getByLabelText("Blue"));
    fireEvent.click(screen.getByLabelText("Sushi"));
    fireEvent.click(screen.getByText("Submit"));
    expect(mockSubmit).toHaveBeenCalledWith({ q1: "s1b", q2: "s2b" });
  });

  it("calls onCancel when Cancel is clicked", () => {
    render(
      <SurveyResponseForm survey={mockSurvey} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCancel).toHaveBeenCalled();
  });
});
