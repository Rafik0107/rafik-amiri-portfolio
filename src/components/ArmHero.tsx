"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "@/lib/content";

// Two-link planar arm (elbow-up) following a figure-eight with exact inverse kinematics.
const BASE = { x: 150, y: 360 };
const L1 = 170, L2 = 150;
const target = (t: number) => ({ x: 300 + 110 * Math.cos(t), y: 205 + 60 * Math.sin(2 * t) });

function ik(px: number, py: number) {
  const x = px - BASE.x, y = BASE.y - py; // math frame: y up
  const c2 = Math.min(1, Math.max(-1, (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2)));
  const q2 = -Math.acos(c2); // elbow-up
  const q1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
  return { q1, q2, ex: BASE.x + L1 * Math.cos(q1), ey: BASE.y - L1 * Math.sin(q1) };
}

const PATH = Array.from({ length: 121 }, (_, i) => target((i / 120) * Math.PI * 2))
  .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

// Unit step response of a 2nd-order system, zeta = 0.5, wn = 1 (illustration).
const STEP = (() => {
  const z = 0.5, wd = Math.sqrt(1 - z * z);
  return Array.from({ length: 61 }, (_, i) => {
    const t = (i / 60) * 12;
    const y = 1 - Math.exp(-z * t) * (Math.cos(wd * t) + (z / wd) * Math.sin(wd * t));
    return `${i ? "L" : "M"}${(i * 3).toFixed(1)},${(60 - y * 42).toFixed(1)}`;
  }).join(" ");
})();

