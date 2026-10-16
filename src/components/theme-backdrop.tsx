"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { themeBg, type ThemeName } from "@/config/brand";

/**
 * Barevná dramaturgie podle scrollu.
 * Sekce s `data-band` + `data-theme` tvoří pásy. Bez JS má každý pás vlastní pozadí (globals.css).
 * S JS se pásy zprůhlední a pod obsahem je pevná vrstva se třemi plochami (tmavá / světlá / červená).
 * Mění se jen jejich opacity → prolínání běží na compositoru, bez překreslování stránky.
 *
 * Přechod mezi pásy: hranice jede od 80 % do 50 % výšky viewportu (30 % vh) → plynulé prolnutí.
 * U konce stránky se konec přechodu zkrátí na maximální scroll.
 * Hlavička dostane `data-theme` pásu, který je právě pod ní.
 */

type Seg = { top: number; bottom: number; theme: ThemeName };
type W = { l: number; a: number };

const WEIGHT: Record<ThemeName, W> = { dark: { l: 0, a: 0 }, light: { l: 1, a: 0 }, accent: { l: 0, a: 1 } };
const START = 0.8;
const SPAN = 0.3;

function mix(from: ThemeName, to: ThemeName, p: number): W {
  const a = WEIGHT[from];
  const b = WEIGHT[to];
  // červená leží nad světlou → při přechodu z/do červené se světlá vrstva nemění (žádné probliknutí přes tmavou)
  const l = to === "accent" ? a.l : from === "accent" ? b.l : a.l + (b.l - a.l) * p;
  return { l, a: a.a + (b.a - a.a) * p };
}

/** Pásy → nepřekrývající se úseky; vnořený pás má přednost (je v DOM později než rodič). */
function measure(): Seg[] {
  const bands = [...document.querySelectorAll<HTMLElement>("[data-band][data-theme]")];
  const y = window.scrollY;
  const rects = bands.map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + y, bottom: r.bottom + y, theme: el.dataset.theme as ThemeName };
  });
  const cuts = [...new Set(rects.flatMap((r) => [r.top, r.bottom]))].sort((a, b) => a - b);
  const segs: Seg[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    let theme: ThemeName | null = null;
    for (const r of rects) if (r.top <= mid && r.bottom > mid) theme = r.theme;
    if (!theme) continue;
    const last = segs.at(-1);
    if (last && last.theme === theme && Math.abs(last.bottom - cuts[i]) < 1) last.bottom = cuts[i + 1];
    else segs.push({ top: cuts[i], bottom: cuts[i + 1], theme });
  }
  return segs;
}

export function ThemeBackdrop() {
  const light = useRef<HTMLDivElement>(null);
  const accent = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    let segs: Seg[] = [];
    let raf = 0;
    let lastL = -1;
    let lastA = -1;
    let lastHeader = "";

    const update = () => {
      raf = 0;
      if (!segs.length) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      let w = WEIGHT[segs[0].theme];
      for (let i = 1; i < segs.length; i++) {
        // přechod u konce stránky (patička) musí doběhnout, i když hranice nedojede do 50 % viewportu
        const start = segs[i].top - vh * START;
        const end = Math.min(segs[i].top - vh * (START - SPAN), max);
        const p = end > start ? (y - start) / (end - start) : y >= end ? 1 : 0;
        if (p <= 0) break;
        w = mix(segs[i - 1].theme, segs[i].theme, Math.min(1, p));
      }
      const l = Math.round(w.l * 1000) / 1000;
      const a = Math.round(w.a * 1000) / 1000;
      if (l !== lastL) light.current!.style.opacity = String((lastL = l));
      if (a !== lastA) accent.current!.style.opacity = String((lastA = a));

      if (header) {
        const hy = y + header.offsetHeight / 2;
        const t = (segs.find((s) => s.top <= hy && s.bottom > hy) ?? segs[0]).theme;
        if (t !== lastHeader) header.dataset.theme = lastHeader = t;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const refresh = () => {
      segs = measure();
      lastL = lastA = -1;
      update();
    };

    refresh();
    root.dataset.backdrop = "";
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("theme:refresh", refresh);
    // změna výšky stránky (líně načtené sekce, piny ScrollTriggeru, fonty)
    let h = 0;
    const ro = new ResizeObserver(() => {
      const nh = document.documentElement.scrollHeight;
      if (nh !== h) {
        h = nh;
        refresh();
      }
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("theme:refresh", refresh);
      delete root.dataset.backdrop;
    };
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[1]" style={{ background: themeBg.dark }}>
      <div ref={light} className="absolute inset-0 will-change-[opacity]" style={{ background: themeBg.light, opacity: 0 }} />
      <div ref={accent} className="absolute inset-0 will-change-[opacity]" style={{ background: themeBg.accent, opacity: 0 }} />
    </div>
  );
}
