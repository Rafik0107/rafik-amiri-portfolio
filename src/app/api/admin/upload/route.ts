import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { githubConfigured, putFile } from "@/lib/github";

const MAX_BYTES = 3 * 1024 * 1024;

// Identify the file by its magic bytes rather than trusting the client.
function sniff(buf: Buffer): "jpg" | "png" | "webp" | "pdf" | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  if (buf.subarray(0, 5).toString() === "%PDF-") return "pdf";
  return null;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!githubConfigured()) return NextResponse.json({ error: "github_not_configured" }, { status: 503 });

  const { name, data, kind } = (await req.json().catch(() => ({}))) as { name?: string; data?: string; kind?: string };
  if (typeof name !== "string" || typeof data !== "string" || (kind !== "photo" && kind !== "cv")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const buf = Buffer.from(data, "base64");
  if (buf.length === 0 || buf.length > MAX_BYTES) return NextResponse.json({ error: "size" }, { status: 413 });
  const ext = sniff(buf);
  if (!ext || (kind === "cv") !== (ext === "pdf")) return NextResponse.json({ error: "type" }, { status: 415 });

  const base = name.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
  const file = `${base}-${Date.now().toString(36)}.${ext}`;
  const dir = kind === "cv" ? "cv" : "photos";
  try {
    const commit = await putFile(`public/${dir}/${file}`, buf.toString("base64"), `content: upload ${dir}/${file}`);
    return NextResponse.json({ ok: true, path: `/${dir}/${file}`, commit });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
