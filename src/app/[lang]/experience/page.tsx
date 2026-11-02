import { PageHeader, Section, Timeline, Chip } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  return pageMeta(lang, "/experience", getDict(lang).nav.experience, lang === "fr" ? "Stages chez Wikeys, Sonatrach et SARL Céramique Boumerdès ; Subway Paris, restauration, commerce, photographie freelance et e-commerce." : "Internships at Wikeys, Sonatrach and SARL Céramique Boumerdès; Subway Paris, hospitality, retail, freelance photography and e-commerce.");
}

export default async function Experience({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  return (
    <>
      <PageHeader
        kicker={d.nav.experience}
        title={fr ? "Expérience complète" : "Complete experience"}
        intro={fr ? "L'industrie, la tech, la restauration, le commerce et l'entrepreneuriat : chaque expérience a forgé des compétences concrètes." : "Industry, tech, hospitality, retail and entrepreneurship: every role built concrete skills."}
      />
      <Section kicker={d.nav.engineering} title={d.sections.internships}>
        <Timeline entries={portfolio.internships} lang={lang} />
      </Section>
      <Section kicker={fr ? "Emploi · freelance · entrepreneuriat" : "Employment · freelance · entrepreneurship"} title={d.sections.jobs}>
        <div className="grid gap-5 md:grid-cols-2">
          {portfolio.jobs.map((j, i) => (
            <article key={j.id} className="glass gold-border reveal rounded-3xl p-7" data-delay={String((i % 2) * 0.08)}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl text-pearl">{t(j.org, lang)}</h3>
                {t(j.period, lang) && <span className="text-xs uppercase tracking-[0.25em] text-gold">{t(j.period, lang)}</span>}
              </div>
              <p className="mt-1 text-sm text-purple-soft">{t(j.title, lang)}{j.place ? ` · ${j.place}` : ""}</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{t(j.details, lang)}</p>
              {j.skills && <div className="mt-4 flex flex-wrap gap-2">{j.skills.map((s) => <Chip key={s} tone="mist">{s}</Chip>)}</div>}
            </article>
          ))}
        </div>
        <p className="reveal mt-6 text-sm text-mist">{t(portfolio.profile.selfEmployed, lang)}</p>
      </Section>
      <Section kicker={fr ? "Ce que chaque expérience apporte" : "What each role brings"} title={d.sections.transferable}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.transferableSkills.map((s, i) => (
            <div key={s.en} className="reveal rounded-2xl border border-gold/15 bg-ink/60 p-5" data-delay={String((i % 4) * 0.05)}>
              <p className="font-display text-lg text-gold">{s[lang]}</p>
              <p className="mt-2 text-xs leading-relaxed text-mist">{t(s.from, lang)}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
