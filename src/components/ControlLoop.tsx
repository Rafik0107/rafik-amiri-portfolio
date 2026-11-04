"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";

// Standard negative-feedback loop: r → Σ → C(s) → G(s) → y, measured by H(s) back into Σ.
const SIGNAL = "M20,90 H470 V170 H90 V104";

export default function ControlLoop({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const [motion, setMotion] = useState(false);
  useEffect(() => setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  const fr = lang === "fr";
  const txt = { fill: "#b3b1c0", fontSize: 12, fontFamily: "var(--font-manrope)" } as const;
  const block = (x: number, y: number, w: number, label: string, sub: string) => (
    <g>
      <rect x={x} y={y} width={w} height="40" rx="6" fill="#0c0b12" stroke="#d4af37" />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fill="#ffd700" fontSize="13" fontFamily="var(--font-cinzel)">{label}</text>
      <text x={x + w / 2} y={y + 32} textAnchor="middle" {...txt} fontSize="10">{sub}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 600 215" className="h-auto w-full" role="img" aria-label={fr ? "Boucle de régulation : consigne, correcteur, procédé, capteur et rétroaction" : "Control loop: setpoint, controller, plant, sensor and feedback"}>
      <path d={SIGNAL} fill="none" stroke="#a978ff" strokeWidth="1.6" className="draw" data-duration="2.2" />
      <path d="M470,90 H575" fill="none" stroke="#a978ff" strokeWidth="1.6" className="draw" data-delay="1" />
      <path d="M570,85 L578,90 L570,95" fill="none" stroke="#a978ff" />
      <circle cx="470" cy="90" r="3" fill="#a978ff" />
      {motion && [0, 1.4, 2.8].map((b) => (
        <circle key={b} r="3.5" fill="#ffd700" style={{ filter: "drop-shadow(0 0 4px #ffd700)" }}>
          <animateMotion dur="4.2s" begin={`${b}s`} repeatCount="indefinite" path={SIGNAL} />
        </circle>
      ))}
      <circle cx="90" cy="90" r="14" fill="#0c0b12" stroke="#d4af37" />
      <text x="90" y="95" textAnchor="middle" fill="#ffd700" fontSize="15">Σ</text>
      <text x="66" y="82" {...txt}>+</text>
      <text x="96" y="122" {...txt}>−</text>
      {block(140, 70, 100, "C(s)", fr ? "correcteur PID" : "PID controller")}
      {block(300, 70, 110, "G(s)", fr ? "procédé" : "plant")}
      {block(230, 150, 110, "H(s)", fr ? "capteur" : "sensor")}
      {!compact && (
        <>
          <text x="20" y="80" {...txt}>r(t)</text>
          <text x="108" y="80" {...txt}>e(t)</text>
          <text x="254" y="80" {...txt}>u(t)</text>
          <text x="540" y="80" {...txt}>y(t)</text>
          <text x="120" y="190" {...txt}>{fr ? "mesure" : "measurement"}</text>
        </>
      )}
    </svg>
  );
}
