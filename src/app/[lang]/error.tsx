"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const fr = !usePathname()?.startsWith("/en");
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <p className="kicker">{fr ? "Perturbation énergétique" : "Energy disturbance"}</p>
      <h1 className="mt-4 font-display text-3xl md:text-5xl"><span className="gold-text">{fr ? "Une erreur est survenue" : "Something went wrong"}</span></h1>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-void">{fr ? "Réessayer" : "Try again"}</button>
        <Link href={fr ? "/fr" : "/en"} className="rounded-full border border-gold/50 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold">{fr ? "Accueil" : "Home"}</Link>
      </div>
    </section>
  );
}
