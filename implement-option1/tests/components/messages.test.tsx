import { render, screen } from "@testing-library/react";
import { ErrorMessage, SuccessMessage } from "@/components/messages";

describe("ErrorMessage", () => {
  it("renders the error message", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});

describe("SuccessMessage", () => {
  it("renders the success message", () => {
    render(<SuccessMessage message="Operation completed" />);
    expect(screen.getByText("Operation completed")).toBeInTheDocument();
  });
});
