import SkillMap from "@/components/SkillMap";
import { PageHeader, Section } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/skills", getDict(lang).nav.skills, portfolio.skills.flatMap((g) => g.items).join(", "));
}

export default async function Skills({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  return (
    <>
      <PageHeader
        kicker={d.nav.skills}
        title={fr ? "Compétences et preuves" : "Skills and evidence"}
        intro={fr ? "Sélectionnez une compétence pour voir les projets où elle est utilisée. Pas de pourcentages ni de niveaux inventés." : "Select a skill to see the projects where it is used. No invented percentages or levels."}
      />
      <Section title={fr ? "Par domaine" : "By domain"}>
        <SkillMap groups={portfolio.skills} projects={portfolio.projects} lang={lang} />
      </Section>
    </>
  );
}
