"use client";

import { useEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/content/site";
import { cx } from "./ui";

/**
 * Časová osa školicího dne. Vlevo sticky panel s aktuálním časem,
 * vpravo log – záznam v polovině viewportu se automaticky rozbalí, kliknutím lze přepnout ručně.
 */
export function DayTimeline({ entries }: { entries: TimelineEntry[] }) {
  const [active, setActive] = useState(0);
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
  const progress = ((active + 1) / entries.length) * 100;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="sticky top-28 border border-line">
          <div className="micro-xs flex justify-between border-b border-line px-4 py-2 text-muted">
            <span>[ LOG / ŠKOLICÍ DEN ]</span>
            <span>
              {String(active + 1).padStart(2, "0")}/{String(entries.length).padStart(2, "0")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <p className="micro text-accent">{current.tag}</p>
            <p className="macro mt-2 tabular-nums" aria-live="polite">
              <time>{current.time}</time>
            </p>
            <p className="micro mt-4">{current.title}</p>
          </div>
          <div className="h-2 border-t border-line" aria-hidden>
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <ol className="border-t border-line lg:col-span-7">
        {entries.map((e, i) => {
          const open = i === active;
          return (
            <li
              key={e.time}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={cx("border-b border-line", open && "bg-bg-2")}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={open}
                className="grid w-full grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 px-3 py-5 text-left md:grid-cols-[6rem_1fr_auto] md:px-5"
              >
                <time className={cx("micro tabular-nums", open ? "text-accent" : "text-muted")}>{e.time}</time>
                <span className="micro md:text-sm">
                  <span className="text-muted">{">>>"} </span>
                  {e.title}
                </span>
                <span className="micro-xs text-muted">{open ? "[−]" : "[+]"}</span>
              </button>
              <div
                className={cx(
                  "grid transition-[grid-template-rows] duration-200 ease-[steps(4)]",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="prose-body px-3 pb-6 pl-[calc(4.5rem+1.5rem)] text-muted md:px-5 md:pl-[calc(6rem+2rem)]">
                    {e.text}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
