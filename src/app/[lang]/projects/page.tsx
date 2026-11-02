import ProjectGrid from "@/components/ProjectGrid";
import { PageHeader, Section } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/projects", getDict(lang).nav.projects, lang === "fr" ? "Projets d'ingénierie : robotique, automatique, IA, vision, logiciel — avec statut, technologies et code source." : "Engineering projects: robotics, control, AI, vision, software — with status, technologies and source code.");
}

export default async function Projects({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  return (
    <>
      <PageHeader
        kicker={d.nav.projects}
        title={lang === "fr" ? "Galerie de projets" : "Project gallery"}
        intro={lang === "fr" ? "Chaque projet affiche son statut réel — terminé, en développement ou planifié — et sa source : CV ou dépôt GitHub public." : "Every project shows its real status — completed, in development or planned — and its source: CV or public GitHub repository."}
      />
      <Section title={`${portfolio.projects.length} ${lang === "fr" ? "projets" : "projects"}`}>
        <ProjectGrid projects={portfolio.projects} lang={lang} />
      </Section>
    </>
  );
}
