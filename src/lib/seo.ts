import type { Metadata } from "next";
import { SITE_URL, type Lang } from "./content";

export function pageMeta(lang: Lang, path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}/${lang}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: `${SITE_URL}/fr${path}`, en: `${SITE_URL}/en${path}`, "x-default": `${SITE_URL}/fr${path}` },
    },
    openGraph: { title, description, url, siteName: "Rafik Amiri (Raiden)", locale: lang === "fr" ? "fr_FR" : "en_US", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
