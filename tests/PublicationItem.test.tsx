import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PublicationItem } from "../src/components/PublicationItem";
import type { Publication } from "../src/content/types";

const fixture: Publication = {
  id: "test-pub",
  title: "A Test Paper",
  authors: ["First Author", "Alejandra Rincón Hidalgo", "Third Author"],
  selfIndex: 1,
  role: "co",
  venue: "Test Journal",
  year: 2026,
  doi: "10.0000/test",
  url: "https://example.com/test",
  abstract: "A short abstract for testing expansion behavior.",
};

describe("PublicationItem", () => {
  it("renders title, venue, year, role badge in compact view", () => {
    render(<PublicationItem index={1} pub={fixture} />);
    expect(screen.getByRole("link", { name: /A Test Paper/i })).toHaveAttribute("href", fixture.url);
    expect(screen.getByText(/Test Journal/i)).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText(/Co-author/i)).toBeInTheDocument();
  });

  it("hides author list and abstract by default", () => {
    render(<PublicationItem index={1} pub={fixture} />);
    expect(screen.queryByText("Third Author")).not.toBeInTheDocument();
    expect(screen.queryByText(/short abstract for testing/i)).not.toBeInTheDocument();
  });

  it("expands to show full authors with self bolded and abstract on click", async () => {
    const user = userEvent.setup();
    render(<PublicationItem index={1} pub={fixture} />);
    await user.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("Third Author")).toBeInTheDocument();
    const self = screen.getByText("Alejandra Rincón Hidalgo");
    expect(self.tagName).toBe("STRONG");
    expect(screen.getByText(/short abstract for testing/i)).toBeInTheDocument();
  });

  it("shows 'First author' badge filled with accent when role is first", () => {
    render(<PublicationItem index={1} pub={{ ...fixture, role: "first" }} />);
    const badge = screen.getByText(/First author/i);
    expect(badge).toHaveClass("bg-accent");
  });
});
