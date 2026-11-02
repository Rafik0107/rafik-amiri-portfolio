import Link from "next/link";
import { t, type Entry, type Lang, type Project } from "@/lib/content";
import { getDict } from "@/lib/i18n";

export function PageHeader({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <header className="relative overflow-hidden px-4 pb-16 pt-36 md:px-8 md:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-purple/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="kicker reveal">{kicker}</p>
        <h1 className="reveal mt-4 font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.02]" data-delay="0.1"><span className="gold-text">{title}</span></h1>
        {intro && <p className="reveal mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg" data-delay="0.2">{intro}</p>}
        <div className="reveal mt-10 h-px w-40 bg-gradient-to-r from-gold via-purple to-transparent" data-delay="0.3" />
      </div>
    </header>
  );
}

export function Section({ title, kicker, children, id }: { title: string; kicker?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 md:px-8">
      {kicker && <p className="kicker reveal">{kicker}</p>}
      <h2 className="reveal mt-3 font-display text-3xl md:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Chip({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "purple" | "mist" }) {
  const c = tone === "gold" ? "border-gold/35 text-gold" : tone === "purple" ? "border-purple-soft/40 text-purple-soft" : "border-pearl/15 text-mist";
  return <span className={`inline-block rounded-full border px-3 py-1 text-[0.7rem] tracking-wide ${c}`}>{children}</span>;
}

const statusTone = { completed: "bg-emerald-400", "in-development": "bg-gold-bright", planned: "bg-purple-soft" } as const;
export function StatusBadge({ status, lang }: { status: Project["status"]; lang: Lang }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-pearl/10 bg-void/50 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-pearl/85">
      <span className={`h-1.5 w-1.5 rounded-full ${statusTone[status]} shadow-[0_0_8px_currentColor]`} />
      {getDict(lang).status[status]}
    </span>
  );
}

export function Timeline({ entries, lang }: { entries: (Entry & { kind?: string })[]; lang: Lang }) {
  const d = getDict(lang);
  return (
    <ol className="relative ml-3 border-l border-gold/25 md:ml-[11rem]">
      {entries.map((e, i) => {
        const period = t(e.period, lang);
        return (
          <li key={e.id} className="reveal relative pb-12 pl-8 md:pl-12" data-delay={String(Math.min(i, 4) * 0.05)}>
            <span className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-void ${e.current ? "bg-gold-bright shadow-[0_0_16px_#ffd700]" : "bg-purple shadow-[0_0_14px_#7b2fff]"}`} />
            <p className="text-xs uppercase tracking-[0.3em] text-gold md:absolute md:-left-[11rem] md:top-1 md:w-36 md:text-right">{period || d.dateTbc}</p>
            <div className="glass gold-border mt-2 rounded-2xl p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-25px_rgba(123,47,255,0.7)] md:mt-0">
              {e.kind && <p className="mb-2 text-[0.65rem] uppercase tracking-[0.3em] text-purple-soft">{e.kind}</p>}
              <h3 className="font-display text-xl text-pearl">{t(e.title, lang)}</h3>
              <p className="mt-1 text-sm text-gold/90">{t(e.org, lang)}{e.place ? ` · ${e.place}` : ""}</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{t(e.details, lang)}</p>
              {e.skills && e.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">{e.skills.map((s) => <Chip key={s} tone="mist">{s}</Chip>)}</div>
              )}
              {e.project && (
                <Link href={`/${lang}/projects/${e.project}`} className="mt-4 inline-block text-xs uppercase tracking-[0.25em] text-purple-soft hover:text-gold">{d.readCase} →</Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ProjectCard({ p, lang }: { p: Project; lang: Lang }) {
  const d = getDict(lang);
  return (
    <Link
      href={`/${lang}/projects/${p.slug}`}
      data-cursor
      className="group glass gold-border relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-25px_rgba(123,47,255,0.8)]"
    >
      <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple/25 blur-3xl transition duration-700 group-hover:bg-gold/25" />
      <div className="relative flex flex-wrap items-center gap-2">
        <StatusBadge status={p.status} lang={lang} />
        <Chip tone={p.source === "github" ? "purple" : "mist"}>{d.source[p.source]}</Chip>
      </div>
      <h3 className="relative mt-5 font-display text-xl leading-snug text-pearl transition group-hover:text-gold">{t(p.title, lang)}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-mist">{t(p.summary, lang)}</p>
      {p.tech.length > 0 && <div className="relative mt-5 flex flex-wrap gap-1.5">{p.tech.map((x) => <Chip key={x}>{x}</Chip>)}</div>}
      <span className="relative mt-6 text-[0.7rem] uppercase tracking-[0.3em] text-purple-soft transition group-hover:tracking-[0.42em] group-hover:text-gold">{d.readCase} →</span>
    </Link>
  );
}
