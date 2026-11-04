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
    <section className="border-t border-gold/20 pt-6 print:pt-3">
      <h2 className="font-display text-sm uppercase tracking-[0.35em] text-gold">{title}</h2>
      <div className="mt-4 space-y-4 print:mt-2 print:space-y-1.5">{children}</div>
    </section>
  );
}

function Row({ when, title, sub, body, compact }: { when?: string; title: string; sub?: string; body?: string; compact?: boolean }) {
  return (
    <div className="group grid gap-1 break-inside-avoid border-l border-transparent pl-3 print:gap-0 print:pl-0 transition-colors hover:border-gold sm:grid-cols-[120px_1fr] sm:gap-6">
      <p className="text-xs uppercase tracking-wider text-mist">{when}</p>
      <div>
        <p className="font-semibold text-pearl transition-colors group-hover:text-gold">{title}</p>
        {sub && <p className="text-sm text-purple-soft">{sub}</p>}
        {body && <p className={`mt-1 text-sm leading-relaxed text-mist ${compact ? "print:hidden" : ""}`}>{body}</p>}
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
          <a href={t(pr.cvPdf, lang)} download className="btn btn-gold">{d.resume.download} ↓</a>
          <a href={pr.cvPdf[lang === "fr" ? "en" : "fr"]} download className="btn btn-ghost">{d.resume.other}</a>
          <PrintButton label={d.resume.print} />
        </div>
      </div>

      <div className="print-sheet glass gold-border mx-auto max-w-4xl space-y-8 rounded-3xl p-6 md:p-12 print:space-y-4 print:text-[11px]">
        <header>
          <p className="font-display text-3xl tracking-wide md:text-4xl"><span className="gold-text">RAFIK AMIRI</span> <span className="text-lg text-purple-soft">( RAIDEN )</span></p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-pearl/85">{t(pr.subtitle, lang)} · {t(pr.creativeRole, lang)}</p>
          <p className="mt-4 text-sm text-mist">{t(pr.headline, lang)}</p>
          <p className="mt-3 text-sm text-mist">{pr.location} · {pr.links.email} · github.com/Rafik0107 · {pr.links.carrd.replace(/^https:\/\//, "").replace(/\/$/, "")}</p>
        </header>

        <Block title={d.sections.education}>
          {portfolio.education.map((e) => <Row key={e.id} when={t(e.period, lang)} title={t(e.title, lang)} sub={`${t(e.org, lang)} — ${e.place}`} />)}
        </Block>

        <Block title={d.sections.internships}>
          {portfolio.internships.filter((e) => e.start).map((e) => <Row key={e.id} when={t(e.period, lang)} title={`${t(e.org, lang)} — ${t(e.title, lang)}`} sub={e.place} body={t(e.details, lang)} />)}
        </Block>

        <Block title={d.nav.projects}>
          {completed.map((p) => <Row key={p.slug} when={p.year} title={t(p.title, lang)} sub={p.tech.join(" · ")} body={t(p.summary, lang)} compact />)}
        </Block>

        <Block title={d.sections.jobs}>
          {[...portfolio.internships.filter((e) => !e.start), ...portfolio.jobs].map((j) => <Row key={j.id} when={t(j.period, lang)} title={`${t(j.org, lang)} — ${t(j.title, lang)}`} sub={j.place} body={t(j.details, lang)} compact />)}
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
