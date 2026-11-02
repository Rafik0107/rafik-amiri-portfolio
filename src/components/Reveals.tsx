"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Scroll-triggered reveals for every `.reveal` element, re-run on each route change.
export default function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        els.forEach((el) => {
          gsap.to(el, {
            opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, { yPercent: Number(el.dataset.parallax) || -12, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
        });
      });
      ScrollTrigger.refresh();
    })();
    return () => { cancelled = true; ctx?.revert(); };
  }, [pathname]);
  return null;
}
