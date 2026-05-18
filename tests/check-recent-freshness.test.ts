import { describe, it, expect } from "vitest";
import { daysSince, isStale, STALENESS_THRESHOLD_DAYS } from "../scripts/check-recent-freshness";

describe("check-recent-freshness", () => {
  it("computes days since a past ISO date", () => {
    const now = new Date("2026-05-18T12:00:00Z");
    expect(daysSince("2026-05-11", now)).toBe(7);
    expect(daysSince("2026-04-18", now)).toBe(30);
  });

  it(`flags stale when lastReviewed older than ${STALENESS_THRESHOLD_DAYS} days`, () => {
    const now = new Date("2026-05-18T12:00:00Z");
    expect(isStale("2026-05-01", now)).toBe(false);
    expect(isStale("2026-03-15", now)).toBe(true);
  });
});
