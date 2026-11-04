import { NextResponse } from "next/server";
import { portfolio } from "@/lib/content";
import { DOMAIN_LABELS, TYPE_LABELS, summary, validate, type OppDomain, type OppType, type Opportunity } from "@/lib/opportunity";

export const runtime = "nodejs";

/*
 * Sends a "Work with me" proposal by email through Resend (https://resend.com).
 * Server-side only: RESEND_API_KEY never reaches the browser. Nothing is stored.
 *   RESEND_API_KEY      required to enable sending
 *   CONTACT_TO_EMAIL    recipient (defaults to the confirmed address in portfolio.json)
 *   CONTACT_FROM_EMAIL  sender (defaults to Resend's test sender, which only delivers to the Resend account owner)
 */

const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { n: 1, reset: now + 10 * 60_000 }); return false; }
  h.n += 1;
  return h.n > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "") : "");

export async function POST(req: Request) {
  // Same-origin only.
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let raw: Record<string, unknown>;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const lang = raw.lang === "en" ? "en" : "fr";

  // Spam guards: hidden honeypot field and a minimum fill time. Bots get a neutral answer.
  const elapsed = Date.now() - Number(raw.startedAt || 0);
  if (clean(raw.website) || !Number.isFinite(elapsed) || elapsed < 3000) return NextResponse.json({ error: "spam" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const o: Opportunity = {
    name: clean(raw.name).trim(), email: clean(raw.email).trim(), company: clean(raw.company).trim(),
    type: clean(raw.type) as OppType, domain: clean(raw.domain) as OppDomain, description: clean(raw.description).trim(),
    location: clean(raw.location).trim(), start: clean(raw.start).trim(), budget: clean(raw.budget).trim(), link: clean(raw.link).trim(),
  };
  const errors = validate(o, lang);
  if (Object.keys(errors).length) return NextResponse.json({ error: "invalid", fields: errors }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const to = process.env.CONTACT_TO_EMAIL || portfolio.profile.links.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Rafik Amiri <onboarding@resend.dev>";
  const type = TYPE_LABELS[o.type as OppType].fr, domain = DOMAIN_LABELS[o.domain as OppDomain].fr;
  const text = summary(o);
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;color:#111">
<p style="margin:0 0 12px;color:#7b2fff;letter-spacing:.2em;font-size:11px">PROPOSITION VIA LE PORTFOLIO</p>
<pre style="white-space:pre-wrap;font-family:inherit;margin:0">${esc(text)}</pre></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: o.email, subject: `[Portfolio] ${type} · ${domain} — ${o.name}`.slice(0, 180), text, html }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("opportunity: email provider refused", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    const data = (await res.json()) as { id?: string };
    return NextResponse.json({ ok: true, id: data.id ?? null });
  } catch (err) {
    console.error("opportunity: email provider unreachable", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
