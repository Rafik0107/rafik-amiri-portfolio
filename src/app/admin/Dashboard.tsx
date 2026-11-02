"use client";

import { useEffect, useState } from "react";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

const TABS = [
  { key: "profile", label: "Profil" },
  { key: "projects", label: "Projets" },
  { key: "education", label: "Formation" },
  { key: "internships", label: "Stages" },
  { key: "jobs", label: "Expérience" },
  { key: "skills", label: "Compétences" },
  { key: "photos", label: "Galerie" },
  { key: "transferableSkills", label: "Compétences transférables" },
  { key: "ai", label: "Assistant IA" },
] as const;

const ENUMS: Record<string, string[]> = {
  status: ["completed", "in-development", "planned"],
  category: ["robotics", "ai", "automation", "software", "urban", "portrait", "nature", "moments"],
  source: ["cv", "github"],
};

const isBilingual = (v: Json): v is { fr: string; en: string } =>
  !!v && typeof v === "object" && !Array.isArray(v) && "fr" in v && "en" in v && Object.keys(v).length === 2;

function blank(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]));
  return null;
}

const input = "w-full rounded-lg border border-pearl/15 bg-void/70 px-3 py-2 text-sm text-pearl focus:border-gold/60 focus:outline-none";

function Field({ name, value, onChange }: { name: string; value: Json; onChange: (v: Json) => void }) {
  const label = <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-gold/80">{name}</span>;
  if (isBilingual(value)) {
    return (
      <div className="md:col-span-2">
        {label}
        <div className="grid gap-2 md:grid-cols-2">
          {(["fr", "en"] as const).map((l) => (
            <textarea key={l} rows={value[l].length > 90 ? 4 : 1} value={value[l]} placeholder={l.toUpperCase()} onChange={(e) => onChange({ ...value, [l]: e.target.value })} className={input} />
          ))}
        </div>
      </div>
    );
  }
  if (typeof value === "string") {
    if (ENUMS[name]) {
      return <label>{label}<select value={value} onChange={(e) => onChange(e.target.value)} className={input}>{ENUMS[name].map((o) => <option key={o}>{o}</option>)}</select></label>;
    }
    return <label className={value.length > 90 ? "md:col-span-2" : ""}>{label}{value.length > 90 ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={input} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={input} />}</label>;
  }
  if (typeof value === "number") return <label>{label}<input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={input} /></label>;
  if (typeof value === "boolean") return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} /> {name}</label>;
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return <label className="md:col-span-2">{label}<input value={(value as string[]).join(", ")} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={input} placeholder="valeur1, valeur2" /></label>;
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return <fieldset className="rounded-xl border border-pearl/10 p-3 md:col-span-2"><legend className="px-1 text-[0.65rem] uppercase tracking-[0.2em] text-purple-soft">{name}</legend><ObjectEditor value={value} onChange={onChange} /></fieldset>;
  }
  return null;
}

function ObjectEditor({ value, onChange }: { value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.entries(value).map(([k, v]) => <Field key={k} name={k} value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />)}
    </div>
  );
}

function ListEditor({ items, onChange, template }: { items: Obj[]; onChange: (v: Obj[]) => void; template: Obj }) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-4">
      <button onClick={() => onChange([blank(template) as Obj, ...items])} className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-void">+ Ajouter</button>
      {items.map((it, i) => (
        <details key={i} className="glass rounded-2xl p-4" open={i === 0 && !Object.values(it).some((x) => x)}>
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm text-pearl">
            <span className="truncate">{String((it.title as { fr?: string })?.fr ?? it.title ?? it.org ?? it.slug ?? it.group ?? it.src ?? it.fr ?? `#${i + 1}`)}</span>
            <span className="flex shrink-0 gap-1">
              <button type="button" onClick={(e) => { e.preventDefault(); move(i, -1); }} className="rounded px-2 text-mist hover:text-gold" aria-label="Monter">↑</button>
              <button type="button" onClick={(e) => { e.preventDefault(); move(i, 1); }} className="rounded px-2 text-mist hover:text-gold" aria-label="Descendre">↓</button>
              <button type="button" onClick={(e) => { e.preventDefault(); if (confirm("Supprimer cet élément ?")) onChange(items.filter((_, j) => j !== i)); }} className="rounded px-2 text-red-400 hover:text-red-300" aria-label="Supprimer">✕</button>
            </span>
          </summary>
          <div className="mt-4"><ObjectEditor value={it} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} /></div>
        </details>
      ))}
    </div>
  );
}

