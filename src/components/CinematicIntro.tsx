"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";

/*
 * Opening titles (~7.5 s), played once per session on the home page.
 * One continuous line: a gold stroke draws a robotic arm; its end effector (exact two-link IK)
 * traces a violet trajectory that closes into a photo frame; photographs and graphic marks
 * appear inside; the frame then opens up around the name, which finally glides (FLIP)
 * into the real hero title. html.intro-on is set by an inline script before paint (see layout).
 */

type Cfg = { W: number; H: number; bx: number; by: number; L1: number; L2: number; fx: number; fy: number; fw: number; fh: number; path: string; photos: number; zoom: number };
const WIDE: Cfg = { W: 1600, H: 900, bx: 600, by: 840, L1: 420, L2: 380, fx: 760, fy: 260, fw: 360, fh: 280, path: "M380,430 C430,200 640,170 760,260", photos: 3, zoom: 3.3 };
const TALL: Cfg = { W: 900, H: 1500, bx: 260, by: 1150, L1: 420, L2: 360, fx: 240, fy: 520, fw: 420, fh: 300, path: "M150,760 C110,560 150,440 240,520", photos: 2, zoom: 1.95 };

const PHOTOS = ["image02", "27bc6f7e", "dccf57c7"].map((k) => `/_next/image?url=${encodeURIComponent(`/photos/${k}.jpg`)}&w=1080&q=70`);
const NAME = "RAFIK AMIRI";
const KEY = "raiden-intro-seen";

function ik(c: Cfg, px: number, py: number) {
  const x = px - c.bx, y = c.by - py;
  const c2 = Math.min(1, Math.max(-1, (x * x + y * y - c.L1 ** 2 - c.L2 ** 2) / (2 * c.L1 * c.L2)));
  const q2 = Math.acos(c2);
  const q1 = Math.atan2(y, x) - Math.atan2(c.L2 * Math.sin(q2), c.L1 + c.L2 * Math.cos(q2));
  return { a1: (-q1 * 180) / Math.PI, a2: (-(q1 + q2) * 180) / Math.PI, ex: c.bx + c.L1 * Math.cos(q1), ey: c.by - c.L1 * Math.sin(q1) };
}

const capsule = (L: number, r: number) => `M0,${-r} H${L} A${r},${r} 0 0 1 ${L},${r} H0 A${r},${r} 0 0 1 0,${-r} Z`;

