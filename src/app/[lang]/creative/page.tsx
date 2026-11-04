import OppBanner from "@/components/OppBanner";
import Image from "next/image";
import Link from "next/link";
import { Chip, Section } from "@/components/ui";
import { photoCaption, portfolio, t } from "@/lib/content";
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
  const works = portfolio.designWorks;
  const picks = ["6dd65c0b", "dccf57c7", "a4051eb7", "3efb6e55"].map((k) => portfolio.photos.find((p) => p.src.includes(k))!);
  const disciplines = fr
    ? [["Photographie", "Monuments, jardins, portraits : lumière naturelle et étalonnage soigné."], ["Design graphique", "Visuels et identités, notamment pour une activité e-commerce."], ["UI/UX", "Interfaces claires, où la logique d’ingénieur rencontre le sens esthétique."], ["Contenu visuel", "Images et supports pour les réseaux et des projets personnels."]]
    : [["Photography", "Landmarks, gardens, portraits: natural light and careful grading."], ["Graphic design", "Visuals and identities, notably for an e-commerce activity."], ["UI/UX", "Clear interfaces where engineering logic meets aesthetic sense."], ["Visual content", "Images and materials for social media and personal projects."]];

  return (
    <>
      {/* Typographic composition on a layout grid: the studio's signature. */}
      <header className="relative overflow-hidden px-4 pb-10 pt-32 md:px-8 md:pt-40">
        <div className="relative mx-auto max-w-7xl">
          <svg viewBox="0 0 1200 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            {[200, 400, 600, 800, 1000].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="420" stroke="rgba(212,175,55,0.12)" className="draw" />)}
            <line x1="0" y1="140" x2="1200" y2="140" stroke="rgba(212,175,55,0.12)" className="draw" />
            <line x1="0" y1="280" x2="1200" y2="280" stroke="rgba(212,175,55,0.12)" className="draw" />
            <circle cx="1000" cy="140" r="90" fill="none" stroke="#7b2fff" strokeOpacity=".5" className="draw" data-delay="0.4" />
            <rect x="820" y="210" width="150" height="150" fill="none" stroke="#d4af37" strokeOpacity=".5" className="draw" data-delay="0.6" />
          </svg>
          <p className="kicker rise relative">{d.nav.creative} · {t(portfolio.profile.creativeRole, lang)}</p>
          <h1 className="relative mt-4 font-display leading-[0.9]">
            <span className="rise block text-[clamp(3.4rem,13vw,10rem)] tracking-[0.08em]"><span className="gold-text">RAIDEN</span></span>
            <span className="rise block pl-[12%] text-[clamp(1.4rem,4.5vw,3.4rem)] tracking-[0.4em] text-purple-soft" style={{ animationDelay: "0.12s" }}>CREATIVE STUDIO</span>
          </h1>
          <p className="rise relative mt-8 max-w-xl text-base leading-relaxed text-mist md:text-lg" style={{ animationDelay: "0.2s" }}>{t(portfolio.profile.creativeBio, lang)}</p>
        </div>
      </header>

      <Section kicker={fr ? "Disciplines" : "Disciplines"} title={fr ? "Ce que je crée" : "What I create"}>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-gold/15 bg-gold/10 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map(([h, p], i) => (
            <div key={h} className="reveal bg-ink p-7" data-delay={String(i * 0.06)}>
              <p className="text-xs tracking-[0.3em] text-purple-soft">0{i + 1}</p>
              <h3 className="mt-3 font-display text-xl text-pearl">{h}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker={d.nav.photography} title={fr ? "Sélection photographique" : "Photographic selection"}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {picks.map((p, i) => (
            <figure key={p.src} className="reveal" data-delay={String(i * 0.06)}>
              <div className="reveal-img relative aspect-[3/4] overflow-hidden rounded-xl border border-gold/15">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              {photoCaption(p, lang) && <figcaption className="mt-2 text-xs tracking-[0.18em] text-mist">{photoCaption(p, lang)}</figcaption>}
            </figure>
          ))}
        </div>
        <Link href={`/${lang}/photography`} className="btn btn-gold reveal mt-8">{fr ? "Toute la galerie" : "Full gallery"} →</Link>
      </Section>

      <Section kicker={fr ? "Design graphique" : "Graphic design"} title={fr ? "Réalisations graphiques" : "Graphic work"}>
        {works.length > 0 ? (
          <div className="space-y-10">
            {works.map((w) => (
              <article key={w.src} className="reveal grid gap-8 md:grid-cols-[1.2fr_1fr]">
                <div className="reveal-img overflow-hidden rounded-2xl border border-gold/20 bg-ink p-4">
                  <Image src={w.src} alt={t(w.title, lang)} width={w.w} height={w.h} sizes="(max-width: 768px) 100vw, 55vw" className="h-auto w-full" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-pearl">{t(w.title, lang)}</h3>
                  <dl className="mt-5 space-y-4 text-sm">
                    {([[fr ? "Contexte" : "Context", w.context], [fr ? "Objectif" : "Goal", w.goal], [fr ? "Mon rôle" : "My role", w.role], [fr ? "Choix de composition" : "Design choices", w.choices]] as const).filter(([, v]) => t(v, lang)).map(([k, v]) => (
                      <div key={k}><dt className="text-xs uppercase tracking-[0.22em] text-gold">{k}</dt><dd className="mt-1 leading-relaxed text-mist">{t(v, lang)}</dd></div>
                    ))}
                  </dl>
                  {w.tools.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{w.tools.map((x) => <Chip key={x}>{x}</Chip>)}</div>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass gold-border reveal flex flex-col justify-between gap-6 rounded-3xl p-8 md:flex-row md:items-center">
            <p className="max-w-2xl text-sm leading-relaxed text-mist">
              {fr
                ? "Les études de cas graphiques (visuel, contexte, objectif, rôle, outils) sont en préparation : je ne publie ici que des créations réelles et documentées. En attendant, mon travail visuel est visible sur Carrd et Instagram."
                : "Graphic case studies (visual, context, goal, role, tools) are in preparation: only real, documented work will be published here. Meanwhile, my visual work is on Carrd and Instagram."}
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a href={portfolio.profile.links.carrd} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Carrd ↗</a>
              <a href={portfolio.profile.links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Instagram ↗</a>
            </div>
          </div>
        )}
        <p className="reveal mt-6 text-sm text-mist">{t(portfolio.profile.selfEmployed, lang)}</p>
      </Section>
      <OppBanner lang={lang} kind="project" type="freelance" domain="design" text={lang === "fr" ? "Identité visuelle, affiche, contenu pour les réseaux : présentez-moi votre projet graphique." : "Visual identity, poster, social content: tell me about your design project."} />
    </>
  );
}
