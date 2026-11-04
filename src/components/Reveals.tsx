"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Shared animation primitives, driven by class names so pages stay declarative:
 *  .reveal          section/element appears (data-delay in seconds)
 *  .reveal-img      image uncovered by a clip-path wipe
 *  .draw            SVG strokes traced when scrolled into view
 *  [data-progress]  a line that fills while its container scrolls (timelines)
 *  [data-parallax]  gentle vertical parallax (yPercent)
 */
export default function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const showAll = () => root.classList.remove("js");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("reveals-ready");
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        root.classList.add("reveals-ready");
        ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
            gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: Number(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          });
          gsap.utils.toArray<HTMLElement>(".reveal-img").forEach((el) => {
            gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          });
          gsap.utils.toArray<SVGGeometryElement>(".draw").forEach((el) => {
            const len = el.getTotalLength?.() || 600;
            gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: Number(el.dataset.duration || 1.8), ease: "power2.inOut", delay: Number(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: "top 92%", once: true } });
          });
          gsap.utils.toArray<HTMLElement>("[data-progress]").forEach((el) => {
            gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: true } });
          });
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            gsap.to(el, { yPercent: Number(el.dataset.parallax) || -10, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
          });
        });
        ScrollTrigger.refresh();
      } catch {
        showAll();
      }
    })();
    return () => { cancelled = true; ctx?.revert(); };
  }, [pathname]);
  return null;
}
