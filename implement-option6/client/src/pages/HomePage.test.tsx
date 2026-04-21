import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { AuthProvider } from "../context/AuthContext";

function renderWithProviders(ui: React.ReactElement, route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  it("should render welcome message", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByText("Welcome to Survey App")
    ).toBeInTheDocument();
  });

  it("should show login/register links when not authenticated", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });
});
