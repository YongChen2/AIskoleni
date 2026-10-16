"use client";

import { useEffect, useRef } from "react";
import { cx } from "./ui";

/**
 * Na mobilu vodorovné swipe karty (CSS scroll-snap, bez JS knihovny) s tečkovým ukazatelem.
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
  const dots = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let last = 0;
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null;
      const w = first ? first.offsetWidth + 12 : el.clientWidth;
      const i = Math.min(count - 1, Math.round(el.scrollLeft / w));
      if (i !== last && dots.current) {
        dots.current.children[last]?.removeAttribute("data-on");
        dots.current.children[i]?.setAttribute("data-on", "");
        last = i;
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
        className={cx(
          "swipe -mx-5 flex gap-3 overflow-x-auto scroll-px-5 px-5 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:grid lg:gap-4 lg:overflow-visible lg:px-0",
          gridClassName
        )}
        {...rest}
      >
        {children}
      </ol>
      <span ref={dots} aria-hidden className="mt-5 flex justify-center gap-1.5 lg:hidden">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            data-on={i === 0 ? "" : undefined}
            className="h-1.5 w-1.5 rounded-full bg-fg opacity-20 transition-opacity duration-300 ease-[var(--ease)] data-[on]:opacity-100"
          />
        ))}
      </span>
    </div>
  );
}
