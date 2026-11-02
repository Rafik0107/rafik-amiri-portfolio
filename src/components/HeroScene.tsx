"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const [positions, colors] = useMemo(() => {
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3);
    const gold = new THREE.Color("#ffd700"), purple = new THREE.Color("#7b2fff"), soft = new THREE.Color("#a978ff");
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 14, th = Math.random() * Math.PI * 2;
      p.set([Math.cos(th) * r, (Math.random() - 0.5) * 12, Math.sin(th) * r - 4], i * 3);
      const col = Math.random() < 0.55 ? gold : Math.random() < 0.5 ? purple : soft;
      c.set([col.r, col.g, col.b], i * 3);
    }
    return [p, c];
  }, [count]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.03;
    ref.current.rotation.x += (pointer.y * 0.15 - ref.current.rotation.x) * 0.03;
    ref.current.position.x += (pointer.x * 0.8 - ref.current.position.x) * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function EnergyRings() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.x += (pointer.y * 0.4 + 0.25 - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (pointer.x * 0.6 - group.current.rotation.y) * 0.05;
      group.current.rotation.z = t * 0.12;
    }
    if (inner.current) inner.current.rotation.set(t * 0.5, t * 0.3, 0);
  });
  return (
    <group ref={group} position={[0, 0, -2.5]}>
      <mesh>
        <torusGeometry args={[2.6, 0.06, 32, 256]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} emissive="#4a3300" emissiveIntensity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.1, 0.015, 16, 256]} />
        <meshBasicMaterial color="#a978ff" transparent opacity={0.85} />
      </mesh>
      <mesh ref={inner} scale={0.55}>
        <torusKnotGeometry args={[1.05, 0.05, 220, 16, 2, 5]} />
        <meshStandardMaterial color="#7b2fff" metalness={0.6} roughness={0.25} emissive="#7b2fff" emissiveIntensity={0.55} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (host.current) io.observe(host.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={host} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.75]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 8, 22]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[-5, 3, 4]} intensity={80} color="#7b2fff" />
        <pointLight position={[5, -2, 5]} intensity={60} color="#ffd700" />
        <EnergyRings />
        <Particles count={mobile ? 900 : 2600} />
      </Canvas>
    </div>
  );
}
