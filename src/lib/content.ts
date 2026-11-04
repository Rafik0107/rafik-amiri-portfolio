import data from "../../content/portfolio.json";

export type Lang = "fr" | "en";
export const LANGS: Lang[] = ["fr", "en"];
export type L = { fr: string; en: string };
export type Text = string | L;

export type Status = "completed" | "in-development" | "planned";

export type Category = "robotics" | "automation" | "ai" | "signal" | "software";
export const CATEGORIES: Category[] = ["robotics", "automation", "ai", "signal", "software"];

export interface Project {
  slug: string;
  title: L;
  category: Category;
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
  alt: string;
  category: string;
}

/** A documented graphic-design piece. Only real, owner-supplied work belongs here. */
export interface DesignWork {
  src: string;
  w: number;
  h: number;
  title: L;
  context: L;
  goal: L;
  role: L;
  tools: string[];
  choices: L;
}

export interface Portfolio {
  profile: {
    name: string;
    alias: string;
    subtitle: L;
    creativeRole: L;
    location: string;
    headline: L;
    bio: L;
    creativeBio: L;
    selfEmployed: L;
    links: { github: string; carrd: string; instagram: string; email: string };
    cvPdf: L;
  };
  education: Entry[];
  internships: Entry[];
  jobs: Entry[];
  transferableSkills: (L & { from: L })[];
  skills: { group: string; items: string[] }[];
  projects: Project[];
  githubRepo: { name: string; url: string; note: L };
  photos: Photo[];
  designWorks: DesignWork[];
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

/** Caption only when it is known; alt text is always present. */
export function photoCaption(p: Photo, lang: Lang) {
  return lang === "fr" ? p.title : p.titleEn;
}
