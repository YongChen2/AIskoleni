"use client";

/**
 * Sdílené jádro pohybu.
 * - Jediná rAF smyčka = `gsap.ticker`. Lenis, reveal animace, kurzor, HUD i R3F se na ni jen věší.
 * - GSAP + Lenis se načítají líně (po prvním vykreslení), nejsou v kritické cestě LCP.
 * - Lenis jen na zařízeních s myší; dotyk = nativní scroll.
 */

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export type Engine = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let enginePromise: Promise<Engine> | null = null;

export function loadEngine(): Promise<Engine> {
  enginePromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    g.gsap.ticker.lagSmoothing(500, 33);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return enginePromise;
}

/** Přihlásí callback do sdílené smyčky. `time` v ms, `delta` v ms. Vrací odhlášení. */
export function onTick(fn: (time: number, delta: number) => void): () => void {
  let off = false;
  let remove: (() => void) | undefined;
  loadEngine().then(({ gsap }) => {
    if (off) return;
    const cb = (t: number, d: number) => fn(t * 1000, d);
    gsap.ticker.add(cb);
    remove = () => gsap.ticker.remove(cb);
  });
  return () => {
    off = true;
    remove?.();
  };
}

/* ---------- Lenis ---------- */

let lenis: Lenis | null = null;
const lenisListeners = new Set<(l: Lenis | null) => void>();

export const getLenis = () => lenis;

export function subscribeLenis(fn: (l: Lenis | null) => void) {
  lenisListeners.add(fn);
  fn(lenis);
  return () => lenisListeners.delete(fn);
}

export async function startLenis() {
  if (lenis || prefersReducedMotion() || !hasFinePointer()) return null;
  const [{ gsap, ScrollTrigger }, { default: LenisCtor }] = await Promise.all([loadEngine(), import("lenis")]);
  if (lenis) return lenis;
  const l = new LenisCtor({ lerp: 0.08, wheelMultiplier: 0.9, syncTouch: false, autoRaf: false });
  l.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => l.raf(t * 1000);
  gsap.ticker.add(tick);
  lenis = l;
  lenisListeners.forEach((f) => f(l));
  return l;
}

/** Plynulý posun na prvek nebo pozici – s Lenis dojezdem, jinak nativně. */
export function scrollToTarget(target: HTMLElement | number, opts: { immediate?: boolean; offset?: number } = {}) {
  const offset = opts.offset ?? -80;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: opts.immediate, duration: opts.immediate ? undefined : 1.1, force: true });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: opts.immediate || prefersReducedMotion() ? "instant" : "smooth" });
}
