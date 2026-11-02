"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
import { getDict, NAV_KEYS } from "@/lib/i18n";

export default function Nav({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rest = pathname.replace(/^\/(fr|en)/, "");
  const other: Lang = lang === "fr" ? "en" : "fr";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (k: string) => rest === `/${k}` || rest.startsWith(`/${k}/`);

  return (
    <header className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-gold/10 bg-void/75 backdrop-blur-xl" : ""}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8" aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}>
        <Link href={`/${lang}`} className="group flex items-center gap-3" aria-label={d.nav.home}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 font-display text-sm text-gold transition group-hover:shadow-[0_0_24px_rgba(123,47,255,0.8)]">R</span>
          <span className="hidden font-display text-sm tracking-[0.3em] sm:block">
            <span className="gold-text">RAFIK AMIRI</span> <span className="text-purple-soft">· RAIDEN</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_KEYS.map((k) => (
            <li key={k}>
              <Link
                href={`/${lang}/${k}`}
                aria-current={isActive(k) ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-[0.78rem] tracking-wide transition hover:text-gold ${isActive(k) ? "text-gold" : "text-pearl/75"}`}
              >
                {d.nav[k]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href={`/${other}${rest}`}
            hrefLang={other}
            className="rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-gold transition hover:bg-gold hover:text-void"
            aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
            onClick={() => { try { localStorage.setItem("raiden-lang", other); } catch {} }}
          >
            <span className={lang === "fr" ? "text-pearl" : "opacity-50"}>FR</span>
            <span className="mx-1 opacity-40">/</span>
            <span className={lang === "en" ? "text-pearl" : "opacity-50"}>EN</span>
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-pearl/15 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? d.close : d.menu}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-pearl transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-5 bg-pearl transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 overflow-y-auto bg-void/95 backdrop-blur-xl transition-all duration-500 xl:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <ul className="mx-auto flex max-w-md flex-col gap-1 px-6 py-8">
          {NAV_KEYS.map((k, i) => (
            <li key={k} style={{ transitionDelay: open ? `${i * 35}ms` : "0ms" }} className={`transition duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
              <Link href={`/${lang}/${k}`} className={`flex items-baseline justify-between border-b border-pearl/10 py-4 font-display text-2xl ${isActive(k) ? "text-gold" : "text-pearl"}`}>
                {d.nav[k]}
                <span className="text-xs text-purple-soft">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
