"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { themeBg, type ThemeName } from "@/config/brand";

/**
 * Barevná dramaturgie podle scrollu.
 * Sekce s `data-band` + `data-theme` tvoří pásy. Bez JS má každý pás vlastní pozadí (globals.css).
 * S JS jsou pásy průhledné a jejich barvu kreslí vrstva pod obsahem (absolutně v dokumentu, scrolluje nativně):
 * každý pás = plocha vlastní barvy + překryv barvou předchozího pásu, jehož opacity klesá 1 → 0, zatímco horní
 * hranice pásu jede od 80 % do 50 % výšky viewportu. Mění se jen opacity → běží na compositoru.
 * Předchozí pás si drží svou barvu (jeho text má kontrast i během přechodu). Pás viditelný hned po načtení
 * je rovnou hotový; u konce stránky se přechod zkrátí na maximální scroll.
 * Hlavička dostane `data-theme` pásu, který je právě pod ní.
 */

type Seg = { top: number; bottom: number; theme: ThemeName; fade?: HTMLDivElement; last?: number };

const START = 0.8;
const SPAN = 0.3;

/** Pásy → nepřekrývající se úseky; vnořený pás má přednost (je v DOM později než rodič). */
function measure(): Seg[] {
  const bands = [...document.querySelectorAll<HTMLElement>("[data-band][data-theme]")];
  const y = window.scrollY;
  const rects = bands.map((el) => {
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + y), bottom: Math.round(r.bottom + y), theme: el.dataset.theme as ThemeName };
  });
  const cuts = [...new Set(rects.flatMap((r) => [r.top, r.bottom]))].sort((a, b) => a - b);
  const segs: Seg[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    let theme: ThemeName | null = null;
    for (const r of rects) if (r.top <= mid && r.bottom > mid) theme = r.theme;
    if (!theme) continue;
    const last = segs.at(-1);
    if (last && last.theme === theme && last.bottom === cuts[i]) last.bottom = cuts[i + 1];
    else segs.push({ top: cuts[i], bottom: cuts[i + 1], theme });
  }
  return segs;
}

function plate(seg: Seg, color: string) {
  const d = document.createElement("div");
  d.style.cssText = `position:absolute;left:0;right:0;top:${seg.top}px;height:${seg.bottom - seg.top}px;background:${color}`;
  return d;
}

export function ThemeBackdrop() {
  const layer = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const host = layer.current!;
    const header = document.querySelector<HTMLElement>(".site-header");
    let segs: Seg[] = [];
    let raf = 0;
    let lastHeader = "";

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      for (const s of segs) {
        if (!s.fade) continue;
        const start = s.top - vh * START;
        const end = Math.min(s.top - vh * (START - SPAN), max);
        // pás viditelný už bez scrollu → hotový; jinak lineárně mezi start a end
        const p = start <= 0 ? 1 : end > start ? Math.min(1, Math.max(0, (y - start) / (end - start))) : y >= end ? 1 : 0;
        const o = Math.round((1 - p) * 1000) / 1000;
        if (o !== s.last) s.fade.style.opacity = String((s.last = o));
      }
      if (header && segs.length) {
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
      // plocha prvního pásu sahá až nahoru (pod hlavičku, která je v DOM před <main>)
      if (segs[0]) segs[0].top = 0;
      host.replaceChildren();
      segs.forEach((s, i) => {
        host.append(plate(s, themeBg[s.theme]));
        const prev = segs[i - 1];
        if (prev && prev.theme !== s.theme) {
          s.fade = plate(s, themeBg[prev.theme]);
          s.fade.style.willChange = "opacity";
          host.append(s.fade);
        }
      });
      // výška = konec posledního pásu (ne scrollHeight – vrstva sama nesmí stránku prodlužovat)
      host.style.height = `${segs.at(-1)?.bottom ?? 0}px`;
      update();
    };

    refresh();
    root.dataset.backdrop = "";
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("theme:refresh", refresh);
    // změna výšky stránky (líně načtené sekce, piny ScrollTriggeru, fonty)
    let h = document.body.offsetHeight;
    const ro = new ResizeObserver(() => {
      if (document.body.offsetHeight !== h) {
        h = document.body.offsetHeight;
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
      host.replaceChildren();
    };
  }, [pathname]);

  return <div ref={layer} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-[1] overflow-hidden" />;
}
