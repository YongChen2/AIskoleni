"use client";

import { Canvas, advance, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { onTick } from "@/lib/motion";
import { createNetwork } from "./network";
import { ACCENT_COUNT, FOG_GLSL, FRAG, LAYERS, MOTION, seed } from "./look";

type Input = { x: number; y: number; spread: number };
type Layer = (typeof LAYERS)[keyof typeof LAYERS];

const PULSES = 10;

/* Body i hrany sdílí shader: rozprostření při odjezdu z hera počítá GPU (uSpread × náhodný faktor uzlu). */
const vert = /* glsl */ `
  attribute float aSeed;
  uniform float uSpread;
  uniform float uSize;
  varying float vFade;
  void main() {
    vec3 p = position + normalize(position + vec3(0.0001)) * uSpread * aSeed;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    ${FOG_GLSL}
    gl_Position = projectionMatrix * mv;
  }
`;

function material(l: Layer, dpr: number, point: boolean) {
  return new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    // FRAG vrací předem vynásobenou barvu → čistě aditivní míchání
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    uniforms: {
      uSpread: { value: 0 },
      uSize: { value: l.size * dpr },
      uColor: { value: new THREE.Color(l.color) },
      uOpacity: { value: l.opacity },
      uSoft: { value: l.soft },
      uPoint: { value: point ? 1 : 0 },
    },
  });
}

function geometry(points: number[], seeds: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return g;
}

function Network({ input, count, dpr }: { input: React.RefObject<Input>; count: number; dpr: number }) {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const net = useMemo(() => createNetwork(count), [count]);

  const parts = useMemo(() => {
    const accent = net.accent.slice(0, ACCENT_COUNT);
    const nodeGeo = geometry(net.nodes.flat(), net.nodes.map((_, i) => seed(i)));
    const edgeGeo = geometry(
      net.edges.flatMap(([a, b]) => [...net.nodes[a], ...net.nodes[b]]),
      net.edges.flatMap(([a, b]) => [seed(a), seed(b)])
    );
    const accentGeo = geometry(accent.flatMap((i) => net.nodes[i]), accent.map(seed));
    const pulseGeo = geometry(new Array(PULSES * 3).fill(0), new Array(PULSES).fill(0));
    const mats = {
      edge: material(LAYERS.edge, dpr, false),
      node: material(LAYERS.node, dpr, true),
      halo: material(LAYERS.halo, dpr, true),
      accent: material(LAYERS.accent, dpr, true),
      pulse: material(LAYERS.pulse, dpr, true),
    };
    return { nodeGeo, edgeGeo, accentGeo, pulseGeo, mats };
  }, [net, dpr]);

  const pulseState = useRef(
    Array.from({ length: PULSES }, (_, i) => ({
      edge: (i * 53) % net.edges.length,
      t: (i / PULSES) % 1,
      speed: 0.35 + ((i * 7) % 5) * 0.08,
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
    const k = Math.min(1, delta * 2);
    g.rotation.y += delta * MOTION.spin;
    g.rotation.x += (p.y * MOTION.tiltX - g.rotation.x) * k;
    g.rotation.z += (-p.x * MOTION.tiltZ - g.rotation.z) * k;
    g.position.x += (2.4 + p.x * MOTION.shift - g.position.x) * Math.min(1, delta * 1.5);

    // mírné rozprostření sítě při odjezdu z hera (uniform → GPU)
    const spread = p.spread * MOTION.spread;
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
    <group ref={group} position={[2.4, 0, 0]}>
      <lineSegments geometry={parts.edgeGeo} material={parts.mats.edge} />
      <points geometry={parts.nodeGeo} material={parts.mats.node} />
      <points geometry={parts.accentGeo} material={parts.mats.halo} />
      <points geometry={parts.accentGeo} material={parts.mats.accent} />
      <points ref={pulseRef} geometry={parts.pulseGeo} material={parts.mats.pulse} />
    </group>
  );
}

/** Desktop verze (R3F + three.js). Mobil používá `neural-lite.tsx`. */
export default function NeuralCanvas({ onReady }: { onReady?: () => void }) {
  const input = useRef<Input>({ x: 0, y: 0, spread: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [maxDpr, setMaxDpr] = useState(1.75);
  const [deviceDpr] = useState(() => (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1));
  const dpr = Math.min(maxDpr, deviceDpr);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const pointer = { x: 0, y: 0 };
    let heroH = el.offsetHeight || window.innerHeight;
    let visible = true;
    let frames = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
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
      i.x += (pointer.x - i.x) * 0.05;
      i.y += (pointer.y - i.y) * 0.05;
      i.spread = Math.min(1, Math.max(0, window.scrollY / heroH));
      // R3F s frameloop="never" bere čas v SEKUNDÁCH (onTick dává ms) – jinak síť rotuje ~1000× rychleji
      advance(time / 1000);
      if (++frames === 2) onReady?.();
    });

    return () => {
      off();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [onReady]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop="never"
        dpr={dpr}
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
        <Network input={input} count={480} dpr={dpr} />
      </Canvas>
    </div>
  );
}
