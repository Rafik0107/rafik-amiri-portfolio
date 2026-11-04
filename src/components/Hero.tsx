import Image from "next/image";
import Link from "next/link";
import { portfolio, t, type Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import ArmHero from "./ArmHero";
import IntroReplay from "./IntroReplay";

export default function Hero({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const fr = lang === "fr";
  const p = portfolio.profile;
  const photo = portfolio.photos.find((x) => x.src.endsWith("27bc6f7e.jpg"))!;
  const sig = fr ? "Automatique · Robotique · Photographie · Design" : "Control · Robotics · Photography · Design";
  const status = fr ? "Étudiant en Master 1 Automatique et Robotique à Sorbonne Université" : "Master 1 student in Automation and Robotics at Sorbonne Université";

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-24 md:px-8">
      {/* Depth: drafting grid, violet fill light, gold key light */}
      <div className="blueprint hero-grid pointer-events-none absolute inset-0" />
      <div className="hero-drift pointer-events-none absolute -left-40 top-0 h-[560px] w-[720px] rounded-full bg-purple/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-10%] top-[20%] h-[420px] w-[520px] rounded-full bg-gold/[0.07] blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="kicker rise">Paris · Sorbonne Université</p>
          <h1 className="hero-name rise mt-5 font-display font-semibold leading-none">
            <span id="hero-name-main" className="gold-text inline-block whitespace-nowrap text-[clamp(2.1rem,5vw,4.6rem)] tracking-[0.06em]">RAFIK AMIRI</span>
            <span className="mt-3 block text-[clamp(1rem,2.2vw,1.6rem)] font-normal tracking-[0.55em] text-purple-soft">RAIDEN</span>
          </h1>
          <p className="rise mt-6 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-gold md:text-xs" style={{ animationDelay: "0.08s" }}>
            <span className="h-px w-8 shrink-0 bg-gold/70" />{sig}
          </p>
          <p className="rise mt-6 max-w-xl font-display text-[clamp(1.1rem,2vw,1.45rem)] leading-snug text-pearl" style={{ animationDelay: "0.14s" }}>{status}</p>
          <p className="rise mt-3 max-w-xl text-sm leading-relaxed text-mist md:text-base" style={{ animationDelay: "0.2s" }}>{t(p.headline, lang)}</p>

          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.26s" }}>
            <Link href={`/${lang}/projects`} className="btn btn-gold">{d.cta.projects}</Link>
            <a href={t(p.cvPdf, lang)} download className="btn btn-ghost">{d.cta.cv} ↓</a>
            <Link href={`/${lang}/contact`} className="btn btn-ghost">{d.cta.contact}</Link>
          </div>

          <div className="rise mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/15 bg-gold/10" style={{ animationDelay: "0.32s" }}>
            {([["engineering", "01", d.doors.eng.name], ["creative", "02", d.doors.cre.name]] as const).map(([href, n, name]) => (
              <Link key={href} href={`/${lang}/${href}`} className="group bg-void/90 px-4 py-4 transition-colors hover:bg-panel">
                <span className="text-[0.65rem] tracking-[0.3em] text-purple-soft">{n}</span>
                <span className="mt-1 flex items-center justify-between gap-2 font-display text-sm text-pearl transition-colors group-hover:text-gold md:text-base">
                  {name}<span className="text-gold transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Engineering visual with a photographic counterpoint */}
        <div className="rise relative mx-auto w-full max-w-[560px] pb-10 pl-6 sm:pl-12" style={{ animationDelay: "0.12s" }}>
          <div className="glass gold-border relative overflow-hidden rounded-[1.75rem] p-3">
            <ArmHero lang={lang} />
          </div>
          <figure className="absolute bottom-0 left-0 w-[34%] max-w-[170px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-gold/40 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
              <Image src={photo.src} alt={photo.alt} fill sizes="170px" className="object-cover" />
              <svg viewBox="0 0 30 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                <path d="M10 0V40M20 0V40M0 13.3H30M0 26.6H30" stroke="rgba(255,215,0,0.35)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <figcaption className="mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-mist">{fr ? "Photographie" : "Photography"} · Raiden</figcaption>
          </figure>
        </div>
      </div>

      <IntroReplay lang={lang} />
    </section>
  );
}
