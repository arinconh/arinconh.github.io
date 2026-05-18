import type { RecentFeed } from "./types";

export const recent: RecentFeed = {
  lastReviewed: "2026-05-18",
  items: [
    {
      id: "epidemics-2026",
      date: "2026-03",
      label: "Paper published",
      description:
        "Social contact patterns from epidemiological survey vs. GPS co-location, out in Epidemics.",
      link: {
        href: "https://doi.org/10.1016/j.epidem.2026.100886",
        text: "Read",
      },
    },
    {
      id: "medrxiv-fitness-2026",
      date: "2026-03",
      label: "Preprint",
      description:
        "Inferring respiratory disease biology from geolocation data, first-author preprint on medRxiv.",
      link: {
        href: "https://doi.org/10.64898/2026.03.05.26347578",
        text: "Read",
      },
    },
  ],
};
