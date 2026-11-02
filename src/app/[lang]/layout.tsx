import type { Metadata, Viewport } from "next";
import { Cinzel, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { LANGS, SITE_URL, isLang, portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import Cursor from "@/components/Cursor";
import Reveals from "@/components/Reveals";
import RaidenAI from "@/components/RaidenAI";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-cinzel", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-manrope", display: "swap" });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = isLang(lang) ? lang : "fr";
  const title = "Rafik Amiri (Raiden) — " + t(portfolio.profile.subtitle, l);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s · Rafik Amiri (Raiden)" },
    description: t(portfolio.profile.headline, l),
    applicationName: "Rafik Amiri (Raiden)",
    authors: [{ name: "Rafik Amiri", url: portfolio.profile.links.github }],
    keywords: ["Rafik Amiri", "Raiden", "robotique", "robotics", "automatique", "mechatronics", "Sorbonne Université", "photographie", "photography", "Paris", "portfolio"],
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  };
}

export const viewport: Viewport = { themeColor: "#050508", colorScheme: "dark" };

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDict(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rafik Amiri",
    alternateName: "Raiden",
    jobTitle: t(portfolio.profile.headline, lang),
    address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
    alumniOf: ["Université Sorbonne Paris Nord", "Université M'hamed Bougara de Boumerdès"],
    affiliation: { "@type": "CollegeOrUniversity", name: "Sorbonne Université" },
    url: SITE_URL,
    sameAs: [portfolio.profile.links.github, portfolio.profile.links.carrd, portfolio.profile.links.instagram],
  };

  return (
    <html lang={lang} suppressHydrationWarning className={`${cinzel.variable} ${manrope.variable}`}>
      <body className="grain min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-void focus:px-4 focus:py-2">
          {lang === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <Intro lang={lang} skipLabel={d.skip} subtitle={t(portfolio.profile.subtitle, lang)} />
        <Nav lang={lang} />
        <main id="main">{children}</main>
        <Footer lang={lang} />
        <RaidenAI lang={lang} />
        <Cursor />
        <Reveals />
      </body>
    </html>
  );
}
