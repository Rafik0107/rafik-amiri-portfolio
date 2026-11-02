"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";

type Group = { group: string; items: string[] };
const COLORS: Record<string, string> = { programming: "#ffd700", engineering: "#d4af37", ai: "#a978ff", web: "#7b2fff", creative: "#f5f5f7" };

// A rotating 3D sphere of skills, projected to SVG. Drag or move the mouse to steer it.
export default function SkillConstellation({ groups, lang }: { groups: Group[]; lang: Lang }) {
  const d = getDict(lang);
  const nodes = useMemo(() => {
    const all = groups.flatMap((g) => g.items.map((name) => ({ name, group: g.group })));
    const n = all.length;
    return all.map((s, i) => {
      // Fibonacci sphere for an even spread.
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), phi = i * Math.PI * (3 - Math.sqrt(5));
      return { ...s, x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
    });
  }, [groups]);

  const [rot, setRot] = useState({ a: 0.4, b: -0.2 });
  const [active, setActive] = useState<string | null>(null);
  const target = useRef({ va: 0.0025, vb: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      if (!drag.current) setRot((r) => ({ a: r.a + target.current.va, b: r.b + target.current.vb }));
      target.current.vb *= 0.95;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  const R = 230;
  const proj = nodes.map((n) => {
    const ca = Math.cos(rot.a), sa = Math.sin(rot.a), cb = Math.cos(rot.b), sb = Math.sin(rot.b);
    const x1 = n.x * ca - n.z * sa, z1 = n.x * sa + n.z * ca;
    const y2 = n.y * cb - z1 * sb, z2 = n.y * sb + z1 * cb;
    const s = 1 / (1.9 - z2 * 0.6);
    return { ...n, px: x1 * R * s * 1.85, py: y2 * R * s * 1.7, depth: z2, s };
  }).sort((a, b) => a.depth - b.depth);

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setRot((r) => ({ a: r.a + dx * 0.008, b: r.b + dy * 0.008 }));
    target.current.va = Math.sign(dx || 1) * 0.0025;
  };
  const onUp = () => { drag.current = null; };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <svg
        ref={svg}
        viewBox="-360 -320 720 640"
        className="w-full touch-none select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="img"
        aria-label={lang === "fr" ? "Constellation interactive des compétences" : "Interactive skill constellation"}
      >
        <defs>
          <radialGradient id="core"><stop offset="0" stopColor="#7b2fff" stopOpacity="0.55" /><stop offset="1" stopColor="#7b2fff" stopOpacity="0" /></radialGradient>
        </defs>
        <circle r={240} fill="url(#core)" />
        {proj.map((n, i) => {
          const near = proj.slice(i + 1).filter((m) => m.group === n.group).slice(0, 2);
          return near.map((m) => (
            <line key={n.name + m.name} x1={n.px} y1={n.py} x2={m.px} y2={m.py} stroke={COLORS[n.group]} strokeOpacity={active && active !== n.group ? 0.04 : 0.18 + (n.depth + 1) * 0.08} />
          ));
        })}
        {proj.map((n) => {
          const dim = active && active !== n.group;
          const o = dim ? 0.15 : 0.35 + (n.depth + 1) * 0.33;
          return (
            <g key={n.name} transform={`translate(${n.px},${n.py})`} opacity={o} onPointerEnter={() => setActive(n.group)} onPointerLeave={() => setActive(null)} style={{ cursor: "pointer" }}>
              <circle r={4 + n.s * 6} fill={COLORS[n.group]} style={{ filter: `drop-shadow(0 0 ${6 * n.s}px ${COLORS[n.group]})` }} />
              <text y={-10 - n.s * 4} textAnchor="middle" fill="#f5f5f7" fontSize={10 + n.s * 6} fontFamily="var(--font-manrope)">{n.name}</text>
            </g>
          );
        })}
      </svg>
      <ul className="space-y-3 self-center">
        {groups.map((g) => (
          <li key={g.group}>
            <button
              onPointerEnter={() => setActive(g.group)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(g.group)}
              onBlur={() => setActive(null)}
              className={`glass w-full rounded-2xl p-4 text-left transition ${active === g.group ? "border-gold/60" : ""}`}
            >
              <span className="flex items-center gap-3 font-display text-sm tracking-wider text-pearl">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[g.group], boxShadow: `0 0 10px ${COLORS[g.group]}` }} />
                {(d.skillGroups as Record<string, string>)[g.group] ?? g.group}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-mist">{g.items.join(" · ")}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
