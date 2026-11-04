import OppBanner from "@/components/OppBanner";
import Link from "next/link";
import ControlLoop from "@/components/ControlLoop";
import { Chip, PageHeader, ProjectCard, Section, StatusBadge, Timeline } from "@/components/ui";
import { getProject, portfolio, t } from "@/lib/content";
import { DOMAINS, FEATURED_ENGINEERING } from "@/lib/domains";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/engineering", getDict(lang).doors.eng.name, lang === "fr" ? "Automatique, robotique, estimation, traitement du signal, vision et logiciel industriel : domaines, outils et projets de Rafik Amiri." : "Control, robotics, estimation, signal processing, vision and industrial software: Rafik Amiri's domains, tools and projects.");
}

export default async function Engineering({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const featured = FEATURED_ENGINEERING.map((s) => getProject(s)!);

  return (
    <>
      <PageHeader
        kicker={d.nav.engineering}
        title={d.doors.eng.name}
        intro={fr
          ? "Master 1 Automatique et Robotique à Sorbonne Université, après un parcours en automatique et en sciences pour l’ingénieur. Voici les domaines que je travaille, et où je les ai appliqués."
          : "Master 1 in Automation and Robotics at Sorbonne Université, after studies in automation and engineering sciences. Here are the domains I work on, and where I applied them."}
      >
        <div className="glass gold-border blueprint rounded-3xl p-4"><ControlLoop lang={lang} /></div>
      </PageHeader>

      <Section kicker={fr ? "Six domaines" : "Six domains"} title={d.sections.domains} intro={d.aiNote}>
        <div className="divide-y divide-gold/10 border-y border-gold/10">
          {DOMAINS.map((dom, i) => (
            <article key={dom.key} className="reveal grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]" data-delay={String((i % 2) * 0.05)}>
              <div>
                <p className="text-xs tracking-[0.3em] text-purple-soft">0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl text-pearl">{t(dom.title, lang)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{t(dom.text, lang)}</p>
                <div className="mt-4 flex flex-wrap gap-2">{dom.tools.map((x) => <Chip key={x}>{x}</Chip>)}</div>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {dom.projects.map((slug) => {
                  const p = getProject(slug)!;
                  return (
                    <li key={slug}>
                      <Link href={`/${lang}/projects/${slug}`} className="group card-lift flex h-full flex-col rounded-2xl border border-pearl/10 bg-ink/70 p-4 hover:border-gold/40">
                        <span className="font-display text-base text-pearl transition-colors group-hover:text-gold">{t(p.title, lang)}</span>
                        <span className="mt-2 flex-1 text-xs leading-relaxed text-mist">{t(p.summary, lang)}</span>
                        <span className="mt-3"><StatusBadge status={p.status} lang={lang} short /></span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section kicker={d.nav.projects} title={d.sections.featured}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <div key={p.slug} className="reveal"><ProjectCard p={p} lang={lang} /></div>)}
        </div>
        <Link href={`/${lang}/projects`} className="btn btn-ghost reveal mt-10">{d.viewAll} ({portfolio.projects.length}) →</Link>
      </Section>

      <Section kicker={d.nav.experience} title={d.sections.internships}>
        <Timeline entries={portfolio.internships.filter((e) => e.start)} lang={lang} />
      </Section>

      <Section kicker="GitHub" title={portfolio.githubRepo.name}>
        <div className="glass gold-border reveal rounded-3xl p-8">
          <p className="max-w-3xl leading-relaxed text-mist">{t(portfolio.githubRepo.note, lang)}</p>
          <a href={portfolio.githubRepo.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">{d.github} ↗</a>
        </div>
      </Section>
      <OppBanner lang={lang} kind="project" type="collaboration" domain="robotics" text={lang === "fr" ? "Projet en automatique, robotique ou mécatronique ? Échangeons sur votre besoin." : "A control, robotics or mechatronics project? Let’s talk about what you need."} />
    </>
  );
}
