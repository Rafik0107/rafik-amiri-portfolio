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
        <div className="portal-ring absolute inset-0 rounded-full" />
        <span className="font-display text-6xl"><span className="gold-text">404</span></span>
      </div>
      <h1 className="mt-10 font-display text-3xl text-pearl md:text-4xl">{d.notFound.title}</h1>
      <Link href={`/${lang}`} className="mt-8 rounded-full bg-gold px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-void hover:bg-gold-bright">{d.notFound.back}</Link>
    </section>
  );
}
