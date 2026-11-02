import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "raiden_admin";
const TTL_SECONDS = 8 * 60 * 60;

const sha = (s: string) => createHash("sha256").update(s).digest();

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET || "").length >= 32);
}

export function checkPassword(pw: string) {
  if (!adminConfigured()) return false;
  return timingSafeEqual(sha(pw), sha(process.env.ADMIN_PASSWORD!));
}

function sign(payload: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(payload).digest("base64url");
}

export function createSession() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL_SECONDS);
  return { value: `${exp}.${sign(exp)}`, maxAge: TTL_SECONDS };
}

export function verifySession(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(exp));
  const given = Buffer.from(mac);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function isAdmin() {
  return verifySession((await cookies()).get(COOKIE)?.value);
}

/** Reject cross-site mutations: the Origin header must match the request host. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}
