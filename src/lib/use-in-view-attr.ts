"use client";

import { useEffect } from "react";

/** Nastaví atribut `data-<name>` na prvku, jen když je ve viewportu (např. pro pozastavení CSS animací mimo obrazovku). */
export function useInViewAttr(ref: React.RefObject<HTMLElement | null>, name = "blink") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.setAttribute(`data-${name}`, "");
      else el.removeAttribute(`data-${name}`);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, name]);
}
