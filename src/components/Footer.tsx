"use client";

import Link from "next/link";
import { portfolio, type Lang } from "@/lib/content";
import { getDict, NAV_KEYS } from "@/lib/i18n";
import { replayIntro } from "./Intro";

export default function Footer({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const { links } = portfolio.profile;
  return (
    <footer className="no-print relative mt-24 border-t border-gold/10 bg-ink/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-xl"><span className="gold-text">RAFIK AMIRI</span></p>
          <p className="purple-glow mt-1 font-display text-sm tracking-[0.4em]">( RAIDEN )</p>
          <p className="mt-4 max-w-xs text-sm text-mist">Paris, France · Sorbonne Université</p>
          <button onClick={replayIntro} className="mt-6 rounded-full border border-purple/50 px-4 py-2 text-xs uppercase tracking-[0.25em] text-purple-soft transition hover:bg-purple hover:text-pearl">
            ↺ {d.replay}
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {NAV_KEYS.map((k) => (
            <li key={k}><Link className="text-pearl/70 transition hover:text-gold" href={`/${lang}/${k}`}>{d.nav[k]}</Link></li>
          ))}
        </ul>
        <ul className="space-y-2 text-sm">
          <li><a className="text-pearl/70 hover:text-gold" href={links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
          <li><a className="text-pearl/70 hover:text-gold" href={links.carrd} target="_blank" rel="noopener noreferrer">{lang === "fr" ? "Portfolio photo (Carrd)" : "Photo portfolio (Carrd)"} ↗</a></li>
          <li><a className="text-pearl/70 hover:text-gold" href={links.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></li>
          <li><a className="text-pearl/70 hover:text-gold" href={`mailto:${links.email}`}>{links.email}</a></li>
        </ul>
      </div>
      <p className="border-t border-pearl/5 py-6 text-center text-xs text-mist">
        © {new Date().getFullYear()} Rafik Amiri — {d.footer.rights} {d.footer.built}
      </p>
    </footer>
  );
}
