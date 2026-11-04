import type { L } from "./content";

/** Engineering domains and the projects that actually demonstrate them. */
export const DOMAINS: { key: string; title: L; text: L; tools: string[]; projects: string[] }[] = [
  {
    key: "control",
    title: { fr: "Automatique & contrôle-commande", en: "Control engineering" },
    text: { fr: "Régulation, asservissement et automatisation de procédés : du réglage d’un PID à la simulation d’une ligne automatisée.", en: "Regulation, servo control and process automation: from tuning a PID to simulating an automated line." },
    tools: ["MATLAB", "Simulink", "PLC", "Factory I/O", "Python"],
    projects: ["pid-control", "solar-tracking-system", "factory-io-production-simulation"],
  },
  {
    key: "robotics",
    title: { fr: "Robotique", en: "Robotics" },
    text: { fr: "Cinématique, planification de trajectoire et maquettes pilotées par microcontrôleur.", en: "Kinematics, path planning and microcontroller-driven models." },
    tools: ["Python", "NumPy", "Arduino"],
    projects: ["arm-kinematics", "astar-navigation", "arduino-robotic-production-line"],
  },
  {
    key: "estimation",
    title: { fr: "Estimation & capteurs", en: "Estimation & sensors" },
    text: { fr: "Reconstruire un état à partir de mesures bruitées : filtrage de Kalman et fusion gyroscope/accéléromètre.", en: "Recovering a state from noisy measurements: Kalman filtering and gyroscope/accelerometer fusion." },
    tools: ["Python", "NumPy"],
    projects: ["kalman-tracking", "imu-fusion"],
  },
  {
    key: "signal",
    title: { fr: "Traitement du signal", en: "Signal processing" },
    text: { fr: "Analyse temporelle et fréquentielle : vibrations mécaniques et signaux ECG synthétiques (usage pédagogique, non clinique).", en: "Time and frequency analysis: mechanical vibrations and synthetic ECG signals (educational, not clinical)." },
    tools: ["MATLAB", "Simulink", "Python", "NumPy"],
    projects: ["matlab-simulink-vibration-analysis", "vibration-analysis", "ecg-analysis"],
  },
  {
    key: "vision",
    title: { fr: "Vision & IA", en: "Vision & AI" },
    text: { fr: "Traitement d’images et apprentissage automatique sur données synthétiques : contours, anomalies, clustering.", en: "Image processing and machine learning on synthetic data: edges, anomalies, clustering." },
    tools: ["Python", "NumPy"],
    projects: ["edge-detection", "anomaly-detection", "clustering-lab"],
  },
  {
    key: "software",
    title: { fr: "Logiciel industriel", en: "Industrial software" },
    text: { fr: "Applications pour l’atelier et la production : web, mobile et optimisation.", en: "Applications for the shop floor and production: web, mobile and optimisation." },
    tools: ["Angular", "JavaScript", "Python"],
    projects: ["smart-factory-web-app", "industrial-supervision-mobile-app", "production-scheduler", "warehouse-routes"],
  },
];

/** Projects where each skill is visibly used. Skills without an entry are listed as declared on the CV. */
export const SKILL_PROJECTS: Record<string, string[]> = {
  Python: ["astar-navigation", "pid-control", "kalman-tracking", "arm-kinematics", "edge-detection", "anomaly-detection", "clustering-lab", "vibration-analysis", "production-scheduler", "imu-fusion", "ecg-analysis", "warehouse-routes"],
  JavaScript: ["smart-factory-web-app"],
  Angular: ["smart-factory-web-app"],
  MATLAB: ["matlab-simulink-vibration-analysis"],
  Simulink: ["matlab-simulink-vibration-analysis"],
  Arduino: ["arduino-robotic-production-line"],
  "Factory I/O": ["factory-io-production-simulation"],
  Automation: ["pid-control", "solar-tracking-system", "factory-io-production-simulation"],
  Robotics: ["arm-kinematics", "astar-navigation", "arduino-robotic-production-line"],
  "Machine Learning": ["clustering-lab", "anomaly-detection"],
  "Computer Vision": ["edge-detection"],
  "Image Processing": ["edge-detection"],
  "Data Analysis": ["anomaly-detection", "ecg-analysis"],
};

/** Featured selection: one per area, favouring the strongest available evidence. */
export const FEATURED_HOME = ["smart-factory-web-app", "arm-kinematics", "pid-control"];
export const FEATURED_ENGINEERING = ["smart-factory-web-app", "arm-kinematics", "pid-control", "kalman-tracking", "ecg-analysis", "warehouse-routes"];
