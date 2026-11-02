import { PageHeader, Section, Timeline } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/education", getDict(lang).nav.education, lang === "fr" ? "Master 1 Automatique et Robotique à Sorbonne Université, Licence SPI à Sorbonne Paris Nord, Licence Automatique à Boumerdès." : "Master 1 in Automation and Robotics at Sorbonne Université, Engineering Sciences bachelor at Sorbonne Paris Nord, Automation bachelor in Boumerdès.");
}

export default async function Education({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  return (
    <>
      <PageHeader
        kicker={d.nav.education}
        title={d.sections.education}
        intro={lang === "fr" ? "De Boumerdès à Paris : un parcours en automatique, sciences de l'ingénieur puis robotique et mécatronique pour la santé." : "From Boumerdès to Paris: a path through automation and engineering sciences to robotics and mechatronics for health."}
      />
      <Section title={lang === "fr" ? "Chronologie académique" : "Academic timeline"}>
        <Timeline entries={portfolio.education} lang={lang} />
      </Section>
    </>
  );
}
