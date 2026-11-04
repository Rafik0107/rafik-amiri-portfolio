import type { Lang } from "./content";

const fr = {
  nav: { home: "Accueil", engineering: "Ingénierie", projects: "Projets", photography: "Photographie", creative: "Studio", experience: "Parcours", education: "Formation", skills: "Compétences", about: "À propos", resume: "CV", contact: "Contact" },
  menu: "Menu", close: "Fermer", viewAll: "Tout voir", readCase: "Voir la fiche", github: "Code source sur GitHub",
  cta: { projects: "Voir mes projets", cv: "Télécharger mon CV", contact: "Me contacter", opportunity: "Me proposer une opportunité", opportunityShort: "Opportunité", hiring: "Vous recrutez ?", project: "Vous avez un projet ?" },
  doors: {
    eng: { name: "Ingénierie & Robotique", text: "Automatique, robotique, estimation, signal, vision et logiciel industriel — avec les projets qui le prouvent.", go: "Explorer l’ingénierie" },
    cre: { name: "Photographie & Design", text: "Photographie urbaine et portrait, design graphique et création visuelle — Raiden Creative Studio.", go: "Voir le studio" },
  },
  home: {
    bring: "Ce que j’apporte à une équipe",
    bringItems: [
      ["Bases solides en automatique", "Modélisation, régulation PID, estimation d’état et simulation (MATLAB/Simulink, Python)."],
      ["Expérience du terrain industriel", "Stages chez Sonatrach, en production céramique et en développement Smart Factory chez Wikeys."],
      ["Rigueur documentée", "Projets publiés avec tests automatisés, limites explicites et documentation FR/EN."],
      ["Sens visuel", "Photographie et design graphique : des interfaces, schémas et supports clairs."],
    ],
  },
  status: { completed: "Terminé dans son périmètre", "in-development": "En développement", planned: "Planifié" },
  source: { cv: "Issu du CV", github: "Code sur GitHub" },
  categories: { all: "Tous", robotics: "Robotique", automation: "Automatique", ai: "IA & vision", signal: "Signal", software: "Logiciel" },
  photoCats: { all: "Tout", monuments: "Paris — monuments", gardens: "Jardins", portrait: "Portrait", free: "Études libres" },
  skillGroups: { programming: "Programmation", engineering: "Ingénierie", ai: "Intelligence artificielle", web: "Web & outils", creative: "Création" },
  sections: {
    context: "Contexte", objective: "Objectif", contribution: "Ma contribution", method: "Méthode & choix techniques", results: "Résultats vérifiés", limits: "Limites & pistes d’amélioration", tech: "Technologies", validation: "Validation", links: "Liens",
    internships: "Stages en entreprise", jobs: "Parcours professionnel", transferable: "Compétences transférables",
    education: "Formation", featured: "Projets sélectionnés", studio: "Raiden Creative Studio", domains: "Domaines et preuves",
  },
  contributionGithub: "Projet individuel préparé avec assistance IA (octobre 2026) : code, tests automatisés et documentation bilingue publiés sur GitHub.",
  cvSourceNote: "Projet mentionné dans mon CV. L’architecture, les mesures et les captures ne sont pas encore publiées ; cette fiche s’en tient aux informations confirmées.",
  aiNote: "Les 12 projets Python sont des implémentations pédagogiques préparées avec assistance IA ; chaque fiche précise leurs limites.",
  dateTbc: "Dates sur demande",
  ai: { title: "RAIDEN AI", hello: "Bonjour, je suis RAIDEN AI. Posez-moi une question sur le parcours, les projets, les compétences ou la photographie de Rafik.", placeholder: "Votre question…", send: "Envoyer", open: "Ouvrir l’assistant RAIDEN AI", local: "Mode local — réponses tirées du portfolio", suggestions: ["Quelle est sa formation ?", "Quels projets GitHub ?", "Quelles expériences pro ?", "Où voir ses photos ?"] },
  contact: { kicker: "Contact", title: "Travaillons ensemble", sub: "Vous recrutez ou vous avez un projet à réaliser ? Présentez-moi votre besoin : opportunité professionnelle, mission créative ou projet technique.", copy: "Copier l’adresse", copied: "Adresse copiée" },
  resume: { title: "Curriculum vitæ", download: "Télécharger le CV (PDF)", other: "English version (PDF)", print: "Imprimer" },
  notFound: { title: "Cette page n’existe pas", back: "Retour à l’accueil" },
  footer: { rights: "Tous droits réservés.", built: "Conçu et développé par Rafik Amiri." },
};

