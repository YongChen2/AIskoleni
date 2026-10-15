"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { createNetwork } from "./network";

const NeuralCanvas = dynamic(() => import("./neural-canvas"), { ssr: false, loading: () => null });

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

let webgl: boolean | undefined;
function canRender3d() {
  if (window.matchMedia(motionQuery).matches) return false;
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

/** Statická projekce sítě – fallback pro reduced-motion, bez WebGL a před načtením 3D. */
const staticNet = createNetwork(160, 7);
function StaticNetwork() {
  const project = ([x, y, z]: [number, number, number]) => [600 + x * 90 + z * 20, 300 + y * 90 - z * 10];
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      {staticNet.edges.map(([a, b], i) => {
        const [x1, y1] = project(staticNet.nodes[a]);
        const [x2, y2] = project(staticNet.nodes[b]);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth="1" />;
      })}
      {staticNet.nodes.map((n, i) => {
        const [x, y] = project(n);
        const accent = staticNet.accent.includes(i);
        return <rect key={i} x={x - (accent ? 3 : 1)} y={y - (accent ? 3 : 1)} width={accent ? 6 : 2} height={accent ? 6 : 2} fill={accent ? "var(--accent)" : "var(--fg)"} />;
      })}
    </svg>
  );
}

export function HeroVisual() {
  const enable3d = useSyncExternalStore(subscribe, canRender3d, () => false);
  return (
    <div className="absolute inset-0">
      {enable3d ? <NeuralCanvas /> : <StaticNetwork />}
    </div>
  );
}
