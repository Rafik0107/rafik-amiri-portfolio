import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
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
  const portrait = portfolio.photos.find((p) => p.src.endsWith("image01.jpg"))!;
  const steps = [
    ...portfolio.education.map((e) => ({ when: t(e.period, lang), what: t(e.title, lang), where: t(e.org, lang) })),
    ...portfolio.internships.filter((i) => i.start).map((e) => ({ when: t(e.period, lang), what: `${fr ? "Stage" : "Internship"} — ${t(e.org, lang)}`, where: e.place })),
  ].sort((a, b) => parseInt(b.when) - parseInt(a.when));

  return (
    <>
      <section className="px-4 pb-6 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <figure className="relative">
            <div className="rise-img relative aspect-[424/623] overflow-hidden rounded-[1.5rem] border border-gold/20">
              <Image src={portrait.src} alt={portrait.alt} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28" aria-hidden>
              <path d="M2 98H98V2" fill="none" stroke="#d4af37" strokeWidth="0.8" className="draw" data-delay="0.6" />
            </svg>
          </figure>
          <div className="self-center">
            <p className="kicker rise">{d.nav.about}</p>
            <h1 className="rise mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight" style={{ animationDelay: "0.06s" }}><span className="gold-text">{fr ? "Ingénierie et image, une même exigence" : "Engineering and image, one standard"}</span></h1>
            <p className="rise mt-6 text-base leading-relaxed text-pearl/90 md:text-lg" style={{ animationDelay: "0.12s" }}>{t(portfolio.profile.bio, lang)}</p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.18s" }}>
              <Link href={`/${lang}/engineering`} className="btn btn-gold">{d.doors.eng.name}</Link>
              <Link href={`/${lang}/creative`} className="btn btn-ghost">{d.doors.cre.name}</Link>
            </div>
          </div>
        </div>
      </section>

      <Section kicker={fr ? "Repères" : "Milestones"} title={fr ? "Parcours en bref" : "Path at a glance"}>
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-gold/15 bg-gold/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.what} className="reveal bg-ink p-6 last:sm:col-span-2 lg:last:col-span-2" data-delay={String((i % 4) * 0.05)}>
              <p className="text-xs uppercase tracking-[0.24em] text-gold">{s.when}</p>
              <p className="mt-2 font-display text-base leading-snug text-pearl">{s.what}</p>
              <p className="mt-1 text-xs text-mist">{s.where}</p>
            </li>
          ))}
        </ol>
        <p className="reveal mt-6 text-sm text-mist">
          {fr ? "En parallèle : restauration, commerce, production industrielle, photographie freelance et e-commerce." : "Alongside: hospitality, retail, industrial production, freelance photography and e-commerce."}{" "}
          <Link className="text-gold hover:underline" href={`/${lang}/experience`}>{d.nav.experience} →</Link>
        </p>
      </Section>
    </>
  );
}