export default function ArmHero({ lang }: { lang: Lang }) {
  const svg = useRef<SVGSVGElement>(null);
  const link1 = useRef<SVGLineElement>(null), link2 = useRef<SVGLineElement>(null);
  const elbow = useRef<SVGCircleElement>(null), tool = useRef<SVGGElement>(null);
  const trail = useRef<SVGPolylineElement>(null);
  const q1t = useRef<SVGTSpanElement>(null), q2t = useRef<SVGTSpanElement>(null);

  useEffect(() => {
    const pts: string[] = [];
    const pose = (t: number) => {
      const p = target(t), a = ik(p.x, p.y);
      link1.current?.setAttribute("x2", a.ex.toFixed(1)); link1.current?.setAttribute("y2", a.ey.toFixed(1));
      link2.current?.setAttribute("x1", a.ex.toFixed(1)); link2.current?.setAttribute("y1", a.ey.toFixed(1));
      link2.current?.setAttribute("x2", p.x.toFixed(1)); link2.current?.setAttribute("y2", p.y.toFixed(1));
      elbow.current?.setAttribute("cx", a.ex.toFixed(1)); elbow.current?.setAttribute("cy", a.ey.toFixed(1));
      tool.current?.setAttribute("transform", `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`);
      if (q1t.current) q1t.current.textContent = `${((a.q1 * 180) / Math.PI).toFixed(1)}°`;
      if (q2t.current) q2t.current.textContent = `${((a.q2 * 180) / Math.PI).toFixed(1)}°`;
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      if (pts.length > 70) pts.shift();
      trail.current?.setAttribute("points", pts.join(" "));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { pose(0.9); return; }
    let raf = 0, visible = true, t = 0, last = performance.now();
    const loop = (now: number) => {
      t += Math.min(0.05, (now - last) / 1000) * 0.55; last = now;
      if (visible) pose(t);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) { last = performance.now(); if (!raf) raf = requestAnimationFrame(loop); }
      else { cancelAnimationFrame(raf); raf = 0; }
    });
    if (svg.current) io.observe(svg.current);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const fr = lang === "fr";
  return (
    <svg ref={svg} viewBox="0 0 520 460" className="h-auto w-full" role="img" aria-label={fr ? "Bras robotisé à deux articulations suivant une trajectoire, calculée par cinématique inverse" : "Two-joint robotic arm following a trajectory computed by inverse kinematics"}>
      <defs>
        <linearGradient id="arm-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0a8" /><stop offset=".45" stopColor="#d4af37" /><stop offset="1" stopColor="#a8841c" /></linearGradient>
        <pattern id="arm-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(212,175,55,0.07)" /></pattern>
      </defs>
      <rect width="520" height="460" fill="url(#arm-grid)" />
      {/* workspace boundary (max reach) */}
      <path d={`M${BASE.x - (L1 + L2)},${BASE.y} A${L1 + L2},${L1 + L2} 0 0 1 ${BASE.x + L1 + L2},${BASE.y}`} fill="none" stroke="rgba(169,120,255,0.18)" strokeDasharray="3 6" />
      <line x1="40" y1={BASE.y} x2="500" y2={BASE.y} stroke="rgba(212,175,55,0.25)" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={BASE.x - 60 + i * 10} y1={BASE.y} x2={BASE.x - 68 + i * 10} y2={BASE.y + 10} stroke="rgba(212,175,55,0.25)" />)}

      <path d={PATH} fill="none" stroke="rgba(169,120,255,0.35)" strokeWidth="1.2" strokeDasharray="2 5" className="draw" data-duration="2.4" />
      <polyline ref={trail} fill="none" stroke="#a978ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(123,47,255,0.8))" }} />

      <rect x={BASE.x - 34} y={BASE.y - 8} width="68" height="16" rx="3" fill="#110f1b" stroke="url(#arm-gold)" />
      <line ref={link1} x1={BASE.x} y1={BASE.y} x2={BASE.x} y2={BASE.y - L1} stroke="url(#arm-gold)" strokeWidth="14" strokeLinecap="round" />
      <line ref={link2} x1={BASE.x} y1={BASE.y - L1} x2={BASE.x + L2} y2={BASE.y - L1} stroke="url(#arm-gold)" strokeWidth="10" strokeLinecap="round" />
      <circle cx={BASE.x} cy={BASE.y} r="13" fill="#050508" stroke="#ffd700" strokeWidth="2" />
      <circle ref={elbow} cx={BASE.x} cy={BASE.y - L1} r="10" fill="#050508" stroke="#ffd700" strokeWidth="2" />
      <g ref={tool} transform={`translate(${BASE.x + L2},${BASE.y - L1})`}>
        <circle r="6" fill="#ffd700" />
        <circle r="13" fill="none" stroke="#a978ff" strokeWidth="1.2" />
      </g>

      <text x="40" y="44" fill="#b3b1c0" fontSize="12" fontFamily="var(--font-manrope)" letterSpacing="1">
        <tspan fill="#d4af37">θ₁</tspan> = <tspan ref={q1t}>—</tspan>   <tspan fill="#d4af37" dx="14">θ₂</tspan> = <tspan ref={q2t}>—</tspan>
      </text>
      <text x="40" y="62" fill="#7d7a8c" fontSize="10.5" fontFamily="var(--font-manrope)">{fr ? "cinématique inverse · coude haut · l₁ = 1,13 l₂" : "inverse kinematics · elbow-up · l₁ = 1.13 l₂"}</text>

      <g transform="translate(320,384)">
        <rect x="-10" y="-14" width="200" height="82" rx="8" fill="rgba(5,5,8,0.85)" stroke="rgba(212,175,55,0.25)" />
        <line x1="0" y1="18" x2="180" y2="18" stroke="#d4af37" strokeDasharray="4 4" strokeOpacity=".7" />
        <line x1="0" y1="60" x2="180" y2="60" stroke="rgba(245,245,247,0.25)" />
        <path d={STEP} fill="none" stroke="#a978ff" strokeWidth="1.8" className="draw" data-delay="0.6" data-duration="2" />
        <text x="0" y="-2" fill="#b3b1c0" fontSize="9.5" fontFamily="var(--font-manrope)">{fr ? "Réponse indicielle, 2ᵉ ordre ζ = 0,5 (illustration)" : "Step response, 2nd order ζ = 0.5 (illustration)"}</text>
      </g>
    </svg>
  );
}