async function fileToBase64(f: File) {
  const buf = new Uint8Array(await f.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

function imageSize(f: File): Promise<{ w: number; h: number }> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => { res({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(img.src); };
    img.onerror = rej;
    img.src = URL.createObjectURL(f);
  });
}

export default function Dashboard({ canPublish, aiKey }: { canPublish: boolean; aiKey: boolean }) {
  const [data, setData] = useState<Obj | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("profile");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((j) => setData(j.content)).catch(() => setMsg("Impossible de charger le contenu."));
  }, []);

  async function save() {
    if (!data) return;
    setBusy(true); setMsg("");
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: data }) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? `Publié ✓ — le site se redéploie (1 à 2 min). ${j.commit || ""}` : `Échec : ${j.error || res.status}`);
  }

  async function upload(kind: "photo" | "cv", f: File) {
    if (!data) return;
    if (f.size > 3 * 1024 * 1024) return setMsg("Fichier trop lourd (3 Mo max). Compressez l'image avant l'envoi.");
    setBusy(true); setMsg("Envoi…");
    try {
      const size = kind === "photo" ? await imageSize(f) : null;
      const res = await fetch("/api/admin/upload", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: f.name, data: await fileToBase64(f), kind }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      if (kind === "photo" && size) {
        const title = f.name.replace(/\.[^.]+$/, "");
        setData({ ...data, photos: [{ src: j.path, w: size.w, h: size.h, title, titleEn: title, category: "moments" }, ...(data.photos as Obj[])] });
      } else {
        setData({ ...data, profile: { ...(data.profile as Obj), cvPdf: j.path } });
      }
      setMsg(`Fichier envoyé (${j.path}). Cliquez sur « Publier » pour l'ajouter au site.`);
    } catch (e) {
      setMsg(`Échec de l'envoi : ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "portfolio.json";
    a.click();
  }

  if (!data) return <main className="p-10 text-mist">{msg || "Chargement…"}</main>;
  const section = data[tab];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker">Tableau de bord privé</p>
          <h1 className="mt-2 font-display text-3xl"><span className="gold-text">RAIDEN · Admin</span></h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/fr" target="_blank" className="rounded-full border border-pearl/20 px-4 py-2 text-xs text-pearl">Voir le site ↗</a>
          <button onClick={download} className="rounded-full border border-pearl/20 px-4 py-2 text-xs text-pearl">Exporter JSON</button>
          <button onClick={save} disabled={!canPublish || busy} className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-void disabled:opacity-40">Publier</button>
          <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); }} className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-300">Déconnexion</button>
        </div>
      </header>
      {!canPublish && <p className="mt-4 rounded-xl border border-gold/30 p-3 text-xs text-gold">Publication désactivée : définissez GITHUB_TOKEN et GITHUB_REPO sur Vercel. Vous pouvez éditer puis exporter le JSON.</p>}
      {msg && <p className="mt-4 rounded-xl border border-purple/40 p-3 text-sm text-pearl" role="status">{msg}</p>}

      <nav className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-full border px-4 py-2 text-xs ${tab === t.key ? "border-gold bg-gold text-void" : "border-pearl/15 text-pearl/80"}`}>{t.label}</button>
        ))}
      </nav>

      <section className="mt-8">
        {tab === "photos" && (
          <label className="mb-6 block rounded-2xl border border-dashed border-gold/40 p-6 text-center text-sm text-gold">
            Ajouter une photographie (JPG, PNG, WebP — 3 Mo max)
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={!canPublish || busy} onChange={(e) => e.target.files?.[0] && upload("photo", e.target.files[0])} />
          </label>
        )}
        {tab === "profile" && (
          <label className="mb-6 block rounded-2xl border border-dashed border-gold/40 p-6 text-center text-sm text-gold">
            Remplacer le CV PDF téléchargeable (3 Mo max)
            <input type="file" accept="application/pdf" className="sr-only" disabled={!canPublish || busy} onChange={(e) => e.target.files?.[0] && upload("cv", e.target.files[0])} />
          </label>
        )}
        {tab === "ai" && (
          <p className="mb-6 text-sm text-mist">
            Clé API : {aiKey ? "configurée ✓ (réponses par Claude)" : "absente — l'assistant utilise le moteur local gratuit"}. La clé se règle uniquement dans les variables d&apos;environnement Vercel (ANTHROPIC_API_KEY), jamais ici.
          </p>
        )}
        {Array.isArray(section) ? (
          <ListEditor items={section as Obj[]} template={(section as Obj[])[0] ?? {}} onChange={(v) => setData({ ...data, [tab]: v })} />
        ) : section && typeof section === "object" ? (
          <div className="glass rounded-2xl p-5"><ObjectEditor value={section as Obj} onChange={(v) => setData({ ...data, [tab]: v })} /></div>
        ) : null}
      </section>
    </main>
  );
}
