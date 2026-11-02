import type { Lang } from "./content";

const fr = {
  nav: { home: "Accueil", engineering: "Ingénierie", creative: "Studio créatif", about: "À propos", education: "Formation", experience: "Expérience", projects: "Projets", skills: "Compétences", photography: "Photographie", resume: "CV", contact: "Contact" },
  menu: "Menu", close: "Fermer", skip: "Passer l'intro", replay: "Rejouer l'intro", explore: "Explorer", enter: "Entrer",
  scroll: "Défiler", backHome: "Retour à l'accueil", viewAll: "Tout voir", readCase: "Étude de cas", github: "Code source GitHub",
  portals: {
    title: "Trois univers", kicker: "Choisissez votre porte d'entrée",
    eng: { name: "Univers Ingénierie", items: ["Robotique", "Intelligence artificielle", "Mécatronique", "Développement logiciel", "Projets académiques", "Stages"] },
    cre: { name: "Univers Créatif", items: ["Photographie", "Design graphique", "UI/UX", "Art numérique", "Projets créatifs", "Contenu visuel"] },
    all: { name: "Tout explorer", items: ["Biographie", "Formation", "Expérience", "Projets", "Compétences", "CV & contact"] },
  },
  status: { completed: "Terminé", "in-development": "En développement", planned: "Planifié" },
  source: { cv: "Issu du CV", github: "Dépôt GitHub" },
  categories: { all: "Tous", robotics: "Robotique", ai: "IA & données", automation: "Automatique", software: "Logiciel" },
  photoCats: { all: "Tout", urban: "Urbain — Paris", portrait: "Portrait", nature: "Nature", moments: "Instants" },
  skillGroups: { programming: "Programmation", engineering: "Ingénierie", ai: "Intelligence artificielle", web: "Web & outils", creative: "Créatif" },
  sections: {
    method: "Méthode & architecture", results: "Résultats vérifiés", limits: "Limites & périmètre", tech: "Technologies", validation: "Validation", context: "Contexte",
    timeline: "Le voyage", timelineSub: "Formation, stages, emplois et création — un parcours complet.",
    internships: "Stages d'ingénierie", jobs: "Parcours professionnel", transferable: "Compétences transférables",
    education: "Parcours académique", featured: "Projets phares", studio: "Raiden Creative Studio",
  },
  cvSourceNote: "Projet documenté dans le CV. Les détails techniques (architecture, résultats, captures) seront publiés après validation.",
  aiAssisted: "Projet pédagogique préparé avec assistance IA en octobre 2026 — code, tests et démonstration vérifiables sur GitHub.",
  dateTbc: "Dates sur demande",
  ai: { title: "RAIDEN AI", hello: "Bonjour, je suis RAIDEN AI. Posez-moi une question sur le parcours, les projets, les compétences ou la photographie de Rafik.", placeholder: "Votre question…", send: "Envoyer", open: "Ouvrir l'assistant RAIDEN AI", local: "Mode local — réponses tirées du portfolio", suggestions: ["Quelle est sa formation ?", "Quels projets GitHub ?", "Quelles expériences pro ?", "Où voir ses photos ?"] },
  contact: { title: "Travaillons ensemble", sub: "Stage, alternance, projet d'ingénierie ou mission photo : écrivez-moi.", name: "Nom", email: "Votre email", message: "Message", send: "Envoyer le message", note: "Le formulaire ouvre votre messagerie avec le message pré-rempli — aucune donnée n'est stockée sur ce site." },
  resume: { title: "Curriculum vitæ", download: "Télécharger le CV (PDF)", print: "Imprimer / enregistrer en PDF", academic: "Profil académique", professional: "Profil professionnel" },
  notFound: { title: "Cette page s'est perdue dans le vide", back: "Revenir à l'univers principal" },
  footer: { rights: "Tous droits réservés.", built: "Conçu et développé par Rafik Amiri." },
};

const en: typeof fr = {
  nav: { home: "Home", engineering: "Engineering", creative: "Creative studio", about: "About", education: "Education", experience: "Experience", projects: "Projects", skills: "Skills", photography: "Photography", resume: "Resume", contact: "Contact" },
  menu: "Menu", close: "Close", skip: "Skip intro", replay: "Replay intro", explore: "Explore", enter: "Enter",
  scroll: "Scroll", backHome: "Back home", viewAll: "View all", readCase: "Case study", github: "GitHub source code",
  portals: {
    title: "Three universes", kicker: "Choose your gateway",
    eng: { name: "Engineering Universe", items: ["Robotics", "Artificial intelligence", "Mechatronics", "Software development", "Academic projects", "Internships"] },
    cre: { name: "Creative Universe", items: ["Photography", "Graphic design", "UI/UX", "Digital art", "Creative projects", "Visual content"] },
    all: { name: "Explore everything", items: ["Biography", "Education", "Experience", "Projects", "Skills", "Resume & contact"] },
  },
  status: { completed: "Completed", "in-development": "In development", planned: "Planned" },
  source: { cv: "From CV", github: "GitHub repository" },
  categories: { all: "All", robotics: "Robotics", ai: "AI & data", automation: "Control", software: "Software" },
  photoCats: { all: "All", urban: "Urban — Paris", portrait: "Portrait", nature: "Nature", moments: "Moments" },
  skillGroups: { programming: "Programming", engineering: "Engineering", ai: "Artificial intelligence", web: "Web & tools", creative: "Creative" },
  sections: {
    method: "Method & architecture", results: "Verified results", limits: "Limits & scope", tech: "Technologies", validation: "Validation", context: "Context",
    timeline: "The journey", timelineSub: "Education, internships, jobs and creative work — the complete path.",
    internships: "Engineering internships", jobs: "Professional history", transferable: "Transferable skills",
    education: "Academic background", featured: "Featured projects", studio: "Raiden Creative Studio",
  },
  cvSourceNote: "Project documented in the CV. Technical details (architecture, results, screenshots) will be published once validated.",
  aiAssisted: "Educational project prepared with AI assistance in October 2026 — code, tests and demo verifiable on GitHub.",
  dateTbc: "Dates on request",
  ai: { title: "RAIDEN AI", hello: "Hi, I'm RAIDEN AI. Ask me about Rafik's background, projects, skills or photography.", placeholder: "Your question…", send: "Send", open: "Open the RAIDEN AI assistant", local: "Local mode — answers drawn from the portfolio", suggestions: ["What did he study?", "Which GitHub projects?", "Work experience?", "Where are his photos?"] },
  contact: { title: "Let's work together", sub: "Internship, apprenticeship, engineering project or photo assignment: get in touch.", name: "Name", email: "Your email", message: "Message", send: "Send message", note: "The form opens your email app with the message pre-filled — nothing is stored on this site." },
  resume: { title: "Curriculum vitae", download: "Download CV (PDF)", print: "Print / save as PDF", academic: "Academic profile", professional: "Professional profile" },
  notFound: { title: "This page drifted into the void", back: "Return to the main universe" },
  footer: { rights: "All rights reserved.", built: "Designed and built by Rafik Amiri." },
};

export type Dict = typeof fr;
export function getDict(lang: Lang): Dict {
  return lang === "en" ? en : fr;
}

export const NAV_KEYS = ["engineering", "creative", "projects", "experience", "education", "skills", "photography", "about", "resume", "contact"] as const;
