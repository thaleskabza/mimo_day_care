import { render, screen } from "@testing-library/react";
import Navigation from "@/components/layout/Navigation";

// Mock next-auth is already set up in jest.setup.ts

describe("Navigation Component", () => {
  it("should render the brand name", () => {
    render(<Navigation />);
    expect(screen.getByText("MiMo Day Care")).toBeInTheDocument();
  });

  it("should render public navigation links", () => {
    render(<Navigation />);
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /programs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /fees/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /calendar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
  });

  it("should show Sign In and Apply Now buttons when not authenticated", () => {
    render(<Navigation />);
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apply now/i })).toBeInTheDocument();
  });

  it("should have correct href attributes for public links", () => {
    render(<Navigation />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink).toHaveAttribute("href", "/about");

    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toHaveAttribute("href", "/login");
  });

  it("should render mobile menu button", () => {
    render(<Navigation />);
    const menuButton = screen.getByRole("button", { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
