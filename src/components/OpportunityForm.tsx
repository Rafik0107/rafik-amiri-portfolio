"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { DOMAINS, DOMAIN_LABELS, LIMITS, TYPES, TYPE_LABELS, summary, validate, type FieldErrors, type Opportunity, type OppDomain, type OppType } from "@/lib/opportunity";

const EMPTY: Opportunity = { name: "", email: "", company: "", type: "", domain: "", description: "", location: "", start: "", budget: "", link: "" };

export default function OpportunityForm({ lang, email, configured }: { lang: Lang; email: string; configured: boolean }) {
  const fr = lang === "fr";
  const [v, setV] = useState<Opportunity>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // Preselection from links such as ?type=freelance&domain=photo (still editable).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const type = q.get("type"), domain = q.get("domain");
    setV((o) => ({ ...o, type: TYPES.includes(type as OppType) ? (type as OppType) : o.type, domain: DOMAINS.includes(domain as OppDomain) ? (domain as OppDomain) : o.domain }));
  }, []);

  const set = (k: keyof Opportunity) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((o) => ({ ...o, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const mailto = () => {
    const subject = `[Portfolio] ${v.type ? TYPE_LABELS[v.type as OppType].fr : "Proposition"} — ${v.name}`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary(v))}`;
  };

  const focusFirstError = (e: FieldErrors) => {
    const first = (Object.keys(EMPTY) as (keyof Opportunity)[]).find((k) => e[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(v, lang);
    setErrors(errs);
    if (Object.keys(errs).length) { setStatus("idle"); focusFirstError(errs); return; }
    if (!configured) { window.location.href = mailto(); return; }

    setStatus("sending"); setMessage("");
    try {
      const res = await fetch("/api/opportunity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, lang, website: honey, startedAt: startedAt.current }) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors };
      if (res.ok && data.ok) { setStatus("sent"); setV(EMPTY); return; }
      setStatus("error");
      if (data.error === "invalid" && data.fields) { setErrors(data.fields); focusFirstError(data.fields); setMessage(fr ? "Certains champs sont à corriger." : "Some fields need fixing."); }
      else if (data.error === "rate_limited") setMessage(fr ? "Trop d’envois en peu de temps. Réessayez dans quelques minutes, ou écrivez-moi directement." : "Too many submissions in a short time. Try again in a few minutes, or email me directly.");
      else if (data.error === "spam") setMessage(fr ? "L’envoi a été bloqué par la protection anti-spam. Patientez quelques secondes et réessayez, ou écrivez-moi directement." : "The anti-spam check blocked this submission. Wait a few seconds and retry, or email me directly.");
      else setMessage(fr ? "Le message n’a pas pu être envoyé (service d’envoi indisponible). Vos informations sont conservées : réessayez, ou utilisez le bouton email." : "The message could not be sent (email service unavailable). Your details are kept: retry, or use the email button.");
    } catch {
      setStatus("error");
      setMessage(fr ? "Connexion impossible. Vos informations sont conservées : réessayez, ou utilisez le bouton email." : "Connection failed. Your details are kept: retry, or use the email button.");
    }
  };

  if (status === "sent") {
    return (
      <div className="glass gold-border page-enter rounded-3xl p-8 md:p-10" role="status">
        <p className="kicker">{fr ? "Proposition envoyée" : "Proposal sent"}</p>
        <p className="mt-4 font-display text-2xl text-pearl">{fr ? "Merci, votre proposition m’a bien été transmise." : "Thank you, your proposal has been delivered to me."}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{fr ? "Je vous réponds à l’adresse email indiquée." : "I will reply to the email address you provided."}</p>
        <button type="button" onClick={() => { setStatus("idle"); startedAt.current = Date.now(); }} className="btn btn-ghost mt-6">{fr ? "Nouvelle proposition" : "New proposal"}</button>
      </div>
    );
  }

  const field = "mt-2 w-full rounded-xl border bg-void/60 px-4 py-3 text-base text-pearl placeholder:text-mist/50 transition-colors focus:border-gold/70 focus:outline-none";
  const border = (k: keyof Opportunity) => (errors[k] ? "border-red-400/70" : "border-pearl/15");
  const label = "block text-xs uppercase tracking-[0.22em] text-gold";
  const opt = <span className="ml-1 normal-case tracking-normal text-mist">({fr ? "facultatif" : "optional"})</span>;
  const req = <span className="text-purple-soft" aria-hidden> *</span>;
  const err = (k: keyof Opportunity) => errors[k] && <span id={`err-${k}`} className="mt-1.5 block text-sm normal-case tracking-normal text-red-300">{errors[k]}</span>;
  const aria = (k: keyof Opportunity) => ({ name: k, "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `err-${k}` : undefined });

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="glass gold-border relative space-y-6 rounded-3xl p-5 sm:p-7 md:p-9">
      {!configured && (
        <p className="rounded-2xl border border-purple/40 bg-purple/10 p-4 text-sm leading-relaxed text-pearl/90">
          {fr
            ? <>L’envoi direct depuis le site est en cours d’activation. En attendant, le bouton ci-dessous ouvre votre messagerie avec votre proposition pré-remplie, adressée à <a href={`mailto:${email}`} className="text-gold underline-offset-4 hover:underline">{email}</a>.</>
            : <>Direct sending from the site is being set up. Meanwhile, the button below opens your email app with your proposal pre-filled, addressed to <a href={`mailto:${email}`} className="text-gold underline-offset-4 hover:underline">{email}</a>.</>}
        </p>
      )}

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">{fr ? "Vos coordonnées" : "Your details"}</legend>
        <label className={label}>{fr ? "Nom" : "Name"}{req}
          <input {...aria("name")} required value={v.name} onChange={set("name")} maxLength={LIMITS.name} autoComplete="name" className={`${field} ${border("name")}`} />{err("name")}
        </label>
        <label className={label}>Email{req}
          <input {...aria("email")} required type="email" inputMode="email" value={v.email} onChange={set("email")} maxLength={LIMITS.email} autoComplete="email" className={`${field} ${border("email")}`} />{err("email")}
        </label>
        <label className={`${label} sm:col-span-2`}>{fr ? "Entreprise ou organisation" : "Company or organisation"}{opt}
          <input {...aria("company")} value={v.company} onChange={set("company")} maxLength={LIMITS.company} autoComplete="organization" className={`${field} ${border("company")}`} />{err("company")}
        </label>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">{fr ? "Votre besoin" : "Your need"}</legend>
        <label className={label}>{fr ? "Type d’opportunité" : "Opportunity type"}{req}
          <select {...aria("type")} required value={v.type} onChange={set("type")} className={`${field} ${border("type")} appearance-none`}>
            <option value="">{fr ? "Choisir…" : "Choose…"}</option>
            {TYPES.map((x) => <option key={x} value={x}>{TYPE_LABELS[x][lang]}</option>)}
          </select>{err("type")}
        </label>
        <label className={label}>{fr ? "Domaine" : "Field"}{req}
          <select {...aria("domain")} required value={v.domain} onChange={set("domain")} className={`${field} ${border("domain")} appearance-none`}>
            <option value="">{fr ? "Choisir…" : "Choose…"}</option>
            {DOMAINS.map((x) => <option key={x} value={x}>{DOMAIN_LABELS[x][lang]}</option>)}
          </select>{err("domain")}
        </label>
        <label className={`${label} sm:col-span-2`}>{fr ? "Description du poste ou du projet" : "Role or project description"}{req}
          <textarea {...aria("description")} required rows={6} value={v.description} onChange={set("description")} maxLength={LIMITS.description} className={`${field} ${border("description")}`} />{err("description")}
        </label>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">{fr ? "Précisions" : "Details"}</legend>
        <label className={label}>{fr ? "Lieu / télétravail" : "Location / remote"}{opt}
          <input {...aria("location")} value={v.location} onChange={set("location")} maxLength={LIMITS.location} className={`${field} ${border("location")}`} />{err("location")}
        </label>
        <label className={label}>{fr ? "Date de début ou délai" : "Start date or deadline"}{opt}
          <input {...aria("start")} value={v.start} onChange={set("start")} maxLength={LIMITS.start} className={`${field} ${border("start")}`} />{err("start")}
        </label>
        <label className={label}>{fr ? "Budget ou rémunération" : "Budget or salary"}{opt}
          <input {...aria("budget")} value={v.budget} onChange={set("budget")} maxLength={LIMITS.budget} className={`${field} ${border("budget")}`} />{err("budget")}
        </label>
        <label className={label}>{fr ? "Lien vers l’offre ou le brief" : "Link to the offer or brief"}{opt}
          <input {...aria("link")} type="url" inputMode="url" placeholder="https://" value={v.link} onChange={set("link")} maxLength={LIMITS.link} className={`${field} ${border("link")}`} />{err("link")}
        </label>
      </fieldset>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
      </div>

      {status === "error" && message && (
        <div role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm leading-relaxed text-red-100">
          {message} <a href={mailto()} className="ml-1 text-gold underline underline-offset-4">{fr ? "Envoyer par email" : "Send by email"}</a>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-gold disabled:cursor-wait disabled:opacity-60">
          {status === "sending" ? (fr ? "Envoi en cours…" : "Sending…") : configured ? (fr ? "Envoyer ma proposition" : "Send my proposal") : (fr ? "Envoyer ma proposition par email" : "Send my proposal by email")}
        </button>
        <a href={`mailto:${email}`} className="text-sm text-mist underline-offset-4 hover:text-gold hover:underline">{email}</a>
      </div>
      <p className="text-xs leading-relaxed text-mist">
        {fr
          ? "Les informations transmises servent uniquement à traiter votre demande et à y répondre. Elles ne sont pas stockées sur ce site et ne vous inscrivent à aucune liste de diffusion. Champs marqués * obligatoires."
          : "The information you send is only used to handle and answer your request. It is not stored on this site and does not subscribe you to any mailing list. Fields marked * are required."}
      </p>
    </form>
  );
}
