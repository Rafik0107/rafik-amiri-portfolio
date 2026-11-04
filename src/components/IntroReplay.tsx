"use client";

import type { Lang } from "@/lib/content";

export default function IntroReplay({ lang }: { lang: Lang }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("raiden:intro-replay"))}
      className="intro-replay absolute bottom-6 right-4 z-10 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-mist transition-colors hover:text-gold motion-reduce:hidden md:right-8"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.4h-2.4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
      {lang === "fr" ? "Revoir l’intro" : "Replay intro"}
    </button>
  );
}
