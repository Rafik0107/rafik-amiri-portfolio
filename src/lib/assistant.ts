import { portfolio, t, type Lang, type Portfolio } from "./content";

/** Plain-text fact sheet built only from the published portfolio data. */
export function knowledge(lang: Lang, p: Portfolio = portfolio): string {
  const lines: string[] = [];
  const pr = p.profile;
  lines.push(`NAME: ${pr.name} (alias ${pr.alias}), ${pr.location}. ${t(pr.headline, lang)}`);
  lines.push(`BIO: ${t(pr.bio, lang)}`);
  lines.push(`CREATIVE: ${t(pr.creativeBio, lang)} ${t(pr.selfEmployed, lang)}`);
  lines.push(`LINKS: GitHub ${pr.links.github} | Photography (Carrd) ${pr.links.carrd} | Instagram ${pr.links.instagram} | Email ${pr.links.email}`);
  lines.push("EDUCATION:");
  p.education.forEach((e) => lines.push(`- ${t(e.period, lang)}: ${t(e.title, lang)}, ${t(e.org, lang)}, ${e.place}. ${t(e.details, lang)}`));
  lines.push("INTERNSHIPS:");
  p.internships.forEach((e) => lines.push(`- ${t(e.period, lang) || "n/d"}: ${t(e.org, lang)} (${e.place || "n/d"}) — ${t(e.title, lang)}. ${t(e.details, lang)}`));
  lines.push("JOBS & ACTIVITIES:");
  p.jobs.forEach((e) => lines.push(`- ${t(e.org, lang)} — ${t(e.title, lang)}${t(e.period, lang) ? ` (${t(e.period, lang)})` : ""}${e.place ? `, ${e.place}` : ""}. ${t(e.details, lang)}`));
  lines.push("PROJECTS:");
  p.projects.forEach((x) => lines.push(`- ${t(x.title, lang)} [${x.status}, source: ${x.source}${x.tech.length ? `, tech: ${x.tech.join(", ")}` : ""}]: ${t(x.summary, lang)} ${t(x.results, lang)}${x.repo ? ` Repo: ${x.repo}` : ""}`));
  lines.push(`GITHUB: ${p.githubRepo.url} — ${t(p.githubRepo.note, lang)}`);
  lines.push("SKILLS: " + p.skills.map((g) => `${g.group}: ${g.items.join(", ")}`).join(" | "));
  return lines.join("\n");
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

type Topic = { keys: string[]; answer: (lang: Lang) => string };

const topics: Topic[] = [
  {
    keys: ["etud", "study", "studies", "formation", "education", "master", "licence", "bachelor", "univers", "sorbonne", "diplom", "degree", "bac", "ecole", "school"],
    answer: (lang) =>
      (lang === "fr" ? "Parcours académique de Rafik :\n" : "Rafik's academic path:\n") +
      portfolio.education.map((e) => `• ${t(e.period, lang)} — ${t(e.title, lang)}, ${t(e.org, lang)}`).join("\n"),
  },
  {
    keys: ["stage", "intern", "wikeys", "sonatrach", "ceramique", "mokassiart", "industri"],
    answer: (lang) =>
      (lang === "fr" ? "Stages d'ingénierie :\n" : "Engineering internships:\n") +
      portfolio.internships.map((e) => `• ${t(e.period, lang) ? t(e.period, lang) + " — " : ""}${t(e.org, lang)}${e.place ? ` (${e.place})` : ""} : ${t(e.details, lang)}`).join("\n"),
  },
  {
    keys: ["experience", "travail", "job", "work", "emploi", "subway", "restaura", "serveur", "waiter", "balthazar", "rambla", "taksim"],
    answer: (lang) =>
      (lang === "fr" ? "Expérience professionnelle :\n" : "Professional experience:\n") +
      portfolio.jobs.map((e) => `• ${t(e.org, lang)} — ${t(e.title, lang)}${t(e.period, lang) ? ` (${t(e.period, lang)})` : ""}`).join("\n") +
      (lang === "fr" ? "\n\nDétails sur la page Expérience." : "\n\nDetails on the Experience page."),
  },
  {
    keys: ["github", "repo", "code", "python", "projet", "project", "robot", "kalman", "pid", "a*", "astar", "ecg", "vision", "machine learning", "ia ", "ai ", "intelligence"],
    answer: (lang) => {
      const gh = portfolio.projects.filter((p) => p.source === "github" && p.status === "completed");
      const cv = portfolio.projects.filter((p) => p.source === "cv");
      return (
        (lang === "fr" ? `Sur GitHub (${portfolio.githubRepo.url}) : ${t(portfolio.githubRepo.note, lang)}\n` : `On GitHub (${portfolio.githubRepo.url}): ${t(portfolio.githubRepo.note, lang)}\n`) +
        gh.map((p) => `• ${t(p.title, lang)}`).join("\n") +
        (lang === "fr" ? "\n\nProjets issus du CV :\n" : "\n\nProjects from the CV:\n") +
        cv.map((p) => `• ${t(p.title, lang)} — ${(lang === "fr" ? { completed: "terminé", "in-development": "en développement", planned: "planifié" } : { completed: "completed", "in-development": "in development", planned: "planned" })[p.status]}`).join("\n")
      );
    },
  },
  {
    keys: ["competen", "skill", "langage", "language", "techno", "outil", "tool", "matlab", "arduino", "angular", "flutter"],
    answer: (lang) =>
      (lang === "fr" ? "Compétences :\n" : "Skills:\n") + portfolio.skills.map((g) => `• ${g.items.join(", ")}`).join("\n"),
  },
  {
    keys: ["photo", "carrd", "image", "design", "graphi", "creati", "ui", "ux", "instagram", "art"],
    answer: (lang) =>
      `${t(portfolio.profile.creativeBio, lang)}\n` +
      (lang === "fr"
        ? `Galerie sur la page Photographie, et portfolio d'origine : ${portfolio.profile.links.carrd}`
        : `Gallery on the Photography page, original portfolio: ${portfolio.profile.links.carrd}`),
  },
  {
    keys: ["cv", "resume", "curriculum", "pdf"],
    answer: (lang) => (lang === "fr" ? "Le CV complet est sur la page CV, imprimable et téléchargeable en PDF." : "The full resume is on the Resume page, printable and downloadable as PDF."),
  },
  {
    keys: ["contact", "mail", "joindre", "reach", "hire", "freelance", "embauch", "recrut"],
    answer: (lang) =>
      (lang === "fr" ? `Vous pouvez écrire à Rafik : ${portfolio.profile.links.email}, ou utiliser la page Contact. ` : `You can email Rafik at ${portfolio.profile.links.email}, or use the Contact page. `) +
      t(portfolio.profile.selfEmployed, lang),
  },
  {
    keys: ["qui", "who", "raiden", "about", "propos", "presente", "introduce"],
    answer: (lang) => t(portfolio.profile.bio, lang),
  },
];

/** Free, deterministic answer engine used when no AI API key is configured. */
export function localAnswer(question: string, lang: Lang): string {
  const q = ` ${norm(question)} `;
  let best: Topic | undefined, score = 0;
  for (const tp of topics) {
    const s = tp.keys.reduce((acc, k) => acc + (q.includes(k) ? 1 : 0), 0);
    if (s > score) { score = s; best = tp; }
  }
  if (best) return best.answer(lang);
  return lang === "fr"
    ? "Je réponds uniquement à partir des informations publiées sur ce portfolio : formation, stages, expériences, projets, compétences, photographie et contact. Pouvez-vous reformuler ?"
    : "I only answer from the information published on this portfolio: education, internships, experience, projects, skills, photography and contact. Could you rephrase?";
}
