"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Engine = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let engine: Promise<Engine> | null = null;
function loadEngine() {
  engine ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return engine;
}

/** Lenis smooth scroll + mechanické odkrývání prvků při scrollu. Knihovny se načítají líně. */
export function MotionProvider() {
  const pathname = usePathname();
  const ready = useRef(false);

  useEffect(() => {
    if (reduced()) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    Promise.all([loadEngine(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;
      const lenis = new Lenis({ anchors: { offset: -80 }, lerp: 0.14 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      destroy = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  useEffect(() => {
    if (reduced()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadEngine().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      // Animují se jen prvky pod ohybem – co už je vidět, zůstává (žádný záblesk po načtení)
      const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("main section h2").filter(below).forEach((el) => {
          gsap.from(el, {
            clipPath: "inset(0 0 100% 0)",
            y: 24,
            duration: 0.5,
            ease: "steps(5)",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").filter(below).forEach((group) => {
          gsap.from(group.querySelectorAll("[data-reveal]"), {
            clipPath: "inset(0 100% 0 0)",
            duration: 0.45,
            ease: "steps(6)",
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 80%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-section-head]").filter(below).forEach((el) => {
          gsap.from(el, {
            clipPath: "inset(0 100% 0 0)",
            duration: 0.6,
            ease: "steps(12)",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
      });
      if (ready.current) ScrollTrigger.refresh();
      ready.current = true;
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pathname]);

  return null;
}
