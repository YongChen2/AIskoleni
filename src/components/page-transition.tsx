"use client";

import { useLayoutEffect, useRef } from "react";

let firstMount = true;

/** Krátké mechanické odhalení obsahu po klientské navigaci. Při prvním načtení nic (neblokuje LCP). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    const el = ref.current;
    if (!el) return;
    el.classList.add("page-enter");
    const done = () => el.classList.remove("page-enter");
    el.addEventListener("animationend", done, { once: true });
    return () => el.removeEventListener("animationend", done);
  }, []);

  return <div ref={ref}>{children}</div>;
}
