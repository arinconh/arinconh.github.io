import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Recent } from "../src/components/Recent";
import { recent } from "../src/content/recent";

describe("Recent section", () => {
  it("renders all items with date label and description", () => {
    render(<Recent />);
    recent.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  it("never renders more than 5 items", () => {
    render(<Recent />);
    const headings = screen.getAllByRole("listitem");
    expect(headings.length).toBeLessThanOrEqual(5);
  });
});
