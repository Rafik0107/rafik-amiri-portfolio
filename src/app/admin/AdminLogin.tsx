"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setBusy(false);
    if (res.ok) return window.location.reload();
    setErr(res.status === 429 ? "Trop de tentatives. Réessayez dans 15 minutes." : "Mot de passe incorrect.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass gold-border w-full max-w-sm rounded-3xl p-8">
        <p className="kicker">Espace privé</p>
        <h1 className="mt-3 font-display text-2xl"><span className="gold-text">RAIDEN · Admin</span></h1>
        <label className="mt-8 block text-xs uppercase tracking-[0.25em] text-gold">Mot de passe
          <input type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} className="mt-2 w-full rounded-xl border border-pearl/15 bg-void/60 px-4 py-3 text-pearl focus:border-gold/70 focus:outline-none" />
        </label>
        {err && <p className="mt-3 text-sm text-red-400" role="alert">{err}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-[0.3em] text-void disabled:opacity-50">{busy ? "…" : "Connexion"}</button>
      </form>
    </main>
  );
}
