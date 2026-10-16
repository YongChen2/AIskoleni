"use client";

import { useEffect, useRef } from "react";

/**
 * Běžící pás: obsah 2× za sebou, CSS animace translateX(-50 %) → nekonečná smyčka jen přes transform.
 * Mimo viewport pauza, na hover plynulé zpomalení (Web Animations playbackRate), reduced motion = statický řádek.
 */
export function Marquee({ items, reverse, seconds = 40 }: { items: string[]; reverse?: boolean; seconds?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-paused", !e.isIntersecting));
    io.observe(el);

    let raf = 0;
    const ease = (to: number) => {
      cancelAnimationFrame(raf);
      const anims = el.firstElementChild?.getAnimations() ?? [];
      const step = () => {
        let done = true;
        for (const a of anims) {
          const r = a.playbackRate + (to - a.playbackRate) * 0.12;
          a.updatePlaybackRate(Math.abs(r - to) < 0.01 ? to : r);
          if (Math.abs(r - to) >= 0.01) done = false;
        }
        if (!done) raf = requestAnimationFrame(step);
      };
      step();
    };
    const slow = () => ease(0.25);
    const fast = () => ease(1);
    el.addEventListener("pointerenter", slow);
    el.addEventListener("pointerleave", fast);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", slow);
      el.removeEventListener("pointerleave", fast);
    };
  }, []);

  const row = items.map((t) => (
    <span key={t} className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12">
      {t}
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
    </span>
  ));

  return (
    <div ref={ref} aria-hidden className="marquee overflow-hidden">
      <div className="marquee-track flex w-max" data-reverse={reverse || undefined} style={{ animationDuration: `${seconds}s` }}>
        {row}
        {row}
      </div>
    </div>
  );
}
