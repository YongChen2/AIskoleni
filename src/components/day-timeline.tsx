"use client";

import { useEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/content/site";
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
        <div className="sticky top-28 border border-line">
          <div className="micro-xs flex justify-between border-b border-line px-4 py-2 text-muted">
            <span>[ LOG / ŠKOLICÍ DEN ]</span>
            <span>
              {String(active + 1).padStart(2, "0")}/{String(entries.length).padStart(2, "0")}
            </span>
          </div>
          <div className="p-6">
            <p className="micro text-accent">{current.tag}</p>
            <p className="macro mt-2 tabular-nums">
              <time>{current.time}</time>
            </p>
            <p className="micro mt-4">{current.title}</p>
            <p className="mt-3 h-[7.5rem] overflow-hidden text-[15px] text-muted">{current.text}</p>
          </div>
          <div className="h-2 overflow-hidden border-t border-line" aria-hidden>
            <div
              className="h-full origin-left bg-accent transition-transform duration-300 ease-[steps(6)]"
              style={{ transform: `scaleX(${(active + 1) / entries.length})` }}
            />
          </div>
        </div>
      </div>

      <ol className="border-t border-line lg:col-span-7">
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
              className={cx("border-b border-line", (expanded || hot) && "bg-bg-2")}
            >
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="grid min-h-14 w-full grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 px-3 py-5 text-left md:grid-cols-[6rem_1fr_auto] md:px-5"
              >
                <time className={cx("micro tabular-nums", hot ? "text-accent" : "text-muted")}>{e.time}</time>
                <span className="micro md:text-sm">
                  <span className="text-muted">{">>>"} </span>
                  {e.title}
                </span>
                <span className="micro-xs text-muted">{expanded ? "[−]" : "[+]"}</span>
              </button>
              {expanded ? (
                <p className="prose-body px-3 pb-6 pl-[calc(4.5rem+1.5rem)] text-muted md:px-5 md:pl-[calc(6rem+2rem)]">
                  <span className="micro-xs mb-2 block text-accent">{e.tag}</span>
                  {e.text}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
