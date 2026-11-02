import Link from "next/link";
import { PageHeader, ProjectCard, Section, Timeline, Chip } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  return pageMeta(lang, "/engineering", d.portals.eng.name, lang === "fr" ? "Robotique, automatique, IA, mécatronique et développement logiciel : projets, stages et parcours d'ingénieur de Rafik Amiri." : "Robotics, control, AI, mechatronics and software: Rafik Amiri's engineering projects, internships and path.");
}

export default async function Engineering({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const domains = [
    { k: "robotics", label: d.categories.robotics },
    { k: "ai", label: d.categories.ai },
    { k: "automation", label: d.categories.automation },
    { k: "software", label: d.categories.software },
  ] as const;

  return (
    <>
      <PageHeader
        kicker={`I · ${d.nav.engineering}`}
        title={d.portals.eng.name}
        intro={fr ? "De Sonatrach à Hassi R'Mel jusqu'à Sorbonne Université : automatique, robotique, intelligence artificielle et logiciel, documentés avec rigueur." : "From Sonatrach in Hassi R'Mel to Sorbonne Université: control, robotics, artificial intelligence and software, documented with rigour."}
      />
      {domains.map(({ k, label }) => {
        const list = portfolio.projects.filter((p) => p.category === k);
        return (
          <Section key={k} kicker={fr ? "Domaine" : "Domain"} title={label}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => <div key={p.slug} className="reveal"><ProjectCard p={p} lang={lang} /></div>)}
            </div>
          </Section>
        );
      })}
      <Section kicker={d.nav.experience} title={d.sections.internships}>
        <Timeline entries={portfolio.internships} lang={lang} />
      </Section>
      <Section kicker="GitHub" title={portfolio.githubRepo.name}>
        <div className="glass gold-border reveal rounded-3xl p-8">
          <p className="max-w-3xl leading-relaxed text-mist">{t(portfolio.githubRepo.note, lang)}</p>
          <div className="mt-6 flex flex-wrap gap-2"><Chip>Python 3.10+</Chip><Chip>NumPy</Chip><Chip tone="purple">unittest</Chip><Chip tone="purple">FR / EN</Chip></div>
          <Link href={portfolio.githubRepo.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-full border border-gold/50 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold hover:bg-gold hover:text-void">{d.github} ↗</Link>
        </div>
      </Section>
    </>
  );
}