export default function CinematicIntro({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  const [state, setState] = useState<"pending" | "play" | "off">("pending");
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const ending = useRef(false);

  const finish = useCallback((fast: boolean) => {
    if (ending.current) return;
    ending.current = true;
    tl.current?.kill();
    const html = document.documentElement;
    const el = root.current;
    const done = () => { html.classList.remove("intro-on"); setState("off"); };
    if (!el) return done();
    const title = el.querySelector<HTMLElement>(".intro-name");
    const target = document.getElementById("hero-name-main");
    const out = gsap.timeline({ onComplete: done });
    if (!fast && title && target) {
      // FLIP: the intro name glides into the hero title, so there is no cut.
      const a = title.getBoundingClientRect(), b = target.getBoundingClientRect();
      out.to(el.querySelectorAll(".intro-stage, .intro-sub, .intro-skip"), { opacity: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(el.querySelector(".intro-bg"), { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0.1)
        .to(title, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width, duration: 0.85, ease: "power3.inOut" }, 0);
    } else {
      out.to(el, { opacity: 0, duration: 0.35, ease: "power2.out" });
    }
  }, []);

  // Decide on mount: play only if the pre-paint script armed it.
  useEffect(() => {
    if (document.documentElement.classList.contains("intro-on")) {
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      document.documentElement.classList.add("intro-played");
      setCfg(window.innerWidth < window.innerHeight ? TALL : WIDE);
      setState("play");
    } else setState("off");
  }, []);

  useEffect(() => {
    const onReplay = () => replay();
    window.addEventListener("raiden:intro-replay", onReplay);
    return () => window.removeEventListener("raiden:intro-replay", onReplay);
  });

  const replay = () => {
    window.scrollTo({ top: 0 });
    ending.current = false;
    document.documentElement.classList.add("intro-on", "intro-played");
    setCfg(window.innerWidth < window.innerHeight ? TALL : WIDE);
    setState("play");
  };

  // Any real interaction gives immediate access to the site.
  useEffect(() => {
    if (state !== "play") return;
    const onKey = (e: KeyboardEvent) => { if (["Escape", "Enter", " ", "ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); finish(true); } };
    const onNav = () => finish(true);
    const header = document.querySelector("header");
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onNav, { passive: true });
    window.addEventListener("touchmove", onNav, { passive: true });
    header?.addEventListener("pointerdown", onNav);
    header?.addEventListener("focusin", onNav);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onNav);
      window.removeEventListener("touchmove", onNav);
      header?.removeEventListener("pointerdown", onNav);
      header?.removeEventListener("focusin", onNav);
    };
  }, [state, finish]);

  // The sequence itself.
  useEffect(() => {
    if (state !== "play" || !cfg || !root.current) return;
    const c = cfg, el = root.current;
    const q = <T extends Element = SVGElement>(s: string) => el.querySelector(s) as T;
    PHOTOS.forEach((src) => { const i = new window.Image(); i.src = src; });

    const trace = q<SVGPathElement>(".intro-trace");
    const total = trace.getTotalLength();
    const curveLen = (q<SVGPathElement>(".intro-curve")).getTotalLength();
    const fc = curveLen / total;
    const l1 = q(".intro-l1"), l2 = q(".intro-l2"), elbow = q(".intro-elbow"), tool = q(".intro-tool");
    const curve = q(".intro-curve"), frame = q(".intro-frame");
    const pose = (p: number) => {
      const pt = trace.getPointAtLength(p * total), a = ik(c, pt.x, pt.y);
      l1.setAttribute("transform", `translate(${c.bx},${c.by}) rotate(${a.a1})`);
      l2.setAttribute("transform", `translate(${a.ex},${a.ey}) rotate(${a.a2})`);
      elbow.setAttribute("transform", `translate(${a.ex},${a.ey})`);
      tool.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${a.a2})`);
      curve.setAttribute("stroke-dashoffset", String(1 - Math.min(1, p / fc)));
      frame.setAttribute("stroke-dashoffset", String(1 - Math.max(0, (p - fc) / (1 - fc))));
    };
    pose(0);

    const stage = q(".intro-zoom");
    const cx = c.fx + c.fw / 2, cy = c.fy + c.fh / 2;
    const cam = { k: 0 };
    const camera = () => {
      const s = 1 + (c.zoom - 1) * cam.k;
      const tx = c.W / 2 + (cx - c.W / 2) * (1 - cam.k), ty = c.H / 2 + (cy - c.H / 2) * (1 - cam.k);
      stage.setAttribute("transform", `translate(${tx},${ty}) scale(${s}) translate(${-cx},${-cy})`);
    };
    camera();
    const prog = { p: 0 };
    const photos = el.querySelectorAll(".intro-photo-clip");
    const letters = el.querySelectorAll(".intro-name span");

    const t = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: () => finish(false) });
    tl.current = t;
    if (process.env.NODE_ENV !== "production") (window as unknown as { __intro: gsap.core.Timeline }).__intro = t;
    t.fromTo(el.querySelector(".intro-scene"), { scale: 1.06 }, { scale: 1, duration: 7.2, ease: "none" }, 0)
      // 1 — Power on: a gold line, then the arm's contours, lit by a violet glow.
      .to(q(".intro-violet"), { opacity: 1, duration: 1.8 }, 0)
      .to(q(".intro-ground"), { attr: { "stroke-dashoffset": 0 }, duration: 0.7, ease: "power3.inOut" }, 0.1)
      .to(el.querySelectorAll(".ink"), { attr: { "stroke-dashoffset": 0 }, duration: 0.9, stagger: 0.12, ease: "power2.inOut" }, 0.45)
      .to(el.querySelectorAll(".intro-core"), { opacity: 1, scale: 1, duration: 0.35, stagger: 0.1, transformOrigin: "50% 50%" }, 1.55)
      .to(el.querySelectorAll(".intro-fill"), { opacity: 1, duration: 0.6 }, 1.5)
      // 2 — Engineering becomes image: the trajectory closes into a frame.
      .to(prog, { p: 1, duration: 1.75, ease: "power1.inOut", onUpdate: () => pose(prog.p) }, 1.9)
      .to(el.querySelectorAll(".intro-marks"), { opacity: 1, duration: 0.5, stagger: 0.08 }, 3.25);
    photos.forEach((ph, i) => {
      if (i >= c.photos) return;
      const vertical = i % 2 === 1;
      t.fromTo(ph, { attr: vertical ? { height: 0, width: c.fw } : { width: 0, height: c.fh } }, { attr: vertical ? { height: c.fh } : { width: c.fw }, duration: 0.5, ease: "power3.inOut" }, 3.55 + i * 0.45);
    });
    t.to(el.querySelectorAll(".intro-design"), { opacity: 1, duration: 0.45, stagger: 0.07 }, 3.9)
      .to(el.querySelectorAll(".intro-design-draw"), { attr: { "stroke-dashoffset": 0 }, duration: 0.7, stagger: 0.08, ease: "power2.inOut" }, 3.9)
      // 3 — The frame opens around the name.
      .to(q(".intro-arm"), { opacity: 0, duration: 0.8 }, 4.95)
      .to(el.querySelectorAll(".intro-design, .intro-marks, .intro-curve"), { opacity: 0, duration: 0.5 }, 4.95)
      .to(q(".intro-dim"), { opacity: 0.82, duration: 1 }, 5.0)
      .to(cam, { k: 1, duration: 1.3, ease: "power3.inOut", onUpdate: camera }, 4.95)
      .to(q(".intro-key"), { opacity: 1, duration: 1.2 }, 5.3)
      .fromTo(letters, { opacity: 0, y: 26, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.05, ease: "power3.out" }, 5.45)
      .fromTo(letters, { backgroundPosition: "100% 50%" }, { backgroundPosition: "0% 50%", duration: 1.4, ease: "power1.inOut" }, 5.9)
      .fromTo(q(".intro-raiden"), { opacity: 0, letterSpacing: "1.1em" }, { opacity: 1, letterSpacing: "0.55em", duration: 1, ease: "power3.out" }, 6.0)
      .fromTo(q(".intro-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, 6.15)
      .fromTo(q(".intro-sig"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, 6.4)
      .to({}, { duration: 0.4 }, 6.8);
    return () => { t.kill(); };
  }, [state, cfg, finish]);

  if (state === "off") return null;

  const c = cfg;
  const sig = fr ? "Automatique · Robotique · Photographie · Design" : "Control · Robotics · Photography · Design";
  return (
    <div ref={root} className="intro fixed inset-0 z-[45] overflow-hidden" role="presentation">
      <div className="intro-bg absolute inset-0 bg-void" />
      <div className="intro-stage absolute inset-0">
        <div className="intro-scene absolute inset-0">
          <div className="intro-violet pointer-events-none absolute left-[18%] top-[30%] h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(123,47,255,0.32), rgba(123,47,255,0) 62%)" }} />
          <div className="intro-key pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.16), rgba(212,175,55,0) 65%)" }} />
          {c && (
            <svg viewBox={`0 0 ${c.W} ${c.H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="ig-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd700" /><stop offset=".5" stopColor="#d4af37" /><stop offset="1" stopColor="#a8841c" /></linearGradient>
                <linearGradient id="ig-metal" x1="0" y1="-1" x2="0" y2="1"><stop offset="0" stopColor="#1d1830" /><stop offset=".5" stopColor="#0c0b12" /><stop offset="1" stopColor="#15112a" /></linearGradient>
                {PHOTOS.map((_, i) => <clipPath key={i} id={`ic${i}`}><rect className="intro-photo-clip" x={c.fx} y={c.fy} width="0" height="0" /></clipPath>)}
              </defs>
              <g className="intro-zoom">
                {/* Photographs inside the frame */}
                {PHOTOS.slice(0, c.photos).map((src, i) => (
                  <image key={src} href={src} x={c.fx} y={c.fy} width={c.fw} height={c.fh} preserveAspectRatio="xMidYMid slice" clipPath={`url(#ic${i})`} />
                ))}
                <rect className="intro-dim" x={c.fx} y={c.fy} width={c.fw} height={c.fh} fill="#050508" opacity="0" />
                {/* Graphic-design layer: thirds, geometry, palette */}
                <g className="intro-design" opacity="0" stroke="rgba(255,215,0,0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke">
                  <path d={`M${c.fx + c.fw / 3},${c.fy}V${c.fy + c.fh}M${c.fx + (2 * c.fw) / 3},${c.fy}V${c.fy + c.fh}M${c.fx},${c.fy + c.fh / 3}H${c.fx + c.fw}M${c.fx},${c.fy + (2 * c.fh) / 3}H${c.fx + c.fw}`} vectorEffect="non-scaling-stroke" opacity=".5" />
                </g>
                <circle className="intro-design intro-design-draw" cx={c.fx + c.fw} cy={c.fy + c.fh * 0.28} r={c.fh * 0.3} fill="none" stroke="#7b2fff" strokeWidth="1.4" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0" vectorEffect="non-scaling-stroke" />
                <rect className="intro-design intro-design-draw" x={c.fx - c.fh * 0.16} y={c.fy + c.fh * 0.62} width={c.fh * 0.3} height={c.fh * 0.3} fill="none" stroke="#d4af37" strokeWidth="1.2" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0" vectorEffect="non-scaling-stroke" />
                {c === WIDE && (
                  <g className="intro-design" opacity="0" fontFamily="var(--font-manrope), sans-serif" fontSize="11" letterSpacing="2.5">
                    {[["#050508", "#050508"], ["#7b2fff", "#7B2FFF"], ["#d4af37", "#D4AF37"]].map(([f, l], i) => (
                      <g key={l} transform={`translate(${c.fx + i * 92},${c.fy + c.fh + 26})`}>
                        <rect width="20" height="20" fill={f} stroke="rgba(212,175,55,0.6)" strokeWidth="1" />
                        <text x="28" y="14" fill="#b3b1c0">{l}</text>
                      </g>
                    ))}
                    <text x={c.fx} y={c.fy - 22} fill="#d4af37" letterSpacing="5">RAIDEN · CREATIVE STUDIO</text>
                    <text x={c.fx + c.fw} y={c.fy - 22} fill="#a978ff" textAnchor="end">FIG. 01</text>
                  </g>
                )}
                {/* Crop marks */}
                <path className="intro-marks" opacity="0" fill="none" stroke="#d4af37" strokeWidth="1" vectorEffect="non-scaling-stroke"
                  d={[[c.fx, c.fy, -1, -1], [c.fx + c.fw, c.fy, 1, -1], [c.fx, c.fy + c.fh, -1, 1], [c.fx + c.fw, c.fy + c.fh, 1, 1]].map(([x, y, sx, sy]) => `M${x + sx * 8},${y}h${sx * 18}M${x},${y + sy * 8}v${sy * 18}`).join("")} />
                {/* Trajectory (violet) and frame (gold): the same continuous line */}
                <path className="intro-curve" d={c.path} fill="none" stroke="#a978ff" strokeWidth="1.6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" vectorEffect="non-scaling-stroke" />
                <path className="intro-frame" d={`M${c.fx},${c.fy}H${c.fx + c.fw}V${c.fy + c.fh}H${c.fx}Z`} fill="none" stroke="url(#ig-gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" vectorEffect="non-scaling-stroke" />
                <path className="intro-trace" d={`${c.path} H${c.fx + c.fw} V${c.fy + c.fh} H${c.fx} Z`} fill="none" stroke="none" />
                {/* The arm */}
                <g className="intro-arm">
                  <path className="intro-ground" d={`M${c.bx - 260},${c.by + 34}H${c.bx + 260}`} stroke="url(#ig-gold)" strokeWidth="1.2" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                  <path className="ink" d={`M${c.bx - 70},${c.by + 34} L${c.bx - 46},${c.by - 6} H${c.bx + 46} L${c.bx + 70},${c.by + 34}`} fill="none" stroke="url(#ig-gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                  <g className="intro-l1">
                    <path className="intro-fill" d={capsule(c.L1, 26)} fill="url(#ig-metal)" opacity="0" />
                    <path className="ink" d={capsule(c.L1, 26)} fill="none" stroke="url(#ig-gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                    <path className="ink" d={`M40,0H${c.L1 - 40}`} stroke="#a978ff" strokeWidth="1" strokeDasharray="1" strokeDashoffset="1" pathLength={1} opacity=".7" />
                  </g>
                  <g className="intro-l2">
                    <path className="intro-fill" d={capsule(c.L2, 20)} fill="url(#ig-metal)" opacity="0" />
                    <path className="ink" d={capsule(c.L2, 20)} fill="none" stroke="url(#ig-gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                    <path className="ink" d={`M34,0H${c.L2 - 34}`} stroke="#a978ff" strokeWidth="1" strokeDasharray="1" strokeDashoffset="1" pathLength={1} opacity=".7" />
                  </g>
                  <g transform={`translate(${c.bx},${c.by})`}>
                    <circle className="ink" r="36" fill="#0c0b12" stroke="url(#ig-gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                    <circle className="intro-core" r="11" fill="#d4af37" opacity="0" />
                  </g>
                  <g className="intro-elbow">
                    <circle className="ink" r="30" fill="#0c0b12" stroke="url(#ig-gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                    <circle className="intro-core" r="9" fill="#d4af37" opacity="0" />
                  </g>
                  <g className="intro-tool">
                    <path className="ink" d="M-14,-16 L6,-16 L22,-6 M-14,16 L6,16 L22,6" fill="none" stroke="url(#ig-gold)" strokeWidth="1.6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                    <circle className="intro-core" r="4" fill="#ffd700" opacity="0" />
                  </g>
                </g>
              </g>
            </svg>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p className="intro-name font-display text-[clamp(2.5rem,9.5vw,8rem)] font-semibold leading-none tracking-[0.06em]" aria-hidden>
          {NAME.split("").map((ch, i) => <span key={i} className="intro-letter inline-block opacity-0">{ch === " " ? " " : ch}</span>)}
        </p>
        <div className="intro-sub mt-4 flex flex-col items-center">
          <p className="intro-raiden font-display text-[clamp(1rem,2.6vw,1.9rem)] tracking-[0.55em] text-purple-soft opacity-0">RAIDEN</p>
          <span className="intro-rule mt-5 block h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent" style={{ transform: "scaleX(0)" }} />
          <p className="intro-sig mt-5 text-[0.68rem] uppercase tracking-[0.32em] text-pearl/85 opacity-0 md:text-xs">{sig}</p>
        </div>
      </div>

      <button type="button" onClick={() => finish(true)} className="intro-skip absolute bottom-6 right-4 z-10 rounded-full border border-pearl/20 bg-void/40 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-pearl/80 backdrop-blur transition-colors hover:border-gold hover:text-gold md:bottom-8 md:right-8">
        {fr ? "Passer l’intro" : "Skip intro"} <span aria-hidden>→</span>
      </button>
    </div>
  );
}
