"use client";

import { useEffect, useRef } from "react";
import { loadEngine, prefersReducedMotion } from "@/lib/motion";

/** Čísla v textu („4“, „6–12“, „4,8 / 5“, „1 250+“) → části a cílové hodnoty (čeština: desetinná čárka, mezera jako oddělovač tisíců). */
function parse(text: string) {
  const re = /\d{1,3}(?:[  ]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
  const nums: { v: number; dec: number }[] = [];
  const parts = text.split(re);
  for (const m of text.match(re) ?? []) {
    const [i, d = ""] = m.replace(/[  ]/g, "").split(",");
    nums.push({ v: Number(`${i}.${d || 0}`), dec: d.length });
  }
  return { parts, nums };
}

const fmt = (v: number, dec: number) =>
  new Intl.NumberFormat("cs-CZ", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);

/**
 * Odpočet od 0 při prvním vstupu do viewportu (ease-out, jednou, sdílená smyčka gsap.ticker).
 * SSR vypíše cílovou hodnotu. Nuluje se jen prvek pod ohybem → nad ohybem nic nebliká; reduced motion = rovnou cíl.
 */
export function CountUp({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const { parts, nums } = parse(value);
    if (!el || !nums.length || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const render = (k: number) => {
      el.textContent = parts.map((p, i) => p + (i < nums.length ? fmt(nums[i].v * k, nums[i].dec) : "")).join("");
    };
    render(0);
    let kill: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        loadEngine().then(({ gsap }) => {
          const o = { k: 0 };
          const t = gsap.to(o, { k: 1, duration, ease: "power3.out", onUpdate: () => render(o.k), onComplete: () => render(1) });
          kill = () => t.kill();
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      kill?.();
      el.textContent = value;
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
}
