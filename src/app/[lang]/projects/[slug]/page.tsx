import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectViz from "@/components/ProjectViz";
import { Chip, StatusBadge } from "@/components/ui";
import { getProject, isLang, LANGS, portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LANGS.flatMap((lang) => portfolio.projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLang(lang)) return {};
  return pageMeta(lang, `/projects/${slug}`, t(p.title, lang), t(p.summary, lang));
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLang(lang)) notFound();
  const d = getDict(lang);
  const idx = portfolio.projects.indexOf(p);
  const next = portfolio.projects[(idx + 1) % portfolio.projects.length];
  const internship = portfolio.internships.find((i) => i.project === p.slug);

  const blocks = [
    { h: d.sections.method, body: t(p.method, lang) },
    { h: d.sections.results, body: t(p.results, lang) },
    { h: d.sections.limits, body: t(p.limits, lang) },
  ].filter((b) => b.body);

  return (
    <article className="px-4 pb-10 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto max-w-5xl">
        <Link href={`/${lang}/projects`} className="text-xs uppercase tracking-[0.3em] text-mist hover:text-gold">← {d.nav.projects}</Link>
        <div className="reveal mt-8 flex flex-wrap items-center gap-2">
          <StatusBadge status={p.status} lang={lang} />
          <Chip tone={p.source === "github" ? "purple" : "mist"}>{d.source[p.source]}</Chip>
          <Chip tone="mist">{d.categories[p.category]}</Chip>
          {p.year && <Chip tone="mist">{p.year}</Chip>}
        </div>
        <h1 className="reveal mt-6 font-display text-[clamp(2rem,5.5vw,4.2rem)] leading-tight"><span className="gold-text">{t(p.title, lang)}</span></h1>
        <p className="reveal mt-6 max-w-3xl text-lg leading-relaxed text-mist">{t(p.summary, lang)}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="glass gold-border reveal rounded-3xl p-7">
              <h2 className="font-display text-lg text-gold">{d.sections.context}</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {p.source === "github" && p.method ? d.aiAssisted : d.cvSourceNote}
                {internship && ` ${lang === "fr" ? "Stage" : "Internship"} : ${t(internship.org, lang)}, ${internship.place} (${t(internship.period, lang)}).`}
              </p>
            </section>
            {blocks.map((b) => (
              <section key={b.h} className="glass gold-border reveal rounded-3xl p-7">
                <h2 className="font-display text-lg text-gold">{b.h}</h2>
                <p className="mt-3 text-sm leading-relaxed text-pearl/85">{b.body}</p>
              </section>
            ))}
            {p.viz && (
              <section className="glass gold-border reveal rounded-3xl p-7">
                <h2 className="font-display text-lg text-gold">{lang === "fr" ? "Visualisation (données de la démo enregistrée)" : "Visualization (recorded demo data)"}</h2>
                <div className="mt-6"><ProjectViz kind={p.viz} lang={lang} /></div>
              </section>
            )}
          </div>
          <aside className="space-y-6">
            {p.tech.length > 0 && (
              <div className="glass reveal rounded-3xl p-6">
                <h2 className="text-xs uppercase tracking-[0.3em] text-mist">{d.sections.tech}</h2>
                <div className="mt-4 flex flex-wrap gap-2">{p.tech.map((x) => <Chip key={x}>{x}</Chip>)}</div>
              </div>
            )}
            {p.source === "github" && p.method && (
              <div className="glass reveal rounded-3xl p-6">
                <h2 className="text-xs uppercase tracking-[0.3em] text-mist">{d.sections.validation}</h2>
                <p className="mt-3 text-sm text-pearl/85">{lang === "fr" ? "Tests unitaires inclus (unittest). Suite complète : 41 méthodes de test, 12 suites, toutes au vert." : "Unit tests included (unittest). Full suite: 41 test methods, 12 suites, all passing."}</p>
              </div>
            )}
            {p.repo && (
              <Link href={p.repo} target="_blank" rel="noopener noreferrer" className="reveal block rounded-3xl bg-gold p-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-void transition hover:bg-gold-bright">
                {d.github} ↗
              </Link>
            )}
          </aside>
        </div>

        <Link href={`/${lang}/projects/${next.slug}`} className="glass gold-border group mt-16 flex items-center justify-between rounded-3xl p-7">
          <span>
            <span className="text-xs uppercase tracking-[0.3em] text-mist">{lang === "fr" ? "Projet suivant" : "Next project"}</span>
            <span className="mt-2 block font-display text-xl text-pearl transition group-hover:text-gold">{t(next.title, lang)}</span>
          </span>
          <span className="text-2xl text-gold transition group-hover:translate-x-2">→</span>
        </Link>
      </div>
    </article>
  );
}
