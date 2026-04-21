import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the heading", () => {
    render(<Home />);
    expect(screen.getByText("Survey App")).toBeInTheDocument();
  });

  it("renders role descriptions", () => {
    render(<Home />);
    expect(screen.getByText("Survey Coordinators")).toBeInTheDocument();
    expect(screen.getByText("Survey Respondents")).toBeInTheDocument();
  });
});
