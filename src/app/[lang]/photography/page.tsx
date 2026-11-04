import Image from "next/image";
import Gallery from "@/components/Gallery";
import { Section } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/photography", getDict(lang).nav.photography, lang === "fr" ? "Photographies originales de Rafik Amiri (Raiden) : monuments de Paris, jardins, portraits et études libres." : "Original photographs by Rafik Amiri (Raiden): Paris landmarks, gardens, portraits and free studies.");
}

export default async function Photography({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const [opening, ...rest] = portfolio.photos;
  return (
    <>
      <section className="relative h-[78svh] min-h-[460px] overflow-hidden">
        <div className="rise-img absolute inset-0">
          <div data-parallax="-8" className="absolute inset-0 -bottom-16">
            <Image src={opening.src} alt={opening.alt} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-void/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-12 md:px-8">
          <p className="kicker rise">{d.sections.studio}</p>
          <h1 className="rise mt-3 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-none" style={{ animationDelay: "0.08s" }}><span className="gold-text">{d.nav.photography}</span></h1>
          <p className="rise mt-4 max-w-xl text-mist" style={{ animationDelay: "0.16s" }}>{fr ? "Paris, ses monuments et ses jardins, des portraits et des études de lumière — issus de mon portfolio photographique." : "Paris, its landmarks and gardens, portraits and studies of light — from my photography portfolio."}</p>
        </div>
      </section>
      <Section title={fr ? "Galerie" : "Gallery"} intro={fr ? "Touchez ou cliquez une image pour l’ouvrir en plein écran ; flèches du clavier ou glissement pour naviguer." : "Tap or click an image to open it fullscreen; use arrow keys or swipe to navigate."}>
        <Gallery photos={[opening, ...rest]} lang={lang} />
        <p className="mt-10 text-sm text-mist">
          {fr ? "© Rafik Amiri. Portfolio photographique d’origine : " : "© Rafik Amiri. Original photography portfolio: "}
          <a className="text-gold underline-offset-4 hover:underline" href={portfolio.profile.links.carrd} target="_blank" rel="noopener noreferrer">meinfewminites.carrd.co ↗</a>
        </p>
      </Section>
    </>
  );
}
