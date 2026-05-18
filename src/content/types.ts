export type AuthorRole = "first" | "co";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  selfIndex: number;
  role: AuthorRole;
  venue: string;
  venueDetail?: string;
  year: number;
  doi?: string;
  arxiv?: string;
  url: string;
  abstract?: string;
}

export interface Talk {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
  language?: string;
  youtubeId?: string;
}

export interface ExpertiseArea {
  id: string;
  title: string;
  description: string;
  tools: string[];
}

export interface RecentItem {
  id: string;
  date: string;
  label: string;
  description: string;
  link?: { href: string; text: string };
}

export interface RecentFeed {
  lastReviewed: string;
  items: RecentItem[];
}

export interface Bio {
  name: string;
  role: string;
  positioning: string;
  location: string;
  languages: string[];
  about: string[];
  social: {
    linkedin: string;
    twitter: string;
    email: string;
  };
  cvs: {
    dataScience: { href: string; label: string };
    mathematics: { href: string; label: string };
  };
}
