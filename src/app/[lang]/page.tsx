import Link from "next/link";
import Hero from "@/components/Hero";
import Portals from "@/components/Portals";
import Gallery from "@/components/Gallery";
import { ProjectCard, Section } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "", `Rafik Amiri (Raiden) — ${t(portfolio.profile.subtitle, lang)}`, t(portfolio.profile.headline, lang));
}

export default async function Home({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const featured = ["smart-factory-web-app", "arm-kinematics", "kalman-tracking"].map((s) => portfolio.projects.find((p) => p.slug === s)!);
  const stats = [
    { n: portfolio.projects.filter((p) => p.source === "github" && p.status === "completed").length, l: fr ? "projets Python testés" : "tested Python projects" },
    { n: portfolio.internships.length, l: fr ? "stages en industrie & tech" : "industry & tech internships" },
    { n: 41, l: fr ? "tests automatisés au vert" : "passing automated tests" },
    { n: portfolio.photos.length, l: fr ? "photographies originales" : "original photographs" },
  ];

  return (
    <>
      <Hero
        lang={lang}
        subtitle={t(portfolio.profile.subtitle, lang)}
        headline={t(portfolio.profile.headline, lang)}
        cta={d.explore}
        cta2={d.nav.contact}
      />
      <Portals lang={lang} />

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gold/15 bg-gold/10 md:grid-cols-4" aria-label={fr ? "Chiffres clés" : "Key figures"}>
        {stats.map((s, i) => (
          <div key={s.l} className="reveal bg-void p-8 text-center" data-delay={String(i * 0.08)}>
            <p className="font-display text-5xl"><span className="gold-text">{s.n}</span></p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-mist">{s.l}</p>
          </div>
        ))}
      </section>

      <Section kicker={d.nav.projects} title={d.sections.featured}>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => <div key={p.slug} className="reveal"><ProjectCard p={p} lang={lang} /></div>)}
        </div>
        <Link href={`/${lang}/projects`} className="reveal mt-10 inline-block text-xs uppercase tracking-[0.3em] text-gold hover:text-gold-bright">{d.viewAll} ({portfolio.projects.length}) →</Link>
      </Section>

      <Section kicker={d.nav.photography} title={d.sections.studio}>
        <Gallery photos={portfolio.photos} lang={lang} limit={6} />
        <Link href={`/${lang}/photography`} className="reveal mt-6 inline-block text-xs uppercase tracking-[0.3em] text-gold hover:text-gold-bright">{d.viewAll} →</Link>
      </Section>
    </>
  );
}
