"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { themeBg, type ThemeName } from "@/config/brand";

/**
 * Barevná dramaturgie podle scrollu.
 * Sekce s `data-band` + `data-theme` tvoří pásy s vlastním plným pozadím (správný kontrast i pro audit a čtečky).
 * Přechod: pás, který přijíždí, má nad svým pozadím (a pod obsahem) vrstvu `::before` v barvě předchozího pásu;
 * její opacity klesá 1 → 0, zatímco horní hranice úseku jede od spodní hrany viewportu do 70 % jeho výšky
 * (pozadí je hotové dřív, než se nadpis sekce dostane do oblasti čtení).
 * Mění se jen `--band-fade` (registrovaná, nedědí se → žádný přepočet stylů potomků) → opacity na compositoru.
 * Pás viditelný hned po načtení je rovnou hotový; u konce stránky se přechod zkrátí na maximální scroll.
 * Hlavička dostane `data-theme` pásu, který je právě pod ní; pozadí <html> = barva prvního pásu.
 */

type Seg = { top: number; bottom: number; theme: ThemeName; el: HTMLElement; fade?: boolean; last?: number };

const START = 1;
const SPAN = 0.3;

/** Pásy → nepřekrývající se úseky; vnořený pás má přednost (je v DOM později než rodič). */
function measure(): Seg[] {
  const bands = [...document.querySelectorAll<HTMLElement>("[data-band][data-theme]")];
  const y = window.scrollY;
  const rects = bands.map((el) => {
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + y), bottom: Math.round(r.bottom + y), theme: el.dataset.theme as ThemeName, el };
  });
  const cuts = [...new Set(rects.flatMap((r) => [r.top, r.bottom]))].sort((a, b) => a - b);
  const segs: Seg[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    let own: (typeof rects)[number] | null = null;
    for (const r of rects) if (r.top <= mid && r.bottom > mid) own = r;
    if (!own) continue;
    const last = segs.at(-1);
    if (last && last.theme === own.theme && last.bottom === cuts[i]) last.bottom = cuts[i + 1];
    else segs.push({ top: cuts[i], bottom: cuts[i + 1], theme: own.theme, el: own.el });
  }
  return segs;
}

export function ThemeBackdrop() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
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
        const p = start <= 0 ? 1 : end > start ? Math.min(1, Math.max(0, (y - start) / (end - start))) : y >= end ? 1 : 0;
        const o = Math.round((1 - p) * 1000) / 1000;
        if (o !== s.last) s.el.style.setProperty("--band-fade", String((s.last = o)));
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
    const clear = () => {
      document.querySelectorAll<HTMLElement>("[data-band][data-fade]").forEach((el) => {
        el.removeAttribute("data-fade");
        el.style.removeProperty("--band-fade");
        el.style.removeProperty("--band-from");
      });
    };
    const refresh = () => {
      clear();
      segs = measure();
      segs.forEach((s, i) => {
        const prev = segs[i - 1];
        if (!prev || prev.theme === s.theme) return;
        // jeden prvek může vlastnit víc úseků (např. <main> mezi vnořenými pásy) – přechod dostane jen první
        if (s.el.hasAttribute("data-fade")) return;
        s.fade = true;
        s.el.setAttribute("data-fade", "");
        s.el.style.setProperty("--band-from", themeBg[prev.theme]);
      });
      if (segs[0]) root.style.backgroundColor = themeBg[segs[0].theme];
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
      root.style.removeProperty("background-color");
      clear();
    };
  }, [pathname]);

  return null;
}
