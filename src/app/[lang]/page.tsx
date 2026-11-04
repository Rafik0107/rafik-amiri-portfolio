import Image from "next/image";
import Link from "next/link";
import ControlLoop from "@/components/ControlLoop";
import Hero from "@/components/Hero";
import { ProjectCard, Section } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { FEATURED_HOME } from "@/lib/domains";
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
  const featured = FEATURED_HOME.map((s) => portfolio.projects.find((p) => p.slug === s)!);
  const dated = portfolio.internships.filter((i) => i.start);
  const photo = portfolio.photos.find((p) => p.src.endsWith("27bc6f7e.jpg"))!;
  const stats = [
    { n: portfolio.projects.length, l: fr ? "projets documentés" : "documented projects" },
    { n: dated.length, l: fr ? "stages en entreprise" : "company internships" },
    { n: 41, l: fr ? "tests automatisés au vert" : "passing automated tests" },
    { n: portfolio.photos.length, l: fr ? "photographies originales" : "original photographs" },
  ];

  return (
    <>
      <Hero lang={lang} />

      <div className="px-4 md:px-8">
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gold/15 bg-gold/10 md:grid-cols-4" aria-label={fr ? "Chiffres clés" : "Key figures"}>
        {stats.map((s, i) => (
          <div key={s.l} className="reveal bg-void px-6 py-7 text-center" data-delay={String(i * 0.06)}>
            <p className="font-display text-4xl"><span className="gold-text">{s.n}</span></p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-mist">{s.l}</p>
          </div>
        ))}
      </section>
      </div>

      {/* Two entry doors into the same site. */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-2 md:px-8">
        <Link href={`/${lang}/engineering`} className="group glass gold-border card-lift reveal relative flex min-h-[380px] flex-col overflow-hidden rounded-[1.75rem] p-8">
          <div className="blueprint -mx-8 -mt-8 mb-6 px-4 pt-6">
            <ControlLoop lang={lang} compact />
          </div>
          <p className="kicker">01</p>
          <h2 className="mt-3 font-display text-3xl text-pearl">{d.doors.eng.name}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{d.doors.eng.text}</p>
          <span className="mt-auto pt-6 text-xs uppercase tracking-[0.25em] text-gold">{d.doors.eng.go} →</span>
        </Link>
        <Link href={`/${lang}/creative`} className="group glass gold-border card-lift reveal relative flex min-h-[380px] flex-col overflow-hidden rounded-[1.75rem] p-8" data-delay="0.08">
          <div className="relative -mx-8 -mt-8 mb-6 h-44 overflow-hidden">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-[50%_35%] transition duration-[1.2s] group-hover:scale-105" />
            {/* rule-of-thirds overlay: the photographer's grid */}
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M100 0V100M200 0V100M0 33.3H300M0 66.6H300" stroke="rgba(255,215,0,0.45)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" className="draw" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-panel/90 to-transparent" />
          </div>
          <p className="kicker">02</p>
          <h2 className="mt-3 font-display text-3xl text-pearl">{d.doors.cre.name}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{d.doors.cre.text}</p>
          <span className="mt-auto pt-6 text-xs uppercase tracking-[0.25em] text-gold">{d.doors.cre.go} →</span>
        </Link>
      </section>

      <Section kicker={fr ? "Profil" : "Profile"} title={d.home.bring}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.home.bringItems.map(([h, p], i) => (
            <div key={h} className="reveal border-t border-gold/30 pt-5" data-delay={String(i * 0.06)}>
              <p className="font-display text-lg text-gold">{h}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker={d.nav.projects} title={d.sections.featured}>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => <div key={p.slug} className="reveal"><ProjectCard p={p} lang={lang} /></div>)}
        </div>
        <Link href={`/${lang}/projects`} className="btn btn-ghost reveal mt-10">{d.viewAll} ({portfolio.projects.length}) →</Link>
      </Section>
    </>
  );
}
