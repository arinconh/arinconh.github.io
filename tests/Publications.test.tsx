import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Publications } from "../src/components/Publications";
import { publications } from "../src/content/publications";

describe("Publications section", () => {
  it("renders every publication", () => {
    render(<Publications />);
    publications.forEach((p) => {
      expect(screen.getByText(p.title, { exact: false })).toBeInTheDocument();
    });
  });

  it("orders publications newest first by year", () => {
    render(<Publications />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent ?? "");
    const years = titles.map((t) => publications.find((p) => p.title === t)?.year ?? 0);
    const sortedDesc = [...years].sort((a, b) => b - a);
    expect(years).toEqual(sortedDesc);
  });
});
