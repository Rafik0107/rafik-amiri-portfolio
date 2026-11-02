import { NextResponse } from "next/server";
import { COOKIE, adminConfigured, checkPassword, createSession, sameOrigin } from "@/lib/auth";

const attempts = new Map<string, { n: number; reset: number }>();

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!adminConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.n >= 5) return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !checkPassword(password)) {
    attempts.set(ip, a && a.reset > now ? { n: a.n + 1, reset: a.reset } : { n: 1, reset: now + 15 * 60_000 });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  attempts.delete(ip);
  const s = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, s.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: s.maxAge });
  return res;
}
