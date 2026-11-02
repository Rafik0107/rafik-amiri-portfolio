"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang, Photo } from "@/lib/content";
import { getDict } from "@/lib/i18n";

function Tile({ photo, title, onOpen, priority }: { photo: Photo; title: string; onOpen: () => void; priority: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  };
  return (
    <button
      ref={ref}
      onClick={onOpen}
      onPointerMove={move}
      onPointerLeave={() => ref.current && (ref.current.style.transform = "")}
      className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-gold/15 transition-[transform,box-shadow] duration-300 hover:border-gold/60 hover:shadow-[0_25px_70px_-20px_rgba(123,47,255,0.75)] motion-reduce:!transform-none"
      aria-label={title}
    >
      <Image
        src={photo.src}
        alt={title}
        width={photo.w}
        height={photo.h}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className="h-auto w-full transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left font-display text-sm tracking-wider text-pearl opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {title}
        <span className="mt-1 block h-px w-10 bg-gold" />
      </span>
    </button>
  );
}

export default function Gallery({ photos, lang, limit }: { photos: Photo[]; lang: Lang; limit?: number }) {
  const d = getDict(lang);
  const cats = useMemo(() => ["all", ...Array.from(new Set(photos.map((p) => p.category)))], [photos]);
  const [cat, setCat] = useState("all");
  const [idx, setIdx] = useState<number | null>(null);
  const shown = useMemo(() => {
    const f = photos.filter((p) => cat === "all" || p.category === cat);
    return limit ? f.slice(0, limit) : f;
  }, [photos, cat, limit]);
  const title = (p: Photo) => (lang === "fr" ? p.title : p.titleEn);
  const catLabel = (c: string) => (d.photoCats as Record<string, string>)[c] ?? c;

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((n: number) => setIdx((i) => (i === null ? i : (i + n + shown.length) % shown.length)), [shown.length]);
  useEffect(() => {
    if (idx === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [idx, close, step]);

  const current = idx !== null ? shown[idx] : null;

  return (
    <div>
      {!limit && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={lang === "fr" ? "Catégories" : "Categories"}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full border px-4 py-2 text-xs tracking-wide transition ${cat === c ? "border-gold bg-gold text-void" : "border-pearl/15 text-pearl/75 hover:border-gold/60 hover:text-gold"}`}
            >
              {catLabel(c)}
            </button>
          ))}
        </div>
      )}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {shown.map((p, i) => <Tile key={p.src} photo={p} title={title(p)} onOpen={() => setIdx(i)} priority={i < 3} />)}
      </div>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={title(current)} className="fixed inset-0 z-[85] flex items-center justify-center bg-void/95 backdrop-blur-xl" onClick={close}>
          <figure className="relative flex max-h-[88vh] max-w-[92vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Image
              key={current.src}
              src={current.src}
              alt={title(current)}
              width={current.w}
              height={current.h}
              sizes="92vw"
              className="max-h-[78vh] w-auto animate-[fadein_.5s_ease] rounded-xl object-contain shadow-[0_0_80px_rgba(123,47,255,0.45)]"
            />
            <figcaption className="mt-4 text-center font-display tracking-widest text-gold">
              {title(current)} <span className="ml-3 text-xs text-mist">{(idx ?? 0) + 1} / {shown.length} · © Rafik Amiri</span>
            </figcaption>
          </figure>
          <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-void" aria-label={lang === "fr" ? "Précédente" : "Previous"}>←</button>
          <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-void" aria-label={lang === "fr" ? "Suivante" : "Next"}>→</button>
          <button onClick={close} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-pearl/20 text-2xl text-pearl hover:border-gold hover:text-gold" aria-label={d.close}>×</button>
          <style>{`@keyframes fadein{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </div>
  );
}
