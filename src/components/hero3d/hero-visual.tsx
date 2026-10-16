"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { cx } from "@/components/ui";

// desktop: R3F + three.js; mobil: odlehčené čisté WebGL (stejná síť, zlomek JS)
const NeuralCanvas = dynamic(() => import("./neural-canvas"), { ssr: false, loading: () => null });
const NeuralLite = dynamic(() => import("./neural-lite"), { ssr: false, loading: () => null });

type Mode = "static" | "desktop" | "mobile";

/**
 * 3D jen bez reduced-motion. Desktop ověří WebGL testovacím plátnem (R3F by bez kontextu spadl);
 * mobil plátno nevytváří – první WebGL kontext inicializuje GPU proces (na slabém zařízení / v emulaci
 * stovky ms až sekundy), proto ho odlehčená verze vytvoří až po první interakci a sama si poradí s `null`.
 */
function detect(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  if (!("WebGLRenderingContext" in window)) return "static";
  if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return "mobile";
  try {
    const c = document.createElement("canvas");
    return c.getContext("webgl2") || c.getContext("webgl") ? "desktop" : "static";
  } catch {
    return "static";
  }
}

const idle = (fn: () => void, timeout: number) =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout }) : window.setTimeout(fn, 50);

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
    let id: number | undefined;
    const run = () => (id = idle(() => setMode(m), 2500));
    if (m === "desktop") {
      run();
      return () => window.cancelIdleCallback?.(id!);
    }
    // mobil: až po prvním scrollu / dotyku (v idle, ne v handleru → neovlivní odezvu interakce)
    const events = ["scroll", "touchstart", "pointerdown"] as const;
    const once = () => {
      events.forEach((e) => window.removeEventListener(e, once));
      run();
    };
    events.forEach((e) => window.addEventListener(e, once, { passive: true, once: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, once));
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
