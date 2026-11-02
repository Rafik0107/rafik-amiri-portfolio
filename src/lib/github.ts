import "server-only";

const API = "https://api.github.com";

export function githubConfigured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "raiden-portfolio-admin",
  };
}

const branch = () => process.env.GITHUB_BRANCH || "main";
const encPath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

export async function getFile(path: string): Promise<{ sha: string; content: string } | null> {
  const res = await fetch(`${API}/repos/${process.env.GITHUB_REPO}/contents/${encPath(path)}?ref=${branch()}`, { headers: headers(), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const data = (await res.json()) as { sha: string; content: string };
  return { sha: data.sha, content: Buffer.from(data.content, "base64").toString("utf8") };
}

/** Create or update a file in one commit; Vercel redeploys on push. */
export async function putFile(path: string, base64: string, message: string) {
  const existing = await getFile(path).catch(() => null);
  const res = await fetch(`${API}/repos/${process.env.GITHUB_REPO}/contents/${encPath(path)}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: base64, branch: branch(), ...(existing ? { sha: existing.sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`);
  const data = (await res.json()) as { commit?: { html_url?: string } };
  return data.commit?.html_url || "";
}
