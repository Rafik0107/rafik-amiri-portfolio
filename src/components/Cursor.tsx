"use client";

import { useEffect, useRef } from "react";

// Gold dot + purple halo that lags behind; only on fine pointers without reduced motion.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.body.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, hx = x, hy = y, raf = 0, big = false;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const el = e.target as HTMLElement | null;
      big = !!el?.closest("a,button,[data-cursor]");
    };
    const tick = () => {
      hx += (x - hx) * 0.16; hy += (y - hy) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      if (halo.current) halo.current.style.transform = `translate3d(${hx}px,${hy}px,0) translate(-50%,-50%) scale(${big ? 1.8 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.body.classList.remove("has-cursor"); };
  }, []);

  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 z-[95] hidden [@media(hover:hover)_and_(pointer:fine)]:block motion-reduce:!hidden">
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_10px_#ffd700]" />
      <div ref={halo} className="absolute left-0 top-0 h-9 w-9 rounded-full border border-purple-soft/70 transition-[width,height] duration-300 mix-blend-screen shadow-[0_0_24px_rgba(123,47,255,0.45)]" />
    </div>
  );
}
