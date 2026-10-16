"use client";

import { useEffect, useRef } from "react";

/**
 * Tenký progress scrollu nahoře (2 px, akcent). Bez vlastní rAF smyčky: zápis `transform` přímo ve scroll
 * handleru (scroll události chodí jednou za snímek), výška stránky se cachuje přes ResizeObserver.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let max = 1;
    let last = -1;
    const update = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const q = Math.round(p * 1000) / 1000;
      if (q !== last) {
        last = q;
        el.style.transform = `scaleX(${q})`;
      }
    };
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      update();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <div ref={bar} className="scroll-progress h-full bg-accent shadow-[0_0_12px_rgba(255,59,59,0.6)]" />
    </div>
  );
}
