import ProjectGrid from "@/components/ProjectGrid";
import { PageHeader, Section } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/projects", getDict(lang).nav.projects, lang === "fr" ? "Projets d’ingénierie : robotique, automatique, IA et vision, traitement du signal, logiciel — avec statut, technologies et code source." : "Engineering projects: robotics, control, AI and vision, signal processing, software — with status, technologies and source code.");
}

export default async function Projects({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  return (
    <>
      <PageHeader
        kicker={d.nav.projects}
        title={fr ? "Catalogue de projets" : "Project catalogue"}
        intro={fr ? "Chaque fiche indique son statut réel et sa source : projet du CV, stage, ou code public sur GitHub. Filtrez par domaine ou par statut." : "Each entry shows its real status and source: CV project, internship, or public code on GitHub. Filter by domain or status."}
      />
      <Section title={`${portfolio.projects.length} ${fr ? "projets" : "projects"}`} intro={d.aiNote}>
        <ProjectGrid projects={portfolio.projects} lang={lang} />
      </Section>
    </>
  );
}
