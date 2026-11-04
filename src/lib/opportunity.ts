// Shared by the form (client) and /api/opportunity (server): one source of truth for choices and limits.
export const TYPES = ["job", "apprenticeship", "internship", "freelance", "collaboration"] as const;
export const DOMAINS = ["web", "security", "photo", "design", "robotics", "other"] as const;
export type OppType = (typeof TYPES)[number];
export type OppDomain = (typeof DOMAINS)[number];

export const TYPE_LABELS: Record<OppType, { fr: string; en: string }> = {
  job: { fr: "Emploi", en: "Job" },
  apprenticeship: { fr: "Alternance", en: "Apprenticeship" },
  internship: { fr: "Stage", en: "Internship" },
  freelance: { fr: "Mission freelance", en: "Freelance assignment" },
  collaboration: { fr: "Collaboration", en: "Collaboration" },
};
export const DOMAIN_LABELS: Record<OppDomain, { fr: string; en: string }> = {
  web: { fr: "Développement web", en: "Web development" },
  security: { fr: "Cybersécurité", en: "Cybersecurity" },
  photo: { fr: "Photographie", en: "Photography" },
  design: { fr: "Design graphique", en: "Graphic design" },
  robotics: { fr: "Automatique, robotique et mécatronique", en: "Control, robotics and mechatronics" },
  other: { fr: "Autre projet", en: "Other project" },
};

export const LIMITS = { name: 100, email: 160, company: 120, description: 4000, location: 120, start: 80, budget: 80, link: 400 } as const;
export type Opportunity = { name: string; email: string; company: string; type: OppType | ""; domain: OppDomain | ""; description: string; location: string; start: string; budget: string; link: string };
export type FieldErrors = Partial<Record<keyof Opportunity, string>>;

const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

export function validate(o: Opportunity, lang: "fr" | "en"): FieldErrors {
  const fr = lang === "fr";
  const e: FieldErrors = {};
  if (!o.name.trim()) e.name = fr ? "Indiquez votre nom." : "Please enter your name.";
  if (!o.email.trim()) e.email = fr ? "Indiquez votre adresse email." : "Please enter your email address.";
  else if (!EMAIL.test(o.email.trim())) e.email = fr ? "Cette adresse email ne semble pas valide." : "This email address does not look valid.";
  if (!TYPES.includes(o.type as OppType)) e.type = fr ? "Choisissez un type d’opportunité." : "Choose an opportunity type.";
  if (!DOMAINS.includes(o.domain as OppDomain)) e.domain = fr ? "Choisissez un domaine." : "Choose a field.";
  if (o.description.trim().length < 20) e.description = fr ? "Décrivez le poste ou le projet (20 caractères minimum)." : "Describe the role or project (at least 20 characters).";
  if (o.link.trim() && !/^https?:\/\/[^\s]+$/i.test(o.link.trim())) e.link = fr ? "Le lien doit commencer par http:// ou https://." : "The link must start with http:// or https://.";
  (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).forEach((k) => {
    if (o[k].length > LIMITS[k]) e[k] = fr ? `Texte trop long (${LIMITS[k]} caractères maximum).` : `Too long (${LIMITS[k]} characters max).`;
  });
  return e;
}

/** Plain-text summary, used both for the email body and the mailto fallback. */
export function summary(o: Opportunity) {
  const t = TYPES.includes(o.type as OppType) ? TYPE_LABELS[o.type as OppType].fr : o.type;
  const d = DOMAINS.includes(o.domain as OppDomain) ? DOMAIN_LABELS[o.domain as OppDomain].fr : o.domain;
  return [
    `Nom : ${o.name}`,
    `Email : ${o.email}`,
    o.company ? `Organisation : ${o.company}` : null,
    `Type : ${t}`,
    `Domaine : ${d}`,
    o.location ? `Lieu / télétravail : ${o.location}` : null,
    o.start ? `Début / délai : ${o.start}` : null,
    o.budget ? `Budget / rémunération : ${o.budget}` : null,
    o.link ? `Lien : ${o.link}` : null,
    "",
    o.description,
  ].filter((x) => x !== null).join("\n");
}

/** Link to the "Work with me" section, optionally with a preselected (editable) choice. */
export function oppHref(lang: "fr" | "en", pre: { type?: OppType; domain?: OppDomain } = {}) {
  const q = new URLSearchParams();
  if (pre.type) q.set("type", pre.type);
  if (pre.domain) q.set("domain", pre.domain);
  const s = q.toString();
  return `/${lang}/contact${s ? `?${s}` : ""}#${lang === "fr" ? "travaillons-ensemble" : "work-together"}`;
}
