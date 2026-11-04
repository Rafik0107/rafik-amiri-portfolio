import Link from "next/link";
import { t, type Category, type Entry, type Lang, type Project } from "@/lib/content";
import { getDict } from "@/lib/i18n";

export function PageHeader({ kicker, title, intro, children }: { kicker: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden px-4 pb-12 pt-32 md:px-8 md:pt-40">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[680px] rounded-full bg-purple/15 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="kicker rise">{kicker}</p>
          <h1 className="rise mt-4 font-display text-[clamp(2.3rem,6vw,4.6rem)] leading-[1.04]" style={{ animationDelay: "0.06s" }}><span className="gold-text">{title}</span></h1>
          {intro && <p className="rise mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg" style={{ animationDelay: "0.12s" }}>{intro}</p>}
          <svg className="mt-8 h-2 w-48" viewBox="0 0 192 8" aria-hidden><path d="M0 4H150M160 4H192" stroke="#d4af37" strokeWidth="1" className="draw" /><circle cx="155" cy="4" r="3" fill="#7b2fff" /></svg>
        </div>
        {children && <div className="rise" style={{ animationDelay: "0.1s" }}>{children}</div>}
      </div>
    </header>
  );
}

export function Section({ title, kicker, children, id, intro }: { title: string; kicker?: string; children: React.ReactNode; id?: string; intro?: string }) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 md:px-8">
      {kicker && <p className="kicker reveal">{kicker}</p>}
      <h2 className="reveal mt-3 font-display text-3xl text-pearl md:text-4xl">{title}</h2>
      {intro && <p className="reveal mt-3 max-w-2xl text-sm leading-relaxed text-mist">{intro}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Chip({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "purple" | "mist" }) {
  const c = tone === "gold" ? "border-gold/35 text-gold" : tone === "purple" ? "border-purple-soft/40 text-purple-soft" : "border-pearl/15 text-mist";
  return <span className={`inline-block rounded-full border px-3 py-1 text-[0.7rem] tracking-wide ${c}`}>{children}</span>;
}

const statusTone = { completed: "bg-gold", "in-development": "bg-purple-soft", planned: "border border-pearl/50" } as const;
const SHORT = { fr: { completed: "Terminé", "in-development": "En cours", planned: "Planifié" }, en: { completed: "Completed", "in-development": "In progress", planned: "Planned" } } as const;
export function StatusBadge({ status, lang, short }: { status: Project["status"]; lang: Lang; short?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-pearl/10 bg-void/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-pearl/85" title={getDict(lang).status[status]}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusTone[status]}`} />
      {short ? SHORT[lang][status] : getDict(lang).status[status]}
    </span>
  );
}

/** Fine line glyph per engineering domain, traced again on card hover. */
export function Glyph({ category, className = "" }: { category: Category; className?: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 64 40" className={`glyph ${className}`} aria-hidden>
      {category === "robotics" && <><polyline points="8,34 22,14 44,20" {...s} /><circle cx="8" cy="34" r="3" {...s} /><circle cx="22" cy="14" r="2.5" {...s} /><path d="M44 20 l6 -4 M44 20 l6 4" {...s} /></>}
      {category === "automation" && <><line x1="4" y1="14" x2="60" y2="14" {...s} strokeDasharray="2 3" /><path d="M4 36 C14 36 16 8 26 10 S38 16 44 14 L60 14" {...s} /></>}
      {category === "ai" && <><path d="M6 6h16v16H6zM28 6h16v16H28zM6 26h16v10M28 30l8-6 8 6 10-10" {...s} /></>}
      {category === "signal" && <path d="M2 22 H14 L18 8 L22 34 L26 22 H34 Q38 14 42 22 T50 22 H62" {...s} />}
      {category === "software" && <><path d="M6 8h22M14 18h30M24 28h22M10 38h12" {...s} /><line x1="52" y1="4" x2="52" y2="38" {...s} strokeDasharray="2 3" /></>}
    </svg>
  );
}

export function Timeline({ entries, lang }: { entries: (Entry & { kind?: string })[]; lang: Lang }) {
  const d = getDict(lang);
  return (
    <ol className="relative ml-3 md:ml-[11rem]">
      <span className="absolute left-0 top-0 h-full w-px bg-gold/15" aria-hidden />
      <span data-progress className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-gold via-purple-soft to-gold" aria-hidden />
      {entries.map((e, i) => {
        const period = t(e.period, lang);
        return (
          <li key={e.id} className="reveal relative pb-10 pl-8 md:pl-12" data-delay={String(Math.min(i, 3) * 0.05)}>
            <span className={`absolute -left-[6px] top-1.5 h-3 w-3 rotate-45 border ${e.current ? "border-gold-bright bg-gold" : "border-gold/70 bg-void"}`} />
            <p className="text-xs uppercase tracking-[0.26em] text-gold md:absolute md:-left-[11rem] md:top-1 md:w-36 md:text-right">{period || d.dateTbc}</p>
            <div className="glass card-lift mt-2 rounded-2xl p-6 md:mt-0">
              {e.kind && <p className="mb-2 text-[0.65rem] uppercase tracking-[0.26em] text-purple-soft">{e.kind}</p>}
              <h3 className="font-display text-xl text-pearl">{t(e.title, lang)}</h3>
              <p className="mt-1 text-sm text-gold/90">{t(e.org, lang)}{e.place ? ` · ${e.place}` : ""}</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{t(e.details, lang)}</p>
              {e.skills && e.skills.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{e.skills.map((s) => <Chip key={s} tone="mist">{s}</Chip>)}</div>}
              {e.project && <Link href={`/${lang}/projects/${e.project}`} className="mt-4 inline-block text-xs uppercase tracking-[0.22em] text-purple-soft hover:text-gold">{d.readCase} →</Link>}
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
    <Link href={`/${lang}/projects/${p.slug}`} className="group glass gold-border card-lift relative flex h-full flex-col overflow-hidden rounded-3xl p-6">
      <div className="flex items-start justify-between gap-3">
        <Glyph category={p.category} className="h-10 w-16 text-gold/80 transition-colors group-hover:text-gold-bright" />
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-purple-soft">{d.categories[p.category]}</span>
      </div>
      <h3 className="mt-5 font-display text-xl leading-snug text-pearl transition-colors group-hover:text-gold">{t(p.title, lang)}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{t(p.summary, lang)}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={p.status} lang={lang} />
        {p.tech.slice(0, 3).map((x) => <Chip key={x} tone="mist">{x}</Chip>)}
      </div>
      <span className="mt-5 text-[0.68rem] uppercase tracking-[0.24em] text-gold/80 transition-all group-hover:tracking-[0.34em] group-hover:text-gold">{d.readCase} →</span>
    </Link>
  );
}
