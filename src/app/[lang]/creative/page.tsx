import Image from "next/image";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { PageHeader, Section } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/creative", "Raiden Creative Studio", t(portfolio.profile.creativeBio, lang));
}

export default async function Creative({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const disciplines = fr
    ? [
        ["Photographie", "Paris urbain, monuments, jardins et instants de vie — lumière naturelle et étalonnage cinématographique."],
        ["Portrait", "Portraits en extérieur, attention à la lumière, aux couleurs et à l'émotion du sujet."],
        ["Design graphique", "Identités visuelles et visuels pour le e-commerce et les réseaux."],
        ["UI/UX", "Interfaces claires et intuitives, où la logique d'ingénieur rencontre le sens esthétique."],
        ["Contenu digital", "Création de contenus visuels pour marques et projets personnels."],
        ["Narration visuelle", "Raconter une histoire en une image, ou en une série."],
      ]
    : [
        ["Photography", "Urban Paris, landmarks, gardens and everyday moments — natural light and cinematic grading."],
        ["Portrait", "Outdoor portraits with care for light, colour and the subject's emotion."],
        ["Graphic design", "Visual identities and visuals for e-commerce and social media."],
        ["UI/UX", "Clear, intuitive interfaces where engineering logic meets aesthetic sense."],
        ["Digital content", "Visual content creation for brands and personal projects."],
        ["Visual storytelling", "Telling a story in a single image, or in a series."],
      ];
  const hero = portfolio.photos.find((p) => p.src.endsWith("image02.jpg"))!;

  return (
    <>
      <PageHeader kicker={`II · ${d.nav.creative}`} title={d.sections.studio} intro={t(portfolio.profile.creativeBio, lang)} />
      <div className="relative mx-auto h-[46vh] max-w-7xl overflow-hidden rounded-[2rem] border border-gold/15 md:h-[60vh]">
        <div data-parallax="-14" className="absolute inset-0 -bottom-24">
          <Image src={hero.src} alt={fr ? hero.title : hero.titleEn} fill priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
        <p className="absolute bottom-6 left-6 font-display text-sm tracking-[0.35em] text-gold">{fr ? hero.title : hero.titleEn} · © Rafik Amiri</p>
      </div>

      <Section kicker={fr ? "Disciplines" : "Disciplines"} title={fr ? "Un studio, plusieurs regards" : "One studio, many perspectives"}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map(([h, p], i) => (
            <div key={h} className="glass gold-border reveal rounded-3xl p-7" data-delay={String((i % 3) * 0.08)}>
              <p className="text-xs tracking-[0.35em] text-purple-soft">0{i + 1}</p>
              <h3 className="mt-3 font-display text-xl text-pearl">{h}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker={d.nav.photography} title={fr ? "Archive photographique" : "Photographic archive"}>
        <Gallery photos={portfolio.photos} lang={lang} />
        <div className="glass gold-border reveal mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg text-pearl">{fr ? "Portfolio photo d'origine" : "Original photo portfolio"}</p>
            <p className="mt-1 text-sm text-mist">{t(portfolio.profile.selfEmployed, lang)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={portfolio.profile.links.carrd} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-void hover:bg-gold-bright">Carrd ↗</Link>
            <Link href={portfolio.profile.links.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-purple-soft/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-pearl hover:border-gold hover:text-gold">Instagram ↗</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
