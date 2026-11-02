import PrintButton from "@/components/PrintButton";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/resume", getDict(lang).resume.title, t(portfolio.profile.headline, lang));
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid border-t border-gold/20 pt-6">
      <h2 className="font-display text-sm uppercase tracking-[0.35em] text-gold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Row({ when, title, sub, body }: { when?: string; title: string; sub?: string; body?: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-6">
      <p className="text-xs uppercase tracking-wider text-mist">{when}</p>
      <div>
        <p className="font-semibold text-pearl">{title}</p>
        {sub && <p className="text-sm text-purple-soft">{sub}</p>}
        {body && <p className="mt-1 text-sm leading-relaxed text-mist">{body}</p>}
      </div>
    </div>
  );
}

export default async function Resume({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const pr = portfolio.profile;
  const completed = portfolio.projects.filter((p) => p.status === "completed");

  return (
    <div className="px-4 pb-10 pt-32 md:px-8 md:pt-40">
      <div className="no-print mx-auto mb-8 flex max-w-4xl flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl"><span className="gold-text">{d.resume.title}</span></h1>
        <div className="flex flex-wrap gap-3">
          {pr.cvPdf && <a href={pr.cvPdf} download className="rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-void hover:bg-gold-bright">{d.resume.download}</a>}
          <PrintButton label={d.resume.print} primary={!pr.cvPdf} />
        </div>
      </div>

      <div className="print-sheet glass gold-border mx-auto max-w-4xl space-y-8 rounded-3xl p-6 md:p-12">
        <header>
          <p className="font-display text-3xl tracking-wide md:text-4xl"><span className="gold-text">RAFIK AMIRI</span> <span className="text-lg text-purple-soft">( RAIDEN )</span></p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-pearl/85">{t(pr.subtitle, lang)}</p>
          <p className="mt-4 text-sm text-mist">{t(pr.headline, lang)}</p>
          <p className="mt-3 text-sm text-mist">{pr.location} · {pr.links.email} · github.com/Rafik0107 · {pr.links.carrd.replace(/^https:\/\//, "").replace(/\/$/, "")}</p>
        </header>

        <Block title={d.sections.education}>
          {portfolio.education.map((e) => <Row key={e.id} when={t(e.period, lang)} title={t(e.title, lang)} sub={`${t(e.org, lang)} — ${e.place}`} />)}
        </Block>

        <Block title={d.sections.internships}>
          {portfolio.internships.map((e) => <Row key={e.id} when={t(e.period, lang)} title={`${t(e.org, lang)} — ${t(e.title, lang)}`} sub={e.place} body={t(e.details, lang)} />)}
        </Block>

        <Block title={d.nav.projects}>
          {completed.map((p) => <Row key={p.slug} when={p.year} title={t(p.title, lang)} sub={p.tech.join(" · ")} body={t(p.summary, lang)} />)}
        </Block>

        <Block title={d.sections.jobs}>
          {portfolio.jobs.map((j) => <Row key={j.id} when={t(j.period, lang)} title={`${t(j.org, lang)} — ${t(j.title, lang)}`} sub={j.place} body={t(j.details, lang)} />)}
          <p className="text-sm text-mist">{t(pr.selfEmployed, lang)}</p>
        </Block>

        <Block title={d.nav.skills}>
          {portfolio.skills.map((g) => (
            <Row key={g.group} title={(d.skillGroups as Record<string, string>)[g.group] ?? g.group} body={g.items.join(" · ")} />
          ))}
        </Block>
      </div>
    </div>
  );
}
