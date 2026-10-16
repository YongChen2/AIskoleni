"use client";

import { useEffect, useRef } from "react";
import { cx } from "./ui";

/**
 * Na mobilu vodorovné swipe karty (CSS scroll-snap, bez JS knihovny) s ukazatelem „02 / 03“.
 * Od `lg` se z kontejneru stane běžná mřížka (třídy předané v `gridClassName`).
 */
export function Swipe({
  count,
  children,
  className,
  gridClassName = "",
  label,
  ...rest
}: {
  count: number;
  children: React.ReactNode;
  className?: string;
  gridClassName?: string;
  label: string;
} & React.HTMLAttributes<HTMLOListElement>) {
  const list = useRef<HTMLOListElement>(null);
  const out = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let last = -1;
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null;
      const w = first ? first.offsetWidth + 1 : el.clientWidth;
      const i = Math.min(count - 1, Math.round(el.scrollLeft / w));
      if (i !== last && out.current) {
        last = i;
        out.current.textContent = `${String(i + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  return (
    <div className={className}>
      <ol
        ref={list}
        aria-label={label}
        className={cx("swipe flex gap-px overflow-x-auto border border-line bg-line lg:grid lg:overflow-visible", gridClassName)}
        {...rest}
      >
        {children}
      </ol>
      <p aria-hidden className="micro-xs mt-3 flex justify-between text-muted lg:hidden">
        <span>{"<<<"} SWIPE {">>>"}</span>
        <span ref={out} className="text-fg tabular-nums">
          01 / {String(count).padStart(2, "0")}
        </span>
      </p>
    </div>
  );
}
