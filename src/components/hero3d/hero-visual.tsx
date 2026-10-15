"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NeuralCanvas = dynamic(() => import("./neural-canvas"), { ssr: false, loading: () => null });

/** 3D jen na desktopu s WebGL a bez reduced-motion. Načte se až po dokončení načítání stránky. */
function can3d() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual({ fallback }: { fallback: React.ReactNode }) {
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    if (!can3d()) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setEnable3d(true), { timeout: 2500 });
    return () => cancel(id);
  }, []);

  return <div className="absolute inset-0">{enable3d ? <NeuralCanvas /> : fallback}</div>;
}
