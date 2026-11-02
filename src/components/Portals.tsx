"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";

function Portal({ href, index, name, items, glyph, hue }: { href: string; index: string; name: string; items: string[]; glyph: string; hue: string }) {
  const card = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    card.current.style.transform = `perspective(1100px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(0)`;
    card.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    card.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => { if (card.current) card.current.style.transform = ""; };

  return (
    <Link
      ref={card}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor
      className="group glass gold-border reveal relative flex min-h-[460px] flex-col overflow-hidden rounded-[2rem] p-8 transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_30px_90px_-20px_rgba(123,47,255,0.65)] motion-reduce:!transform-none"
      style={{ transformStyle: "preserve-3d" }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(500px circle at var(--mx,50%) var(--my,50%), ${hue}, transparent 45%)` }}
      />
      <div className="relative mx-auto my-4 grid h-44 w-44 place-items-center" style={{ transform: "translateZ(60px)" }}>
        <div className="portal-ring absolute inset-0 rounded-full" />
        <div className="portal-ring absolute inset-5 rounded-full opacity-60 [animation-direction:reverse] [animation-duration:11s]" />
        <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(123,47,255,0.8),rgba(5,5,8,0)_70%)] blur-md transition-transform duration-700 group-hover:scale-125" />
        <span className="relative font-display text-4xl text-gold-bright drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]">{glyph}</span>
      </div>
      <p className="relative text-xs tracking-[0.4em] text-purple-soft">{index}</p>
      <h3 className="relative mt-2 font-display text-2xl tracking-wide text-pearl">{name}</h3>
      <ul className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-mist">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" />{it}</li>
        ))}
      </ul>
      <span className="relative mt-auto pt-8 text-xs uppercase tracking-[0.35em] text-gold transition group-hover:tracking-[0.5em]">→</span>
    </Link>
  );
}

export default function Portals({ lang }: { lang: Lang }) {
  const p = getDict(lang).portals;
  return (
    <section id="portals" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-28 md:px-8">
      <p className="kicker reveal text-center">{p.kicker}</p>
      <h2 className="reveal mt-4 text-center font-display text-4xl md:text-6xl"><span className="gold-text">{p.title}</span></h2>
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Portal href={`/${lang}/engineering`} index="I" name={p.eng.name} items={p.eng.items} glyph="⚙" hue="rgba(123,47,255,0.35)" />
        <Portal href={`/${lang}/creative`} index="II" name={p.cre.name} items={p.cre.items} glyph="◈" hue="rgba(212,175,55,0.28)" />
        <Portal href={`/${lang}/about`} index="III" name={p.all.name} items={p.all.items} glyph="✦" hue="rgba(169,120,255,0.3)" />
      </div>
    </section>
  );
}
