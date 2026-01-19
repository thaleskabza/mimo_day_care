import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";

describe("Footer Component", () => {
  it("should render the footer with brand name", () => {
    render(<Footer />);
    expect(screen.getByText("MiMo Day Care")).toBeInTheDocument();
  });

  it("should render Quick Links section", () => {
    render(<Footer />);
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /programs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /fees/i })).toBeInTheDocument();
  });

  it("should render For Parents section", () => {
    render(<Footer />);
    expect(screen.getByText("For Parents")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apply now/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /parent portal/i })).toBeInTheDocument();
  });

  it("should render Contact section", () => {
    render(<Footer />);
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText(/123 Learning Lane/i)).toBeInTheDocument();
  });

  it("should render copyright with current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear}.*MiMo Day Care`, "i"))).toBeInTheDocument();
  });

  it("should have correct href attributes for links", () => {
    render(<Footer />);
    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink).toHaveAttribute("href", "/about");

    const applyLink = screen.getByRole("link", { name: /apply now/i });
    expect(applyLink).toHaveAttribute("href", "/apply");
  });
});
