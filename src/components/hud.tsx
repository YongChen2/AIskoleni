"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { onTick } from "@/lib/motion";

type Section = { top: number; code: string; label: string };
type View = { root?: HTMLElement | null; code?: HTMLElement | null; label?: HTMLElement | null; pct?: HTMLElement | null; vel?: HTMLElement | null; bar?: HTMLElement | null };

/**
 * Jeden řadič pro HUD (desktop panel + mini verze v hlavičce na mobilu).
 * Sekce = prvky s `data-hud-code`/`data-hud-label`; jejich pozice se cachují a přepočítají jen při změně výšky stránky.
 * Smyčka (sdílený ticker) běží jen při scrollu, DOM se zapisuje jen při změně hodnot.
 */
const views = new Set<View>();
let sections: Section[] = [];
let started = false;
let stopTick: (() => void) | null = null;
let lastY = 0;
let vel = 0;
let idleFrames = 0;
const last = { code: "", label: "", pct: -1, vel: "", bar: -1, shown: false };

function measure() {
  sections = Array.from(document.querySelectorAll<HTMLElement>("[data-hud-code]")).map((el) => ({
    top: el.getBoundingClientRect().top + window.scrollY,
    code: el.dataset.hudCode ?? "",
    label: el.dataset.hudLabel ?? "",
  }));
  render(true);
}

function render(force = false) {
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const p = Math.min(1, Math.max(0, y / max));
  const probe = y + window.innerHeight * 0.4;
  let cur = sections[0];
  for (const s of sections) if (s.top <= probe) cur = s;
  const pct = Math.round(p * 100);
  const v = vel.toFixed(1);
  const barQ = Math.round(p * 400) / 400;
  const shown = y > window.innerHeight * 0.6;

  for (const view of views) {
    if (cur && (force || cur.code !== last.code)) {
      if (view.code) view.code.textContent = cur.code;
      if (view.label) view.label.textContent = cur.label;
    }
    if ((force || pct !== last.pct) && view.pct) view.pct.textContent = `${String(pct).padStart(2, "0")} %`;
    if ((force || v !== last.vel) && view.vel) view.vel.textContent = v;
    if ((force || barQ !== last.bar) && view.bar) view.bar.style.transform = `scaleX(${barQ})`;
    if ((force || shown !== last.shown) && view.root) view.root.dataset.shown = shown ? "1" : "0";
  }
  if (cur) {
    last.code = cur.code;
    last.label = cur.label;
  }
  last.pct = pct;
  last.vel = v;
  last.bar = barQ;
  last.shown = shown;
}

function tick(_t: number, dt: number) {
  const y = window.scrollY;
  const instant = Math.abs(y - lastY) / Math.max(1, dt); // px/ms
  lastY = y;
  vel += (instant - vel) * 0.2;
  render();
  if (instant < 0.01) idleFrames++;
  else idleFrames = 0;
  if (idleFrames > 30 && vel < 0.05) {
    vel = 0;
    render(true);
    stopTick?.();
    stopTick = null;
  }
}

function onScroll() {
  idleFrames = 0;
  if (!stopTick) stopTick = onTick(tick);
}

/** Přepočet pozic sekcí mimo kritickou cestu interakce (ne v ResizeObserver callbacku před vykreslením). */
let measureTimer: number | undefined;
function scheduleMeasure() {
  clearTimeout(measureTimer);
  measureTimer = window.setTimeout(() => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(measure, { timeout: 500 });
    else measure();
  }, 150);
}

function start() {
  if (started) return;
  started = true;
  lastY = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", scheduleMeasure);
  new ResizeObserver(scheduleMeasure).observe(document.body);
}

function useHudView(view: React.RefObject<View>) {
  const pathname = usePathname();
  useEffect(() => {
    const v = view.current;
    views.add(v);
    start();
    scheduleMeasure();
    return () => {
      views.delete(v);
    };
  }, [view, pathname]);
}

/** Desktop: pevný panel v pravém dolním rohu (neklikatelný, ukáže se po opuštění hera) */
export function HudPanel() {
  const root = useRef<HTMLDivElement>(null);
  const code = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const velEl = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const view = useRef<View>({});
  useEffect(() => {
    view.current.root = root.current;
    view.current.code = code.current;
    view.current.label = label.current;
    view.current.pct = pct.current;
    view.current.vel = velEl.current;
    view.current.bar = bar.current;
  });
  useHudView(view);

  return (
    <div ref={root} aria-hidden data-shown="0" className="hud-panel micro-xs pointer-events-none fixed bottom-4 right-4 z-40 hidden w-56 border border-line bg-bg lg:block">
      <div className="flex justify-between border-b border-line px-3 py-1.5">
        <span ref={code} className="text-accent">
          SEC.00
        </span>
        <span ref={label} className="max-w-[9rem] truncate">
          ÚVOD
        </span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 px-3 py-1.5 text-muted">
        <dt>PROGRESS</dt>
        <dd ref={pct} className="text-right text-fg tabular-nums">
          00 %
        </dd>
        <dt>VEL</dt>
        <dd ref={velEl} className="text-right text-fg tabular-nums">
          0.0
        </dd>
      </dl>
      <div className="h-[3px] bg-line">
        <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}

/** Mobil: sekce + progress v horní liště */
export function HudMini() {
  const code = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const view = useRef<View>({});
  useEffect(() => {
    view.current.code = code.current;
    view.current.pct = pct.current;
    view.current.bar = bar.current;
  });
  useHudView(view);

  return (
    <>
      <span aria-hidden className="micro-xs flex flex-1 items-center justify-center gap-2 text-muted lg:hidden">
        <span ref={code} className="text-accent">
          SEC.00
        </span>
        <span ref={pct} className="tabular-nums">
          00 %
        </span>
      </span>
      <div aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] lg:hidden">
        <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </>
  );
}
