import Link from "next/link";
import { PageHeader, Section, Timeline } from "@/components/ui";
import { portfolio, t, type Entry } from "@/lib/content";
import { getDict, NAV_KEYS } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/about", getDict(lang).nav.about, t(portfolio.profile.bio, lang).slice(0, 160));
}

export default async function About({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const kinds = { edu: fr ? "Formation" : "Education", intern: fr ? "Stage" : "Internship" };

  // The complete journey: dated items in reverse chronological order.
  const dated: (Entry & { kind: string })[] = [
    ...portfolio.education.map((e) => ({ ...e, kind: kinds.edu })),
    ...portfolio.internships.filter((e) => e.start).map((e) => ({ ...e, kind: kinds.intern })),
  ].sort((a, b) => (b.start ?? 0) - (a.start ?? 0));

  return (
    <>
      <PageHeader kicker={`III · ${d.portals.all.name}`} title={fr ? "Le voyage de Raiden" : "Raiden's journey"} intro={t(portfolio.profile.bio, lang)} />

      <Section kicker={fr ? "Identité" : "Identity"} title={fr ? "Ingénieur. Développeur. Photographe. Designer. Entrepreneur." : "Engineer. Developer. Photographer. Designer. Entrepreneur."}>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [fr ? "Ingénierie" : "Engineering", t(portfolio.profile.headline, lang)],
            [fr ? "Création" : "Creation", t(portfolio.profile.creativeBio, lang)],
            [fr ? "Entrepreneuriat" : "Entrepreneurship", t(portfolio.profile.selfEmployed, lang)],
          ].map(([h, p], i) => (
            <div key={h} className="glass gold-border reveal rounded-3xl p-7" data-delay={String(i * 0.08)}>
              <h3 className="font-display text-xl text-gold">{h}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker={d.sections.timeline} title={d.sections.timelineSub}>
        <Timeline entries={dated} lang={lang} />
        <p className="reveal mt-2 max-w-2xl text-sm text-mist">
          {fr
            ? "En parallèle des études : un parcours professionnel en restauration, commerce, production industrielle, photographie freelance et e-commerce."
            : "Alongside studies: professional experience in hospitality, retail, industrial production, freelance photography and e-commerce."}{" "}
          <Link className="text-gold hover:underline" href={`/${lang}/experience`}>{d.nav.experience} →</Link>
        </p>
      </Section>

      <Section kicker={fr ? "Explorer" : "Explore"} title={fr ? "Toutes les salles du musée" : "Every room of the museum"}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {NAV_KEYS.filter((k) => k !== "about").map((k, i) => (
            <Link key={k} href={`/${lang}/${k}`} className="glass gold-border reveal group rounded-2xl p-5 transition hover:-translate-y-1" data-delay={String((i % 5) * 0.05)}>
              <span className="text-xs text-purple-soft">0{i + 1}</span>
              <span className="mt-2 block font-display text-lg text-pearl transition group-hover:text-gold">{d.nav[k]}</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
