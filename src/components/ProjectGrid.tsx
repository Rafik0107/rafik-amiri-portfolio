"use client";

import { useMemo, useState } from "react";
import type { Lang, Project } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { ProjectCard } from "./ui";

const CATS = ["all", "robotics", "ai", "automation", "software"] as const;
const STATUSES = ["all", "completed", "in-development", "planned"] as const;

export default function ProjectGrid({ projects, lang }: { projects: Project[]; lang: Lang }) {
  const d = getDict(lang);
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const shown = useMemo(
    () => projects.filter((p) => (cat === "all" || p.category === cat) && (status === "all" || p.status === status)),
    [projects, cat, status],
  );
  const btn = (active: boolean) =>
    `rounded-full border px-4 py-2 text-xs tracking-wide transition ${active ? "border-gold bg-gold text-void" : "border-pearl/15 text-pearl/75 hover:border-gold/60 hover:text-gold"}`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {CATS.map((c) => <button key={c} className={btn(cat === c)} aria-pressed={cat === c} onClick={() => setCat(c)}>{d.categories[c]}</button>)}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Status">
          {STATUSES.map((s) => (
            <button key={s} className={btn(status === s)} aria-pressed={status === s} onClick={() => setStatus(s)}>
              {s === "all" ? d.categories.all : d.status[s]}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs text-mist" aria-live="polite">{shown.length} / {projects.length}</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <ProjectCard key={p.slug} p={p} lang={lang} />)}
      </div>
    </div>
  );
}
