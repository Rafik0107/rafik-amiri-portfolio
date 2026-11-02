import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getFile, githubConfigured, putFile } from "@/lib/github";
import { portfolio } from "@/lib/content";

const PATH = "content/portfolio.json";
const REQUIRED = ["profile", "education", "internships", "jobs", "skills", "projects", "photos", "ai"];

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (githubConfigured()) {
    const f = await getFile(PATH).catch(() => null);
    if (f) return NextResponse.json({ content: JSON.parse(f.content), source: "github" });
  }
  return NextResponse.json({ content: portfolio, source: "bundle" });
}

export async function PUT(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!githubConfigured()) return NextResponse.json({ error: "github_not_configured" }, { status: 503 });

  const text = await req.text();
  if (text.length > 1_000_000) return NextResponse.json({ error: "too_large" }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = JSON.parse(text).content; } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  if (!data || typeof data !== "object" || REQUIRED.some((k) => !(k in data))) {
    return NextResponse.json({ error: "invalid_shape" }, { status: 400 });
  }
  try {
    const url = await putFile(PATH, Buffer.from(JSON.stringify(data, null, 2) + "\n").toString("base64"), "content: update portfolio via admin dashboard");
    return NextResponse.json({ ok: true, commit: url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
