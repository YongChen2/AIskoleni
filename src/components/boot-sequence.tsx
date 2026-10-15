"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/config/brand";
import { hasFinePointer, loadEngine } from "@/lib/motion";

export const BOOT_KEY = "boot-done";
const MAX_MS = 1500;

/**
 * Skript do <head>: rozhodne před prvním vykreslením, jestli boot poběží
 * (první návštěva v relaci, bez reduced-motion). Overlay je v HTML vždy, CSS ho ukáže jen s `html[data-boot]`.
 */
export const bootScript = `try{if(!sessionStorage.getItem("${BOOT_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.boot="run"}catch(e){}`;

type Line = { text: string; done: boolean };

const bar = (p: number) => {
  const n = Math.round(p * 8);
  return "█".repeat(n) + "░".repeat(8 - n);
};

export function BootSequence() {
  const pathname = usePathname();
  const [active] = useState(() => typeof document !== "undefined" && document.documentElement.dataset.boot === "run");
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<Line[]>([
    { text: "SYSTEM BOOT…", done: true },
    { text: "LOADING MODULES", done: false },
  ]);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let doneCount = 0;
    const tasks: [string, Promise<unknown>][] = [
      ["FONTS", document.fonts?.ready ?? Promise.resolve()],
      ["MODULES", loadEngine()],
      [
        "3D CORE",
        pathname === "/" && hasFinePointer() ? import("./hero3d/neural-canvas").catch(() => null) : Promise.resolve(),
      ],
    ];

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setProgress(1);
      setLines((l) => [...l.map((x) => ({ ...x, done: true })), { text: "NEURAL NET: ONLINE", done: true }]);
      try {
        sessionStorage.setItem(BOOT_KEY, "1");
      } catch {}
      // krátké podržení posledního řádku, pak odsunutí
      setTimeout(() => setLeaving(true), Math.max(0, Math.min(220, MAX_MS - (performance.now() - start))));
    };

    tasks.forEach(([name, p]) =>
      p.then(() => {
        doneCount++;
        setProgress(doneCount / (tasks.length + 1));
        setLines((l) => [...l, { text: `${name}: OK`, done: true }]);
        if (doneCount === tasks.length) finish();
      })
    );
    const hard = setTimeout(finish, MAX_MS - 250);
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(hard);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    // boot běží jen jednou při prvním načtení
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => {
      setGone(true);
      delete document.documentElement.dataset.boot;
    }, 450);
    return () => clearTimeout(t);
  }, [leaving]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="boot-overlay fixed inset-0 z-[150] flex-col justify-end bg-bg p-4 md:p-8"
      data-leaving={leaving || undefined}
    >
      <div className="micro-xs flex justify-between border-b border-line pb-2 text-muted">
        <span>
          {brand.name.toUpperCase()}
          {brand.mark}
          <span className="hidden sm:inline"> / {brand.revision}</span>
        </span>
        <span>[ PŘESKOČIT ]</span>
      </div>
      <div className="micro mt-4 h-[10rem] space-y-1 overflow-hidden text-[13px]">
        {lines.map((l, i) => (
          <p key={i} className={l.done ? "text-muted" : "text-fg"}>
            &gt; {l.text}
            {l.text === "LOADING MODULES" ? (
              <span className="whitespace-nowrap text-fg">
                {" "}
                [{bar(progress)}] {String(Math.round(progress * 100)).padStart(3, "\u00a0")}%
              </span>
            ) : null}
            {l.text.startsWith("NEURAL NET: ONLINE") ? <span className="text-accent"> ●</span> : null}
            {i === lines.length - 1 ? <span className="cursor-block ml-2" /> : null}
          </p>
        ))}
      </div>
      <div className="mt-6 h-1 bg-line">
        <div className="h-full origin-left bg-accent transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}