const en: typeof fr = {
  nav: { home: "Home", engineering: "Engineering", projects: "Projects", photography: "Photography", creative: "Studio", experience: "Experience", education: "Education", skills: "Skills", about: "About", resume: "Resume", contact: "Contact" },
  menu: "Menu", close: "Close", viewAll: "View all", readCase: "Open case study", github: "Source code on GitHub",
  cta: { projects: "See my projects", cv: "Download my CV", contact: "Contact me", opportunity: "Propose an opportunity", opportunityShort: "Opportunity", hiring: "Hiring?", project: "Have a project?" },
  doors: {
    eng: { name: "Engineering & Robotics", text: "Control, robotics, estimation, signal, vision and industrial software — with the projects that prove it.", go: "Explore engineering" },
    cre: { name: "Photography & Design", text: "Urban and portrait photography, graphic design and visual creation — Raiden Creative Studio.", go: "Visit the studio" },
  },
  home: {
    bring: "What I bring to a team",
    bringItems: [
      ["Solid control foundations", "Modelling, PID control, state estimation and simulation (MATLAB/Simulink, Python)."],
      ["Industrial field experience", "Internships at Sonatrach, in ceramics production and in Smart Factory development at Wikeys."],
      ["Documented rigour", "Published projects with automated tests, explicit limits and FR/EN documentation."],
      ["Visual sense", "Photography and graphic design: clear interfaces, diagrams and materials."],
    ],
  },
  status: { completed: "Completed within scope", "in-development": "In development", planned: "Planned" },
  source: { cv: "From CV", github: "Code on GitHub" },
  categories: { all: "All", robotics: "Robotics", automation: "Control", ai: "AI & vision", signal: "Signal", software: "Software" },
  photoCats: { all: "All", monuments: "Paris — landmarks", gardens: "Gardens", portrait: "Portrait", free: "Free studies" },
  skillGroups: { programming: "Programming", engineering: "Engineering", ai: "Artificial intelligence", web: "Web & tools", creative: "Creative" },
  sections: {
    context: "Context", objective: "Objective", contribution: "My contribution", method: "Method & technical choices", results: "Verified results", limits: "Limits & next steps", tech: "Technologies", validation: "Validation", links: "Links",
    internships: "Company internships", jobs: "Professional history", transferable: "Transferable skills",
    education: "Education", featured: "Selected projects", studio: "Raiden Creative Studio", domains: "Domains and evidence",
  },
  contributionGithub: "Individual project prepared with AI assistance (October 2026): code, automated tests and bilingual documentation published on GitHub.",
  cvSourceNote: "Project listed on my CV. Architecture, measurements and screenshots are not published yet; this page sticks to confirmed information.",
  aiNote: "The 12 Python projects are educational implementations prepared with AI assistance; each case study states its limits.",
  dateTbc: "Dates on request",
  ai: { title: "RAIDEN AI", hello: "Hi, I'm RAIDEN AI. Ask me about Rafik's background, projects, skills or photography.", placeholder: "Your question…", send: "Send", open: "Open the RAIDEN AI assistant", local: "Local mode — answers drawn from the portfolio", suggestions: ["What did he study?", "Which GitHub projects?", "Work experience?", "Where are his photos?"] },
  contact: { kicker: "Contact", title: "Let’s work together", sub: "Hiring, or have a project to bring to life? Tell me what you need: a professional opportunity, a creative assignment or a technical project.", copy: "Copy address", copied: "Address copied" },
  resume: { title: "Curriculum vitae", download: "Download CV (PDF)", other: "Version française (PDF)", print: "Print" },
  notFound: { title: "This page does not exist", back: "Back to home" },
  footer: { rights: "All rights reserved.", built: "Designed and built by Rafik Amiri." },
};

export type Dict = typeof fr;
export function getDict(lang: Lang): Dict {
  return lang === "en" ? en : fr;
}

export const NAV_KEYS = ["engineering", "projects", "photography", "creative", "experience", "education", "skills", "about", "resume", "contact"] as const;
