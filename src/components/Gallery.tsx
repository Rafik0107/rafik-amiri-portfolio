"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { photoCaption, type Lang, type Photo } from "@/lib/content";
import { getDict } from "@/lib/i18n";

export default function Gallery({ photos, lang, limit }: { photos: Photo[]; lang: Lang; limit?: number }) {
  const d = getDict(lang);
  const fr = lang === "fr";
  const cats = useMemo(() => ["all", ...Array.from(new Set(photos.map((p) => p.category)))], [photos]);
  const [cat, setCat] = useState("all");
  const [idx, setIdx] = useState<number | null>(null);
  // Scroll-reveal only applies to the first render; filtered grids appear with a simple fade.
  const [filtered, setFiltered] = useState(false);
  const touch = useRef<number | null>(null);
  const shown = useMemo(() => {
    const f = photos.filter((p) => cat === "all" || p.category === cat);
    return limit ? f.slice(0, limit) : f;
  }, [photos, cat, limit]);
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
  const neighbours = idx !== null && shown.length > 1 ? [shown[(idx + 1) % shown.length], shown[(idx - 1 + shown.length) % shown.length]] : [];

  return (
    <div>
      {!limit && cats.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={fr ? "Séries" : "Series"}>
          {cats.map((c) => (
            <button key={c} onClick={() => { setCat(c); setFiltered(true); }} aria-pressed={cat === c} className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${cat === c ? "border-gold bg-gold text-void" : "border-pearl/15 text-pearl/75 hover:border-gold/60 hover:text-gold"}`}>
              {catLabel(c)}
            </button>
          ))}
        </div>
      )}
      <div key={cat} className="page-enter columns-1 gap-5 sm:columns-2 lg:columns-3">
        {shown.map((p, i) => {
          const caption = photoCaption(p, lang);
          return (
            <figure key={p.src} className="mb-5 break-inside-avoid">
              <button onClick={() => setIdx(i)} className="group card-lift relative block w-full overflow-hidden rounded-xl border border-gold/15 hover:border-gold/50" aria-label={`${fr ? "Agrandir" : "Enlarge"} : ${p.alt}`}>
                <div className={filtered ? "" : "reveal-img"}>
                  <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={i < 2} className="h-auto w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
                </div>
              </button>
              {caption && <figcaption className="mt-2 flex items-center gap-2 text-xs tracking-[0.18em] text-mist"><span className="h-px w-5 bg-gold/70" />{caption}</figcaption>}
            </figure>
          );
        })}
      </div>

      {current && (
        <div
          role="dialog" aria-modal="true" aria-label={current.alt}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-void/95 backdrop-blur-xl"
          onClick={close}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <figure className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Image key={current.src} src={current.src} alt={current.alt} width={current.w} height={current.h} sizes="92vw" className="page-enter max-h-[80vh] w-auto rounded-lg object-contain shadow-[0_30px_90px_-30px_rgba(123,47,255,0.7)]" />
            <figcaption className="mt-4 text-center text-sm tracking-widest text-gold">
              {photoCaption(current, lang)} <span className="ml-2 text-xs text-mist">{(idx ?? 0) + 1} / {shown.length} · © Rafik Amiri</span>
            </figcaption>
          </figure>
          {neighbours.map((n) => <link key={n.src} rel="prefetch" as="image" href={n.src} />)}
          <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-void" aria-label={fr ? "Précédente" : "Previous"}>←</button>
          <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-void" aria-label={fr ? "Suivante" : "Next"}>→</button>
          <button onClick={close} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-pearl/20 text-2xl text-pearl hover:border-gold hover:text-gold" aria-label={d.close}>×</button>
        </div>
      )}
    </div>
  );
}
