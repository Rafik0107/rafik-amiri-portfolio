import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../content/portfolio.json", import.meta.url), "utf8"));
const raw = JSON.stringify(data);

function walk(v, path, out) {
  if (v && typeof v === "object" && !Array.isArray(v) && "fr" in v && "en" in v) out.push([path, v]);
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, out);
  return out;
}

test("every bilingual field has both FR and EN, or neither", () => {
  for (const [path, v] of walk(data, "$", [])) {
    assert.equal(Boolean(v.fr), Boolean(v.en), `${path} is missing a translation`);
  }
});

test("project slugs are unique and statuses valid", () => {
  const slugs = data.projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const p of data.projects) assert.ok(["completed", "in-development", "planned"].includes(p.status), p.slug);
});

test("every gallery photo exists on disk", () => {
  for (const p of data.photos) assert.ok(existsSync(new URL(`../public${p.src}`, import.meta.url)), p.src);
});

test("internship project links point to real projects", () => {
  for (const i of data.internships) if (i.project) assert.ok(data.projects.some((p) => p.slug === i.project), i.project);
});

test("no private identifiers are published", () => {
  assert.doesNotMatch(raw, /\b\d{14}\b/, "looks like a SIRET number");
  assert.doesNotMatch(raw, /(\+33|0)[1-9](?:[ .-]?\d{2}){4}/, "looks like a French phone number");
  assert.doesNotMatch(raw, /\b\d{1,4},? (rue|avenue|boulevard|bd)\b/i, "looks like a street address");
});
