import data from "../../content/portfolio.json";

export type Lang = "fr" | "en";
export const LANGS: Lang[] = ["fr", "en"];
export type L = { fr: string; en: string };
export type Text = string | L;

export type Status = "completed" | "in-development" | "planned";

export interface Project {
  slug: string;
  title: L;
  category: "robotics" | "ai" | "automation" | "software";
  status: Status;
  source: "cv" | "github";
  year?: string;
  tech: string[];
  repo?: string;
  summary: L;
  method?: L;
  results?: L;
  limits?: L;
  viz?: string;
}

export interface Entry {
  id: string;
  period: Text;
  start?: number;
  title: L;
  org: Text;
  place: string;
  details: L;
  skills?: string[];
  project?: string;
  current?: boolean;
}

export interface Photo {
  src: string;
  w: number;
  h: number;
  title: string;
  titleEn: string;
  category: string;
}

export interface Portfolio {
  profile: {
    name: string;
    alias: string;
    subtitle: L;
    location: string;
    headline: L;
    bio: L;
    creativeBio: L;
    selfEmployed: L;
    links: { github: string; carrd: string; instagram: string; email: string };
    cvPdf: string;
  };
  education: Entry[];
  internships: Entry[];
  jobs: Entry[];
  transferableSkills: (L & { from: L })[];
  skills: { group: string; items: string[] }[];
  projects: Project[];
  githubRepo: { name: string; url: string; note: L };
  photos: Photo[];
  ai: { enabled: boolean; extraInstructions: string };
}

export const portfolio = data as unknown as Portfolio;

export function t(value: Text | undefined, lang: Lang): string {
  if (!value) return "";
  return typeof value === "string" ? value : value[lang] ?? value.fr;
}

export function isLang(v: string): v is Lang {
  return (LANGS as string[]).includes(v);
}

export function getProject(slug: string) {
  return portfolio.projects.find((p) => p.slug === slug);
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rafik-amiri-portfolio.vercel.app").replace(/\/$/, "");
