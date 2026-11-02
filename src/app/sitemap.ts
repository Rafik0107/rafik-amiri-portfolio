import type { MetadataRoute } from "next";
import { LANGS, SITE_URL, portfolio } from "@/lib/content";
import { NAV_KEYS } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...NAV_KEYS.map((k) => `/${k}`), ...portfolio.projects.map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((p) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p.startsWith("/projects/") ? 0.6 : 0.8,
      alternates: { languages: { fr: `${SITE_URL}/fr${p}`, en: `${SITE_URL}/en${p}` } },
    })),
  );
}
