"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { cx } from "@/components/ui";

// desktop: R3F + three.js; mobil: odlehčené čisté WebGL (stejná síť, zlomek JS)
const NeuralCanvas = dynamic(() => import("./neural-canvas"), { ssr: false, loading: () => null });
const NeuralLite = dynamic(() => import("./neural-lite"), { ssr: false, loading: () => null });

type Mode = "static" | "desktop" | "mobile";

/** 3D s WebGL a bez reduced-motion; na dotykových zařízeních odlehčená verze. */
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

/**
 * Statická SVG síť ze SSR je vidět hned; 3D se načte po LCP (idle) a až po prvních vykreslených
 * snímcích se plynule prolne přes ni (žádné probliknutí prázdného plátna).
 */
export function HeroVisual({ fallback }: { fallback: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("static");
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const m = detect();
    if (m === "static") return;
    const run = () => setMode(m);
    let id: number | undefined;
    if (typeof window.requestIdleCallback === "function") id = window.requestIdleCallback(run, { timeout: 2500 });
    else run();
    return () => {
      if (id !== undefined) window.cancelIdleCallback?.(id);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <div className={cx("absolute inset-0 transition-opacity duration-1000 ease-[var(--ease)]", ready && "opacity-0")}>{fallback}</div>
      {mode !== "static" ? (
        <div className={cx("absolute inset-0 opacity-0 transition-opacity duration-1000 ease-[var(--ease)]", ready && "opacity-100")}>
          {mode === "mobile" ? <NeuralLite onReady={onReady} /> : <NeuralCanvas onReady={onReady} />}
        </div>
      ) : null}
    </div>
  );
}
