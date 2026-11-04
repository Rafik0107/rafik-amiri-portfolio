"use client";

import Link from "next/link";
import { useState } from "react";
import { t, type Lang, type Project } from "@/lib/content";
import { SKILL_PROJECTS } from "@/lib/domains";
import { getDict } from "@/lib/i18n";

const CREATIVE_LINKS: Record<string, string> = { Photography: "photography", "Graphic Design": "creative", "UI/UX Design": "creative", "Adobe Creative Cloud": "creative" };

export default function SkillMap({ groups, projects, lang }: { groups: { group: string; items: string[] }[]; projects: Project[]; lang: Lang }) {
  const d = getDict(lang);
  const fr = lang === "fr";
  const [active, setActive] = useState("Python");
  const linked = (SKILL_PROJECTS[active] || []).map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const page = CREATIVE_LINKS[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="space-y-7">
        <p className="flex flex-wrap gap-5 text-xs text-mist">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" />{fr ? "démontrée dans un projet publié" : "shown in a published project"}</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-pearl/50" />{fr ? "déclarée dans le CV" : "listed on the CV"}</span>
        </p>
        {groups.map((g, gi) => (
          <div key={g.group} className="reveal" data-delay={String(gi * 0.05)}>
            <h3 className="text-xs uppercase tracking-[0.26em] text-gold">{(d.skillGroups as Record<string, string>)[g.group] ?? g.group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((s) => {
                const proven = !!SKILL_PROJECTS[s] || !!CREATIVE_LINKS[s];
                const on = s === active;
                return (
                  <button
                    key={s}
                    onClick={() => setActive(s)}
                    aria-pressed={on}
                    className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${on ? "border-gold bg-gold/15 text-gold-bright" : "border-pearl/12 text-pearl/85 hover:border-purple-soft/60"}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${proven ? "bg-gold" : "border border-pearl/50"}`} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <aside className="glass gold-border order-first h-fit rounded-3xl p-6 lg:order-none lg:sticky lg:top-24" aria-live="polite">
        <p className="kicker">{fr ? "Compétence" : "Skill"}</p>
        <p className="mt-2 font-display text-3xl text-pearl">{active}</p>
        <svg viewBox="0 0 300 10" className="mt-4 h-2 w-full" aria-hidden key={active}><path d="M0 5H300" stroke="#a978ff" strokeWidth="1" strokeDasharray="300" strokeDashoffset="300"><animate attributeName="stroke-dashoffset" from="300" to="0" dur=".8s" fill="freeze" /></path></svg>
        {linked.length > 0 ? (
          <ul key={active} className="page-enter mt-4 space-y-2">
            {linked.map((p) => (
              <li key={p.slug}>
                <Link href={`/${lang}/projects/${p.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border border-pearl/10 px-4 py-3 text-sm text-pearl/90 transition-colors hover:border-gold/50 hover:text-gold">
                  {t(p.title, lang)} <span className="text-gold transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : page ? (
          <Link href={`/${lang}/${page}`} className="btn btn-ghost mt-5">{fr ? "Voir les réalisations" : "See the work"} →</Link>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-mist">{fr ? "Compétence mentionnée dans mon CV, sans projet public associé pour l’instant." : "Skill listed on my CV, with no public project attached yet."}</p>
        )}
      </aside>
    </div>
  );
}
