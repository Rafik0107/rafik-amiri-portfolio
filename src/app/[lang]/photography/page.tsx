import Link from "next/link";
import Gallery from "@/components/Gallery";
import { PageHeader, Section } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/photography", getDict(lang).nav.photography, lang === "fr" ? "Photographies originales de Rafik Amiri (Raiden) : Paris urbain, portraits, nature et instants." : "Original photographs by Rafik Amiri (Raiden): urban Paris, portraits, nature and moments.");
}

export default async function Photography({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  return (
    <>
      <PageHeader
        kicker={d.sections.studio}
        title={d.nav.photography}
        intro={fr ? "Paris en lumière dorée, portraits et instants suspendus. Cliquez sur une image pour l'ouvrir en plein écran ; flèches du clavier pour naviguer." : "Paris in golden light, portraits and suspended moments. Click an image to open it fullscreen; use the arrow keys to navigate."}
      />
      <Section title={fr ? "Galerie" : "Gallery"}>
        <Gallery photos={portfolio.photos} lang={lang} />
        <p className="mt-10 text-sm text-mist">
          {fr ? "Toutes les photographies © Rafik Amiri. Portfolio d'origine : " : "All photographs © Rafik Amiri. Original portfolio: "}
          <Link className="text-gold underline-offset-4 hover:underline" href={portfolio.profile.links.carrd} target="_blank" rel="noopener noreferrer">meinfewminites.carrd.co ↗</Link>
        </p>
      </Section>
    </>
  );
}
