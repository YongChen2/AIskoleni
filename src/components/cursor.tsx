"use client";

import { useEffect, useRef, useState } from "react";
import { hasFinePointer, loadEngine, prefersReducedMotion } from "@/lib/motion";

const INTERACTIVE = "a, button, summary, label, select, [role='button'], input[type='range'], input[type='radio'], input[type='checkbox'], [draggable='true']";
const TEXT_INPUT = "input:not([type='range']):not([type='radio']):not([type='checkbox']), textarea, [contenteditable='true']";
const TEXT = "p, li, h1, h2, h3, dd, dt, blockquote, samp, td, th, figcaption";

type Mode = "cross" | "frame" | "text" | "native";

/**
 * Vlastní kurzor – zaměřovač se souřadnicemi, nad prvky hranatý rámeček, nad textem úzký kurzor.
 * Jen pro myš a bez reduced-motion. Pohyb přes transform na sdílené smyčce, jen když se hýbe.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const corners = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(hasFinePointer() && !prefersReducedMotion());
    const id = window.setTimeout(update, 0);
    mq.addEventListener("change", update);
    return () => {
      clearTimeout(id);
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const el = root.current!;
    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let mode: Mode = "cross";
    let rect: DOMRect | null = null;
    let frame = { x: 0, y: 0, w: 0, h: 0 };
    let running = false;
    let lastLabel = "";
    let gsapRef: Awaited<ReturnType<typeof loadEngine>>["gsap"] | null = null;

    const setMode = (m: Mode) => {
      if (m === mode) return;
      mode = m;
      el.dataset.mode = m;
    };

    const tick = (_t: number, dt: number) => {
      const k = 1 - Math.pow(1 - 0.35, dt / 16.67); // lerp nezávislý na fps
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      cross.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      const l = `X:${String(Math.max(0, Math.round(target.x))).padStart(4, "0")} Y:${String(Math.max(0, Math.round(target.y))).padStart(4, "0")}`;
      if (l !== lastLabel) {
        label.current!.textContent = l;
        lastLabel = l;
      }

      // rámeček: 4 rohy se posouvají k rohům prvku
      const f = mode === "frame" && rect ? { x: rect.left - 6, y: rect.top - 6, w: rect.width + 12, h: rect.height + 12 } : { x: pos.x, y: pos.y, w: 0, h: 0 };
      frame = {
        x: frame.x + (f.x - frame.x) * k,
        y: frame.y + (f.y - frame.y) * k,
        w: frame.w + (f.w - frame.w) * k,
        h: frame.h + (f.h - frame.h) * k,
      };
      const pts = [
        [frame.x, frame.y],
        [frame.x + frame.w, frame.y],
        [frame.x, frame.y + frame.h],
        [frame.x + frame.w, frame.y + frame.h],
      ];
      corners.current.forEach((c, i) => {
        if (c) c.style.transform = `translate3d(${pts[i][0]}px, ${pts[i][1]}px, 0)`;
      });

      const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1 && Math.abs(f.x - frame.x) < 0.1 && Math.abs(f.w - frame.w) < 0.1;
      if (settled && gsapRef) {
        gsapRef.ticker.remove(tick);
        running = false;
      }
    };

    const wake = () => {
      if (running || !gsapRef) return;
      running = true;
      gsapRef.ticker.add(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (el.dataset.hidden) {
        delete el.dataset.hidden;
        pos.x = target.x;
        pos.y = target.y;
      }
      const t = e.target as Element | null;
      const inter = t?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (t?.closest?.(TEXT_INPUT) || t?.closest?.("canvas")) {
        setMode("native");
      } else if (inter) {
        rect = inter.getBoundingClientRect();
        setMode("frame");
      } else if (t?.closest?.(TEXT)) {
        setMode("text");
      } else {
        setMode("cross");
      }
      wake();
    };
    const onScroll = () => {
      if (mode === "frame") {
        rect = null;
        setMode("cross");
        wake();
      }
    };
    const onLeave = () => {
      el.dataset.hidden = "1";
    };

    let cancelled = false;
    loadEngine().then(({ gsap }) => {
      if (cancelled) return;
      gsapRef = gsap;
      html.classList.add("has-cursor");
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    });

    return () => {
      cancelled = true;
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsapRef?.ticker.remove(tick);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} className="cursor-root" data-mode="cross" data-hidden="1" aria-hidden>
      <div ref={cross} className="cursor-cross">
        <span className="cursor-plus">+</span>
        <span className="cursor-bar" />
        <span ref={label} className="cursor-label">
          X:0000 Y:0000
        </span>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          ref={(n) => {
            corners.current[i] = n;
          }}
          className="cursor-corner"
          data-corner={i}
        />
      ))}
    </div>
  );
}
