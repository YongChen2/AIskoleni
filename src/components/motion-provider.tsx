"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, hasFinePointer, prefersReducedMotion, scrollToTarget, startLenis } from "@/lib/motion";

const idle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
  else setTimeout(cb, 300);
};

const REVEAL = "[data-reveal], [data-reveal-block]";
const STAGGER = 70;
const WORD_STAGGER = 45;

/**
 * Reveal: fade + posun 20 px, jednou. Bez rAF smyčky – IntersectionObserver přepne atribut, animaci dělá CSS
 * přechod (compositor). Skrývá se jen to, co je v okamžiku nastavení pod ohybem, takže obsah nad ohybem
 * je vidět hned ze SSR a nikdy neprobliknete. Prvky ve stejné skupině dostanou stagger.
 */
function setupReveal(): () => void {
  const vh = window.innerHeight;
  const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter((el) => {
    // vnořený prvek uvnitř jiného revealu neanimovat zvlášť (např. h2 uvnitř bloku)
    if (el.parentElement?.closest(REVEAL)) return false;
    // swipe karty na mobilu jsou mimo obraz vodorovně – při posunu by teprve „naskočily“
    if (el.closest(".swipe") && !window.matchMedia("(min-width: 1024px)").matches) return false;
    return el.getBoundingClientRect().top > vh * 0.95;
  });
  if (!els.length) return () => {};

  els.forEach((el) => el.setAttribute("data-reveal-state", "hidden"));

  const clean = (el: HTMLElement) => {
    el.removeAttribute("data-reveal-state");
    el.style.removeProperty("--reveal-delay");
  };

  const io = new IntersectionObserver(
    (entries) => {
      const batch = new Map<Element | null, number>();
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const group = el.closest("[data-reveal-group]");
        const n = batch.get(group) ?? 0;
        batch.set(group, n + 1);
        if (group) el.style.setProperty("--reveal-delay", `${Math.min(n, 5) * STAGGER}ms`);
        el.setAttribute("data-reveal-state", "shown");
        // nadpis po slovech (.word) běží déle než fade bloku → stav uklidit až po posledním slově
        const words = el.querySelectorAll(".word").length;
        const tail = words ? Math.min(words, 14) * WORD_STAGGER + 300 : 0;
        const onEnd = (ev: TransitionEvent) => {
          if (ev.target !== el) return; // přechody potomků (hover apod.) ignorovat
          el.removeEventListener("transitionend", onEnd);
          setTimeout(() => clean(el), tail);
        };
        el.addEventListener("transitionend", onEnd);
        // pojistka, kdyby transitionend nepřišel (např. skrytý tab)
        setTimeout(() => clean(el), 1400 + tail);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
  );
  els.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    els.forEach(clean);
  };
}

/** Magnetická tlačítka (jen myš): posun max. 4 px k ukazateli přes CSS proměnné → vlastnost `translate`. */
function setupMagnetic(): () => void {
  const MAX = 4;
  let current: HTMLElement | null = null;
  const reset = () => {
    if (!current) return;
    current.style.removeProperty("--mx");
    current.style.removeProperty("--my");
    current = null;
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = (e.target as Element).closest?.<HTMLElement>("[data-magnetic], .btn-primary");
    if (el !== current) reset();
    if (!el) return;
    current = el;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty("--mx", `${(dx * MAX).toFixed(1)}px`);
    el.style.setProperty("--my", `${(dy * MAX * 0.6).toFixed(1)}px`);
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", reset);
  return () => {
    reset();
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", reset);
  };
}

/**
 * Jemný 3D tilt karet ve světlých sekcích (jen myš, max. 4°). Delegovaný pointermove, jeden zápis transformu
 * na snímek; vlastní přechod drží i původní přechody karty (okraj, stín).
 */
function setupTilt(): () => void {
  const MAX = 4;
  const T = "transform 0.25s var(--ease), border-color 0.3s var(--ease), box-shadow 0.3s var(--ease)";
  let card: HTMLElement | null = null;
  let raf = 0;
  let pos = { x: 0, y: 0 };
  const release = () => {
    const c = card;
    card = null;
    if (!c) return;
    c.style.transition = T.replace("0.25s", "0.6s");
    c.style.transform = "";
    setTimeout(() => c !== card && (c.style.transition = ""), 650);
  };
  const apply = () => {
    raf = 0;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const dx = (pos.x - r.left) / r.width - 0.5;
    const dy = (pos.y - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-dy * MAX * 2).toFixed(2)}deg) rotateY(${(dx * MAX * 2).toFixed(2)}deg)`;
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = (e.target as Element).closest?.<HTMLElement>(".card");
    const ok = el && el.closest("[data-theme]")?.getAttribute("data-theme") === "light" && !el.closest("[data-reveal-state]");
    if (el !== card || !ok) release();
    if (!ok) return;
    if (card !== el) {
      card = el;
      card.style.transition = T;
    }
    pos = { x: e.clientX, y: e.clientY };
    if (!raf) raf = requestAnimationFrame(apply);
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", release);
  return () => {
    cancelAnimationFrame(raf);
    release();
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", release);
  };
}

/** Lenis, kotvy, reset scrollu po navigaci, reveal animace, magnetická tlačítka a tilt karet. */
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

  // Reveal – po vykreslení nové stránky v klidu (po hydrataci), ne v kritické cestě LCP
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let stop: (() => void) | undefined;
    let id: number | undefined;
    const run = () => (stop = setupReveal());
    if (typeof window.requestIdleCallback === "function") id = window.requestIdleCallback(run, { timeout: 800 });
    else id = window.setTimeout(run, 100);
    return () => {
      if (typeof window.cancelIdleCallback === "function" && id !== undefined) window.cancelIdleCallback(id);
      clearTimeout(id);
      stop?.();
    };
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;
    const a = setupMagnetic();
    const b = setupTilt();
    return () => {
      a();
      b();
    };
  }, []);

  return null;
}
