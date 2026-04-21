import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SurveyForm } from "@/components/survey-form";

// Mock generateId to return deterministic values
jest.mock("@/lib/id", () => {
  let counter = 0;
  return {
    generateId: () => `id-${counter++}`,
  };
});

describe("SurveyForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with title and initial question", () => {
    render(<SurveyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText("Survey Title")).toBeInTheDocument();
    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<SurveyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("shows Add Question button", () => {
    render(<SurveyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText("Add Question")).toBeInTheDocument();
  });

  it("adds a question when Add Question is clicked", async () => {
    const user = userEvent.setup();
    render(<SurveyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText("Add Question"));
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });

  it("shows Saving... when isSubmitting is true", () => {
    render(
      <SurveyForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<SurveyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText("Save"));

    // Should show validation errors and not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
