"use client";

import { Canvas, advance, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { brand } from "@/config/brand";
import { onTick } from "@/lib/motion";
import { createNetwork } from "./network";

type Input = { x: number; y: number; spread: number };

const PULSES = 14;

/* Body i hrany sdílí shader: rozprostření při odjezdu z hera počítá GPU (uSpread × náhodný faktor uzlu). */
const vert = /* glsl */ `
  attribute float aSeed;
  uniform float uSpread;
  uniform float uSize;
  void main() {
    vec3 p = position + normalize(position + vec3(0.0001)) * uSpread * aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize;
  }
`;
const frag = /* glsl */ `
  uniform vec3 uColor;
  void main() { gl_FragColor = vec4(uColor, 1.0); }
`;

function material(color: string, size: number, dpr: number) {
  return new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uSpread: { value: 0 },
      uSize: { value: size * dpr },
      uColor: { value: new THREE.Color(color) },
    },
  });
}

function geometry(points: number[], seeds: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return g;
}

const seed = (i: number) => 0.4 + ((i * 2654435761) % 1000) / 650;

function Network({ input, count, dpr }: { input: React.RefObject<Input>; count: number; dpr: number }) {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const net = useMemo(() => createNetwork(count), [count]);

  const parts = useMemo(() => {
    const nodeGeo = geometry(net.nodes.flat(), net.nodes.map((_, i) => seed(i)));
    const edgeGeo = geometry(
      net.edges.flatMap(([a, b]) => [...net.nodes[a], ...net.nodes[b]]),
      net.edges.flatMap(([a, b]) => [seed(a), seed(b)])
    );
    const accentGeo = geometry(net.accent.flatMap((i) => net.nodes[i]), net.accent.map(seed));
    const pulseGeo = geometry(new Array(PULSES * 3).fill(0), new Array(PULSES).fill(0));
    const mats = {
      line: material(brand.colors.line, 1, dpr),
      node: material(brand.colors.fg, 2.2, dpr),
      accent: material(brand.colors.accent, 6, dpr),
      pulse: material(brand.colors.accent, 3.5, dpr),
    };
    return { nodeGeo, edgeGeo, accentGeo, pulseGeo, mats };
  }, [net, dpr]);

  const pulseState = useRef(
    Array.from({ length: PULSES }, (_, i) => ({
      edge: (i * 53) % net.edges.length,
      t: (i / PULSES) % 1,
      speed: 0.6 + ((i * 7) % 5) * 0.15,
    }))
  );

  useEffect(
    () => () => {
      [parts.nodeGeo, parts.edgeGeo, parts.accentGeo, parts.pulseGeo].forEach((g) => g.dispose());
      Object.values(parts.mats).forEach((m) => m.dispose());
    },
    [parts]
  );

  useFrame((_, delta) => {
    const g = group.current;
    const pts = pulseRef.current;
    if (!g || !pts) return;
    const p = input.current;
    const k = Math.min(1, delta * 3);
    g.rotation.y += delta * 0.04;
    g.rotation.x += (p.y * 0.35 - g.rotation.x) * k;
    g.rotation.z += (-p.x * 0.12 - g.rotation.z) * k;
    g.position.x += (p.x * 0.4 - g.position.x) * Math.min(1, delta * 2);

    // rozprostření sítě při odjezdu z hera (uniform → GPU)
    const spread = p.spread * 6;
    for (const m of Object.values(parts.mats)) m.uniforms.uSpread.value = spread;

    // signály putující po hranách – při rozpadu mizí
    pts.visible = p.spread < 0.35;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    pulseState.current.forEach((s, i) => {
      s.t += delta * s.speed;
      if (s.t >= 1) {
        const end = net.edges[s.edge][1];
        const next = net.edges.findIndex(([a], idx) => a === end && idx !== s.edge);
        s.edge = next >= 0 ? next : (s.edge * 31 + 17) % net.edges.length;
        s.t = 0;
      }
      const [a, b] = net.edges[s.edge];
      const na = net.nodes[a];
      const nb = net.nodes[b];
      pos.setXYZ(i, na[0] + (nb[0] - na[0]) * s.t, na[1] + (nb[1] - na[1]) * s.t, na[2] + (nb[2] - na[2]) * s.t);
    });
    pos.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={parts.edgeGeo} material={parts.mats.line} />
      <points geometry={parts.nodeGeo} material={parts.mats.node} />
      <points geometry={parts.accentGeo} material={parts.mats.accent} />
      <points ref={pulseRef} geometry={parts.pulseGeo} material={parts.mats.pulse} />
    </group>
  );
}

/** Desktop verze (R3F + three.js). Mobil používá `neural-lite.tsx`. */
export default function NeuralCanvas() {
  const input = useRef<Input>({ x: 0, y: 0, spread: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [maxDpr, setMaxDpr] = useState(1.75);
  const [deviceDpr] = useState(() => (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1));
  const dpr = Math.min(maxDpr, deviceDpr);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const coords = document.querySelector<HTMLElement>("[data-hud-coords]");
    const pointer = { x: 0, y: 0 };
    let heroH = el.offsetHeight || window.innerHeight;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (coords) coords.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")} · Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
    };
    const onResize = () => {
      heroH = el.offsetHeight || window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    // render jen když je hero vidět (mimo viewport / skrytý tab = žádné snímky)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    // jediná smyčka: gsap.ticker → R3F advance
    const off = onTick((time) => {
      if (!visible) return;
      const i = input.current;
      i.x += (pointer.x - i.x) * 0.08;
      i.y += (pointer.y - i.y) * 0.08;
      i.spread = Math.min(1, Math.max(0, window.scrollY / heroH));
      advance(time);
    });

    return () => {
      off();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop="never"
        dpr={dpr}
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
        <Network input={input} count={520} dpr={dpr} />
      </Canvas>
    </div>
  );
}
