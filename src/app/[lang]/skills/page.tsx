import SkillConstellation from "@/components/SkillConstellation";
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
        title={fr ? "Constellation de compétences" : "Skill constellation"}
        intro={fr ? "Faites glisser la sphère pour l'explorer ; survolez une famille pour l'illuminer. Pas de pourcentages inventés : seulement les outils réellement pratiqués." : "Drag the sphere to explore it; hover a family to light it up. No made-up percentages: only tools actually practised."}
      />
      <Section title={fr ? "Technologies & savoir-faire" : "Technologies & know-how"}>
        <SkillConstellation groups={portfolio.skills} lang={lang} />
      </Section>
    </>
  );
}
