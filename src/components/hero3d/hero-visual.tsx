"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// desktop: R3F + three.js; mobil: odlehčené čisté WebGL (stejná síť, zlomek JS)
const NeuralCanvas = dynamic(() => import("./neural-canvas"), { ssr: false, loading: () => null });
const NeuralLite = dynamic(() => import("./neural-lite"), { ssr: false, loading: () => null });

type Mode = "static" | "desktop" | "mobile";

/** 3D s WebGL a bez reduced-motion; na dotykových zařízeních odlehčená verze. Načte se až po LCP (idle). */
function detect(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return "static";
  } catch {
    return "static";
  }
  return window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches ? "desktop" : "mobile";
}

export function HeroVisual({ fallback }: { fallback: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("static");

  useEffect(() => {
    const m = detect();
    if (m === "static") return;
    const run = () => setMode(m);
    // po LCP a v klidu
    const delay = 0;
    let id: number | undefined;
    const t = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") id = window.requestIdleCallback(run, { timeout: 2500 });
      else run();
    }, delay);
    return () => {
      clearTimeout(t);
      if (id !== undefined) window.cancelIdleCallback?.(id);
    };
  }, []);

  return <div className="absolute inset-0">{mode === "static" ? fallback : mode === "mobile" ? <NeuralLite /> : <NeuralCanvas />}</div>;
}
