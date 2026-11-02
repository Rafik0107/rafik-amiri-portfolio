"use client";

import { useState } from "react";
import type { Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";

export default function ContactForm({ lang, email }: { lang: Lang; email: string }) {
  const d = getDict(lang).contact;
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio — ${name}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${from})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = "mt-2 w-full rounded-xl border border-pearl/15 bg-void/60 px-4 py-3 text-pearl placeholder:text-mist/60 transition focus:border-gold/70 focus:outline-none";
  return (
    <form onSubmit={submit} className="glass gold-border space-y-5 rounded-3xl p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.25em] text-gold">{d.name}
          <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block text-xs uppercase tracking-[0.25em] text-gold">{d.email}
          <input required type="email" value={from} onChange={(e) => setFrom(e.target.value)} maxLength={150} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-xs uppercase tracking-[0.25em] text-gold">{d.message}
        <textarea required rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={3000} className={field} />
      </label>
      <button className="rounded-full bg-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-void transition hover:bg-gold-bright hover:shadow-[0_0_40px_rgba(255,215,0,0.45)]">{d.send}</button>
      <p className="text-xs text-mist">{d.note}</p>
      {sent && <p className="text-sm text-purple-soft" role="status">{lang === "fr" ? `Si rien ne s'ouvre, écrivez directement à ${email}.` : `If nothing opens, email ${email} directly.`}</p>}
    </form>
  );
}
