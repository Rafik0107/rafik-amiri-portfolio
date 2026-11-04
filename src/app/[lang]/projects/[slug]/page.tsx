import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectViz from "@/components/ProjectViz";
import { Chip, Glyph, StatusBadge } from "@/components/ui";
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
  const fr = lang === "fr";
  const idx = portfolio.projects.indexOf(p);
  const next = portfolio.projects[(idx + 1) % portfolio.projects.length];
  const internship = portfolio.internships.find((i) => i.project === p.slug);
  const educational = p.source === "github" && !!p.method;

  const context = internship
    ? (fr ? `Réalisé pendant mon stage de développement chez ${t(internship.org, lang)} (${internship.place}, ${t(internship.period, lang)}).` : `Built during my development internship at ${t(internship.org, lang)} (${internship.place}, ${t(internship.period, lang)}).`)
    : educational
      ? (fr ? "Projet pédagogique de la série « HackEPS-12-Python-Projects », préparée en octobre 2026. Données synthétiques ; aucune participation à un concours n’est revendiquée." : "Educational project from the “HackEPS-12-Python-Projects” series, prepared in October 2026. Synthetic data; no competition participation is claimed.")
      : d.cvSourceNote;
  const contribution = internship
    ? (fr ? "Développement de l’application web Smart Factory (Angular, JavaScript) pendant le stage." : "Developing the Smart Factory web application (Angular, JavaScript) during the internship.")
    : educational ? d.contributionGithub : "";

  const blocks = [
    { h: d.sections.context, body: context },
    { h: d.sections.objective, body: t(p.summary, lang) },
    { h: d.sections.contribution, body: contribution },
    { h: d.sections.method, body: t(p.method, lang) },
    { h: d.sections.results, body: t(p.results, lang) },
    { h: d.sections.limits, body: t(p.limits, lang) },
  ].filter((b) => b.body);

  return (
    <article className="px-4 pb-10 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <Link href={`/${lang}/projects`} className="text-xs uppercase tracking-[0.3em] text-mist hover:text-gold">← {d.nav.projects}</Link>
        <div className="mt-8 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="reveal flex flex-wrap items-center gap-2">
              <StatusBadge status={p.status} lang={lang} />
              <Chip tone="purple">{d.categories[p.category]}</Chip>
              <Chip tone="mist">{d.source[p.source]}</Chip>
              {p.year && <Chip tone="mist">{p.year}</Chip>}
            </div>
            <h1 className="reveal mt-6 font-display text-[clamp(2rem,5vw,3.8rem)] leading-tight" data-delay="0.05"><span className="gold-text">{t(p.title, lang)}</span></h1>
          </div>
          <Glyph category={p.category} className="hidden h-20 w-32 text-gold md:block" />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-px overflow-hidden rounded-3xl border border-gold/15 bg-gold/10">
            {blocks.map((b, i) => (
              <section key={b.h} className="reveal grid gap-2 bg-ink px-6 py-6 md:grid-cols-[180px_1fr] md:gap-8" data-delay={String(Math.min(i, 3) * 0.04)}>
                <h2 className="text-xs uppercase tracking-[0.24em] text-gold">{b.h}</h2>
                <p className="text-sm leading-relaxed text-pearl/90">{b.body}</p>
              </section>
            ))}
          </div>
          <aside className="space-y-5 md:sticky md:top-24 md:self-start">
            {p.tech.length > 0 && (
              <div className="glass reveal rounded-3xl p-6">
                <h2 className="text-xs uppercase tracking-[0.26em] text-mist">{d.sections.tech}</h2>
                <div className="mt-4 flex flex-wrap gap-2">{p.tech.map((x) => <Chip key={x}>{x}</Chip>)}</div>
              </div>
            )}
            {educational && (
              <div className="glass reveal rounded-3xl p-6">
                <h2 className="text-xs uppercase tracking-[0.26em] text-mist">{d.sections.validation}</h2>
                <p className="mt-3 text-sm text-pearl/85">{fr ? "Tests unitaires inclus. Suite complète du dépôt : 41 méthodes de test sur 12 suites, toutes au vert (Python 3.12 et 3.15)." : "Unit tests included. Full repository suite: 41 test methods across 12 suites, all passing (Python 3.12 and 3.15)."}</p>
              </div>
            )}
            {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-gold reveal w-full">{d.github} ↗</a>}
          </aside>
        </div>

        {p.viz && (
          <section className="glass gold-border reveal mt-8 rounded-3xl p-7">
            <h2 className="font-display text-lg text-gold">{fr ? "Données de la démonstration enregistrée" : "Recorded demo data"}</h2>
            <p className="mt-1 text-xs text-mist">{fr ? "Tracé à partir du fichier example_output.json du dépôt — ce n’est pas une capture d’écran." : "Plotted from the repository’s example_output.json — not a screenshot."}</p>
            <div className="mt-6"><ProjectViz kind={p.viz} lang={lang} /></div>
          </section>
        )}

        <Link href={`/${lang}/projects/${next.slug}`} className="glass gold-border card-lift group mt-14 flex items-center justify-between rounded-3xl p-7">
          <span>
            <span className="text-xs uppercase tracking-[0.3em] text-mist">{fr ? "Projet suivant" : "Next project"}</span>
            <span className="mt-2 block font-display text-xl text-pearl transition-colors group-hover:text-gold">{t(next.title, lang)}</span>
          </span>
          <span className="text-2xl text-gold transition-transform group-hover:translate-x-2">→</span>
        </Link>
      </div>
    </article>
  );
}
