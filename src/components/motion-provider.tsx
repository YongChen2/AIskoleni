"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, loadEngine, prefersReducedMotion, scrollToTarget, startLenis } from "@/lib/motion";

const idle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
  else setTimeout(cb, 300);
};

/** Lenis, kotvy, reset scrollu po navigaci a mechanické reveal animace. */
export function MotionProvider() {
  const pathname = usePathname();

  // Lenis + přesměrování kotvových odkazů na plynulý dojezd
  useEffect(() => {
    idle(() => void startLenis());

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || !a.hash || a.target) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      // capture fáze: předběhneme next/link, který by na kotvu skočil bez dojezdu
      e.preventDefault();
      e.stopPropagation();
      history.pushState(null, "", url.hash);
      scrollToTarget(el);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Po změně stránky: na začátek bez skoku (nebo na kotvu)
  useEffect(() => {
    const hash = location.hash.slice(1);
    const el = hash ? document.getElementById(decodeURIComponent(hash)) : null;
    if (el) requestAnimationFrame(() => scrollToTarget(el, { immediate: true }));
    else if (getLenis()) getLenis()!.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  // Reveal animace – jen prvky pod ohybem, jednou, ≤ 600 ms, clip-path + transform
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    loadEngine().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
      const reveal = (targets: Element[] | NodeListOf<Element>, from: gsap.TweenVars, trigger: Element, start: string) =>
        gsap.from(targets, {
          ...from,
          scrollTrigger: { trigger, start, once: true },
          onStart() {
            gsap.set(this.targets(), { willChange: "clip-path, transform" });
          },
          onComplete() {
            gsap.set(this.targets(), { clearProps: "willChange,clipPath,transform" });
          },
        });

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("main section h2").filter(below).forEach((el) =>
          reveal([el], { clipPath: "inset(0 0 100% 0)", y: 24, duration: 0.5, ease: "steps(5)" }, el, "top 88%")
        );
        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").filter(below).forEach((g) =>
          reveal(g.querySelectorAll("[data-reveal]"), { clipPath: "inset(0 100% 0 0)", duration: 0.45, ease: "steps(6)", stagger: 0.1 }, g, "top 80%")
        );
        gsap.utils.toArray<HTMLElement>("[data-section-head]").filter(below).forEach((el) =>
          reveal([el], { clipPath: "inset(0 100% 0 0)", duration: 0.5, ease: "steps(10)" }, el, "top 92%")
        );
      });
      ScrollTrigger.refresh();
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pathname]);

  return null;
}
