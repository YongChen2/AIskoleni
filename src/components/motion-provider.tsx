"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lenis smooth scroll + mechanické odkrývání prvků při scrollu (GSAP ScrollTrigger). */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ anchors: { offset: -80 }, lerp: 0.14 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      // Nadpisy sekcí: ostré ořezové odkrytí zdola nahoru, stupňovitě
      gsap.utils.toArray<HTMLElement>("main section h2").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          y: 24,
          duration: 0.5,
          ease: "steps(5)",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Skupiny karet: postupně, jedna po druhé
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll("[data-reveal]");
        gsap.from(items, {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.45,
          ease: "steps(6)",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 80%", once: true },
        });
      });

      // Linky hlaviček sekcí: vykreslení zleva
      gsap.utils.toArray<HTMLElement>("[data-section-head]").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.6,
          ease: "steps(12)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);

  return null;
}
