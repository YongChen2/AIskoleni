"use client";

import { useEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/content/site";
import { Plus } from "./icons";
import { cx } from "./ui";

/**
 * Časová osa školicího dne.
 * Scroll mění jen zvýraznění a obsah sticky panelu (pevná výška → žádný layout shift).
 * Řádky se rozbalují jen na klik/tap – posun obsahu je pak vyvolaný uživatelem.
 */
export function DayTimeline({ entries }: { entries: TimelineEntry[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (items) => {
        for (const it of items) {
          if (it.isIntersecting) setActive(Number((it.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = entries[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="card-glow sticky top-28 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <span className="badge">{current.tag}</span>
            <span className="mono text-[13px] text-subtle">
              {active + 1} / {entries.length}
            </span>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[clamp(3rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] text-fg tabular-nums">
              <time>{current.time}</time>
            </p>
            <p className="title mt-5">{current.title}</p>
            <p className="body mt-3 h-[7.5rem] overflow-hidden text-[15px]">{current.text}</p>
          </div>
          <div className="mx-6 mb-6 h-1 overflow-hidden rounded-full bg-tint/[0.08]" aria-hidden>
            <div
              className="h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-[var(--ease)]"
              style={{ transform: `scaleX(${(active + 1) / entries.length})` }}
            />
          </div>
        </div>
      </div>

      <ol className="lg:col-span-7">
        {entries.map((e, i) => {
          const expanded = open === i;
          const hot = i === active;
          return (
            <li
              key={e.time}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="relative border-b border-line first:border-t"
            >
              <span
                aria-hidden
                className={cx(
                  "absolute -left-px top-0 h-full w-px bg-accent transition-opacity duration-300 ease-[var(--ease)]",
                  hot ? "opacity-100" : "opacity-0"
                )}
              />
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="grid min-h-16 w-full grid-cols-[4rem_1fr_auto] items-center gap-4 py-5 pl-4 pr-1 text-left md:grid-cols-[5rem_1fr_auto] md:pl-6"
              >
                <time className={cx("mono text-[14px] tabular-nums transition-colors duration-300", hot ? "text-accent-hover" : "text-subtle")}>
                  {e.time}
                </time>
                <span className={cx("text-[16px] font-medium transition-colors duration-300 md:text-[17px]", hot ? "text-fg" : "text-muted")}>
                  {e.title}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-transform duration-300 ease-[var(--ease)]",
                    expanded && "rotate-45"
                  )}
                >
                  <Plus size={15} />
                </span>
              </button>
              {expanded ? (
                <div className="pb-6 pl-[calc(4rem+2rem)] pr-12 md:pl-[calc(5rem+2.5rem)]">
                  <span className="badge mb-3">{e.tag}</span>
                  <p className="body text-[15px]">{e.text}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
