"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";

const KEY = "raiden-intro-v1";
const NAME = "RAFIK AMIRI";

export function replayIntro() {
  window.dispatchEvent(new Event("raiden:replay-intro"));
}

// Decided before hydration by the inline script below, so returning visitors never see a flash.
const bootScript = `try{if(!localStorage.getItem("${KEY}"))document.documentElement.dataset.intro="play"}catch(e){document.documentElement.dataset.intro="play"}`;

export default function Intro({ lang, skipLabel, subtitle }: { lang: Lang; skipLabel: string; subtitle: string }) {
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (document.documentElement.dataset.intro === "play") setPlaying(true);
    const onReplay = () => {
      window.scrollTo({ top: 0 });
      document.documentElement.dataset.intro = "play";
      setPlaying(true);
      setRun((r) => r + 1);
    };
    window.addEventListener("raiden:replay-intro", onReplay);
    return () => window.removeEventListener("raiden:replay-intro", onReplay);
  }, []);

  const end = useCallback(() => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    delete document.documentElement.dataset.intro;
    document.body.style.overflow = "";
    setPlaying(false);
    window.dispatchEvent(new Event("raiden:intro-done"));
  }, []);

  useEffect(() => {
    if (!playing) return;
    let disposed = false;
    let cleanup = () => {};
    document.body.style.overflow = "hidden";
    finishRef.current = end;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed || !root.current) return;
      const q = gsap.utils.selector(root.current);
      const tl = gsap.timeline({ onComplete: end });
      finishRef.current = () => tl.progress(1);

      if (reduced) {
        tl.set(q(".intro-letter"), { opacity: 1, y: 0, filter: "blur(0px)" })
          .fromTo(q(".intro-stack"), { opacity: 0 }, { opacity: 1, duration: 0.6 })
          .set(q(".intro-alias, .intro-sub"), { opacity: 1, y: 0 })
          .to(root.current, { opacity: 0, duration: 0.6, delay: 1.2 });
        cleanup = () => tl.kill();
        return;
      }

      const THREE = await import("three");
      if (disposed || !canvasHost.current) return;
      const w = window.innerWidth, h = window.innerHeight;
      const mobile = w < 768;
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0x050508, 1);
      canvasHost.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050508, 0.035);
      const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
      camera.position.set(0, 0, 16);

      // Golden / purple particle field with a shader-driven burst.
      const count = mobile ? 1800 : 4200;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const seed = new Float32Array(count);
      const gold = new THREE.Color("#ffd700"), gold2 = new THREE.Color("#d4af37"), purple = new THREE.Color("#7b2fff");
      for (let i = 0; i < count; i++) {
        const r = 2.5 + Math.pow(Math.random(), 0.6) * 18;
        const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph)], i * 3);
        const c = Math.random() < 0.68 ? (Math.random() < 0.5 ? gold : gold2) : purple;
        col.set([c.r, c.g, c.b], i * 3);
        seed[i] = Math.random();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
      const pMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uBurst: { value: 0 }, uPr: { value: renderer.getPixelRatio() } },
        vertexShader: `
          attribute float seed; varying vec3 vColor; varying float vSeed;
          uniform float uTime, uBurst, uPr;
          void main(){
            vColor = color; vSeed = seed;
            vec3 p = position;
            float a = uTime * (0.05 + seed * 0.08);
            p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
            p += normalize(position + 0.001) * uBurst * (6.0 + seed * 26.0);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (1.2 + seed * 2.6) * uPr * (22.0 / -mv.z) * (1.0 + uBurst * 1.5);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vColor; varying float vSeed; uniform float uOpacity, uTime;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            float tw = 0.65 + 0.35 * sin(uTime * 2.0 + vSeed * 40.0);
            gl_FragColor = vec4(vColor * 1.4, a * uOpacity * tw);
          }`,
      });
      const points = new THREE.Points(geo, pMat);
      scene.add(points);

      // Purple energy core: a glowing billboard.
      const coreTex = (() => {
        const c = document.createElement("canvas"); c.width = c.height = 256;
        const g = c.getContext("2d")!; const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.12, "rgba(190,140,255,0.95)");
        grd.addColorStop(0.4, "rgba(123,47,255,0.45)"); grd.addColorStop(1, "rgba(123,47,255,0)");
        g.fillStyle = grd; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
      })();
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
      core.scale.setScalar(0.01);
      scene.add(core);

      // Energy rings: a gold metallic torus with purple-lit inner ring.
      const ringGroup = new THREE.Group();
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.22, emissive: 0x3a2a00, emissiveIntensity: 0.6 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.07, 24, 220), goldMat);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.018, 12, 220), new THREE.MeshBasicMaterial({ color: 0xa978ff, transparent: true, opacity: 0.9 }));
      const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.012, 12, 220), new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.7 }));
      ring2.rotation.x = 0.35; ring3.rotation.y = 0.5;
      ringGroup.add(ring, ring2, ring3);
      ringGroup.scale.setScalar(0.001);
      scene.add(ringGroup);
      scene.add(new THREE.AmbientLight(0x221133, 1));
      const pl1 = new THREE.PointLight(0x7b2fff, 60, 30); pl1.position.set(-4, 2, 4); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xffd700, 40, 30); pl2.position.set(4, -2, 5); scene.add(pl2);

      const mouse = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
      const onResize = () => { const W = window.innerWidth, H = window.innerHeight; renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix(); };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("resize", onResize);

      let raf = 0; const clock = new THREE.Clock();
      const loop = () => {
        const tt = clock.getElapsedTime();
        pMat.uniforms.uTime.value = tt;
        ringGroup.rotation.z = tt * 0.35; ring2.rotation.y = tt * 0.6; ring3.rotation.x = tt * -0.5;
        ringGroup.rotation.x = mouse.y * 0.5; ringGroup.rotation.y = mouse.x * 0.5;
        camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();

      const U = pMat.uniforms;
      tl.to(U.uOpacity, { value: 1, duration: 1.6, ease: "power2.out" }, 0.2)
        .to(core.material, { opacity: 1, duration: 1.2 }, 1.0)
        .to(core.scale, { x: 3.2, y: 3.2, z: 3.2, duration: 1.6, ease: "expo.out" }, 1.0)
        .to(ringGroup.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: "back.out(1.6)" }, 1.9)
        .to(camera.position, { z: 7.5, duration: 2.6, ease: "power3.inOut" }, 2.0)
        .fromTo(q(".intro-letter"), { opacity: 0, y: 46, rotateX: -80, filter: "blur(10px)" }, { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.06, ease: "power3.out" }, 3.1)
        .fromTo(q(".intro-alias"), { opacity: 0, scale: 0.8, letterSpacing: "0.1em" }, { opacity: 1, scale: 1, letterSpacing: "0.6em", duration: 1.0, ease: "power2.out" }, 4.1)
        .fromTo(q(".intro-sub"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 4.7)
        .to(U.uBurst, { value: 1, duration: 1.4, ease: "expo.out" }, 6.2)
        .to(ringGroup.scale, { x: 4, y: 4, z: 4, duration: 1.2, ease: "expo.in" }, 6.0)
        .to(core.scale, { x: 14, y: 14, z: 14, duration: 0.9, ease: "expo.in" }, 6.0)
        .fromTo(q(".intro-flash"), { opacity: 0 }, { opacity: 0.85, duration: 0.25, yoyo: true, repeat: 1 }, 6.55)
        .to(q(".intro-stack"), { opacity: 0, scale: 1.08, filter: "blur(8px)", duration: 0.6 }, 6.4)
        .to(root.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 7.0);

      cleanup = () => {
        tl.kill(); cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", onResize);
        geo.dispose(); pMat.dispose(); coreTex.dispose(); goldMat.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, [playing, run, end]);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <style>{`html:not([data-intro="play"]) #raiden-intro{display:none}`}</style>
      {
        <div
          id="raiden-intro"
          ref={root}
          key={run}
          role="dialog"
          aria-label={lang === "fr" ? "Introduction animée" : "Animated introduction"}
          className="fixed inset-0 z-[90] overflow-hidden bg-void"
          style={{ opacity: 1 }}
        >
          <div ref={canvasHost} className="absolute inset-0" aria-hidden />
          <div className="intro-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#fff_0%,#ffd700_25%,#7b2fff_60%,transparent_80%)] opacity-0" />
          <div className="intro-stack pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center" style={{ perspective: 800 }}>
            <h1 className="font-display text-[clamp(2.2rem,9vw,7.5rem)] font-semibold leading-none tracking-[0.08em]">
              {NAME.split("").map((ch, i) => (
                <span key={i} className="intro-letter gold-text inline-block opacity-0" style={{ whiteSpace: "pre" }}>{ch}</span>
              ))}
            </h1>
            <p className="intro-alias purple-glow mt-5 [text-shadow:0_0_6px_#050508,0_0_22px_#7b2fff,0_0_44px_#7b2fff] font-display text-[clamp(1rem,3vw,1.8rem)] opacity-0">( RAIDEN )</p>
            <p className="intro-sub mt-6 text-[clamp(0.62rem,1.6vw,0.85rem)] uppercase tracking-[0.5em] text-pearl/80 opacity-0">{subtitle}</p>
          </div>
          {playing && (
            <button
              onClick={() => finishRef.current()}
              className="absolute bottom-6 right-6 rounded-full border border-gold/50 px-5 py-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-void"
            >
              {skipLabel}
            </button>
          )}
        </div>
      }
    </>
  );
}
