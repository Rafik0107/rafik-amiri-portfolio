"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict } from "@/lib/i18n";

export default function NotFound() {
  const lang = usePathname()?.startsWith("/en") ? "en" : "fr";
  const d = getDict(lang);
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <div className="relative grid h-48 w-48 place-items-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0" aria-hidden><circle cx="100" cy="100" r="92" fill="none" stroke="#d4af37" strokeWidth="1" /><path d="M8 100H192M100 8V192" stroke="rgba(169,120,255,0.4)" strokeDasharray="3 6" /></svg>
        <span className="font-display text-6xl"><span className="gold-text">404</span></span>
      </div>
      <h1 className="mt-10 font-display text-3xl text-pearl md:text-4xl">{d.notFound.title}</h1>
      <Link href={`/${lang}`} className="btn btn-gold mt-8">{d.notFound.back}</Link>
    </section>
  );
}
