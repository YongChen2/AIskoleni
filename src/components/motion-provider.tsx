"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, scrollToTarget, startLenis } from "@/lib/motion";

const idle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
  else setTimeout(cb, 300);
};

/** Lenis, kotvy a reset scrollu po navigaci. */
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

  return null;
}
