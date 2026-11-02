"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
import Magnetic from "./Magnetic";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero({ lang, subtitle, headline, cta, cta2 }: { lang: Lang; subtitle: string; headline: string; cta: string; cta2: string }) {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ok = false;
    try { ok = !!document.createElement("canvas").getContext("webgl2"); } catch {}
    setWebgl(ok && !reduced);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,47,255,0.28),transparent_60%)]" />
      {webgl && <HeroScene />}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />
      <div className="relative z-10 px-4 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(5,5,8,0.78)_0%,rgba(5,5,8,0.4)_45%,transparent_70%)]" />
        <p className="kicker reveal">Paris · Sorbonne Université</p>
        <h1 className="reveal mt-6 font-display text-[clamp(2.6rem,10vw,8rem)] font-semibold leading-[0.95] tracking-[0.06em]" data-delay="0.1">
          <span className="gold-text">RAFIK AMIRI</span>
        </h1>
        <p className="reveal purple-glow mt-4 font-display text-[clamp(1rem,2.6vw,1.6rem)] tracking-[0.6em]" data-delay="0.2">( RAIDEN )</p>
        <p className="reveal mt-6 text-[clamp(0.65rem,1.5vw,0.85rem)] uppercase tracking-[0.5em] text-pearl/85" data-delay="0.3">{subtitle}</p>
        <p className="reveal mx-auto mt-8 max-w-xl text-sm leading-relaxed text-mist md:text-base" data-delay="0.4">{headline}</p>
        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4" data-delay="0.5">
          <Magnetic>
            <Link href={`/${lang}#portals`} className="pointer-events-auto inline-block rounded-full bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-void shadow-[0_0_40px_rgba(212,175,55,0.35)] transition hover:bg-gold-bright">
              {cta}
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href={`/${lang}/contact`} className="pointer-events-auto inline-block rounded-full border border-purple-soft/60 px-7 py-3.5 text-xs uppercase tracking-[0.3em] text-pearl transition hover:border-gold hover:text-gold">
              {cta2}
            </Link>
          </Magnetic>
        </div>
      </div>
      <a href="#portals" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.5em] text-mist" aria-label="Scroll">
        <span className="mx-auto mb-2 block h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </a>
    </section>
  );
}
