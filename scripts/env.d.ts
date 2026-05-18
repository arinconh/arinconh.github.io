// Minimal Node.js globals for scripts run with tsx.
// @types/node is not a dev dependency; declare just what check-recent-freshness.ts needs.
declare const process: {
  argv: string[];
  exit(code?: number): never;
};
