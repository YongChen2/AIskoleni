"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { brand } from "@/config/brand";
import { createNetwork } from "./network";

type Pointer = { x: number; y: number };

const PULSES = 18;

function Network({ pointer }: { pointer: React.RefObject<Pointer> }) {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const net = useMemo(() => createNetwork(), []);

  const { nodeGeo, edgeGeo, accentGeo } = useMemo(() => {
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(net.nodes.flat(), 3));
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(net.edges.flatMap(([a, b]) => [...net.nodes[a], ...net.nodes[b]]), 3)
    );
    const accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute("position", new THREE.Float32BufferAttribute(net.accent.flatMap((i) => net.nodes[i]), 3));
    return { nodeGeo, edgeGeo, accentGeo };
  }, [net]);

  // Signály putující po hranách
  const pulseGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(PULSES * 3), 3));
    return geo;
  }, []);
  const pulseState = useRef(
    Array.from({ length: PULSES }, (_, i) => ({
      edge: (i * 53) % net.edges.length,
      t: (i / PULSES) % 1,
      speed: 0.6 + ((i * 7) % 5) * 0.15,
    }))
  );

  useEffect(
    () => () => {
      nodeGeo.dispose();
      edgeGeo.dispose();
      accentGeo.dispose();
      pulseGeo.dispose();
    },
    [nodeGeo, edgeGeo, accentGeo, pulseGeo]
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current;
    // Pomalá vlastní rotace + natočení k myši (lineární, „mechanické“ dotažení)
    g.rotation.y += delta * 0.04;
    const targetX = p.y * 0.35;
    const targetZ = -p.x * 0.12;
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);
    g.rotation.z += (targetZ - g.rotation.z) * Math.min(1, delta * 3);
    g.position.x += (p.x * 0.4 - g.position.x) * Math.min(1, delta * 2);

    const pts = pulseRef.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    pulseState.current.forEach((s, i) => {
      s.t += delta * s.speed;
      if (s.t >= 1) {
        // Přeskočit na navazující hranu – signál „teče“ sítí
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
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={brand.colors.line} />
      </lineSegments>
      <points geometry={nodeGeo}>
        <pointsMaterial color={brand.colors.fg} size={2.2} sizeAttenuation={false} />
      </points>
      <points geometry={accentGeo}>
        <pointsMaterial color={brand.colors.accent} size={6} sizeAttenuation={false} />
      </points>
      <points ref={pulseRef} geometry={pulseGeo}>
        <pointsMaterial color={brand.colors.accent} size={3.5} sizeAttenuation={false} />
      </points>
    </group>
  );
}

export default function NeuralCanvas() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const coords = document.querySelector<HTMLElement>("[data-hud-coords]");
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (coords) {
        coords.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")} · Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Mimo viewport nerenderovat
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <AdaptiveDpr pixelated />
        <Network pointer={pointer} />
      </Canvas>
    </div>
  );
}
