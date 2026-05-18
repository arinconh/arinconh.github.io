import { recent } from "../src/content/recent";

export const STALENESS_THRESHOLD_DAYS = 56;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysSince(isoDate: string, now: Date = new Date()): number {
  const then = new Date(isoDate + "T00:00:00Z");
  return Math.floor((now.getTime() - then.getTime()) / MS_PER_DAY);
}

export function isStale(isoDate: string, now: Date = new Date()): boolean {
  return daysSince(isoDate, now) > STALENESS_THRESHOLD_DAYS;
}

function main(): void {
  const days = daysSince(recent.lastReviewed);
  if (recent.items.length > 5) {
    console.error(`✗ Recent has ${recent.items.length} items; max is 5.`);
    process.exit(1);
  }
  if (isStale(recent.lastReviewed)) {
    console.warn(
      `⚠ Recent feed is stale: lastReviewed=${recent.lastReviewed} (${days} days ago, threshold ${STALENESS_THRESHOLD_DAYS}).`
    );
    console.warn("   Review src/content/recent.ts and update lastReviewed.");
    process.exit(0);
  }
  console.log(`✓ Recent feed reviewed ${days} days ago.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
