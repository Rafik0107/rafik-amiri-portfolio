import Link from "next/link";
import { portfolio, t, type Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import ArmHero from "./ArmHero";

export default function Hero({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const p = portfolio.profile;
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[640px] rounded-full bg-purple/15 blur-[130px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="kicker rise">Paris · Sorbonne Université</p>
          <h1 className="rise mt-5 font-display text-[clamp(2.6rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-[0.04em]" style={{ animationDelay: "0.05s" }}>
            <span className="gold-text">Rafik Amiri</span>{" "}
            <span className="block text-[0.42em] font-normal tracking-[0.3em] text-purple-soft md:inline md:align-middle">(Raiden)</span>
          </h1>
          <p className="rise mt-6 font-display text-[clamp(1.25rem,2.6vw,1.9rem)] leading-snug text-pearl" style={{ animationDelay: "0.12s" }}>{t(p.subtitle, lang)}</p>
          <p className="rise mt-4 max-w-xl text-base leading-relaxed text-mist" style={{ animationDelay: "0.18s" }}>{t(p.headline, lang)}</p>
          <p className="rise mt-3 flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-gold" style={{ animationDelay: "0.22s" }}>
            <span className="h-px w-8 bg-gold/70" />{t(p.creativeRole, lang)}
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.28s" }}>
            <Link href={`/${lang}/projects`} className="btn btn-gold">{d.cta.projects}</Link>
            <a href={t(p.cvPdf, lang)} download className="btn btn-ghost">{d.cta.cv} ↓</a>
            <Link href={`/${lang}/contact`} className="btn btn-ghost">{d.cta.contact}</Link>
          </div>
        </div>
        <div className="rise glass gold-border relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] p-3" style={{ animationDelay: "0.1s" }}>
          <ArmHero lang={lang} />
        </div>
      </div>
    </section>
  );
}
