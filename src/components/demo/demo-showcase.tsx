"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Sparkle } from "@/components/icons";
import { cx } from "@/components/ui";
import { buildPrompt, demoRoles } from "@/content/demo";
import { prefersReducedMotion } from "@/lib/motion";
import { play } from "@/lib/sound";
import { DemoFrame } from "./demo-frame";

const STREAM_MS = 2000;

/**
 * Simulovaný stream: text se vypíše za ~2 s bez ohledu na délku.
 * Spustí se při změně `runKey`, `skip()` ho dokončí hned. Reduced motion = celý text okamžitě.
 */
function useStream(length: number, runKey: string | null) {
  const [shown, setShown] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (runKey === null) return;
    if (prefersReducedMotion()) {
      setShown(Infinity);
      return;
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / STREAM_MS);
      setShown(p >= 1 ? Infinity : Math.round(p * length));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    setShown(0);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [runKey, length]);

  const skip = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setShown(Infinity);
  }, []);

  return { shown, skip, streaming: runKey !== null && shown < length };
}

export default function DemoShowcase() {
  const [roleId, setRoleId] = useState(demoRoles[0].id);
  const [taskIdx, setTaskIdx] = useState(0);
  const [variant, setVariant] = useState<0 | 1>(0);
  const [started, setStarted] = useState(false);
  const [toast, setToast] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number>(undefined);

  const role = demoRoles.find((r) => r.id === roleId)!;
  const task = role.tasks[taskIdx];
  const current = task.variants[variant];
  const prompt = buildPrompt(task, current);

  const runKey = started ? `${roleId}/${task.id}/${variant}` : null;
  const { shown, skip, streaming } = useStream(current.output.length, runKey);

  // První výstup se začne vypisovat, až když je okno vidět
  useEffect(() => {
    const el = outRef.current;
    if (!el || started) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function pick(fn: () => void) {
    play("click");
    setStarted(true);
    fn();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      play("confirm");
      setToast(true);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(false), 1800);
    } catch {
      setToast(false);
    }
  }

  const visible = started ? current.output.slice(0, shown) : "";

  return (
    <>
      <DemoFrame right={<span className="badge">Ukázka</span>}>
        {/* Role */}
        <fieldset className="border-b border-line">
          <legend className="sr-only">Vyberte roli</legend>
          <div className="swipe flex gap-1 overflow-x-auto px-3 py-2.5 md:px-4" role="presentation">
            {demoRoles.map((r) => (
              <label
                key={r.id}
                className={cx(
                  "inline-flex min-h-10 shrink-0 cursor-pointer items-center rounded-[9px] px-3.5 text-[14px] font-medium transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                  roleId === r.id ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name="demo-role"
                  value={r.id}
                  checked={roleId === r.id}
                  onChange={() =>
                    pick(() => {
                      setRoleId(r.id);
                      setTaskIdx(0);
                      setVariant(0);
                    })
                  }
                  className="sr-only"
                />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Úkoly */}
        <fieldset className="border-b border-line px-4 py-4 md:px-6">
          <legend className="sr-only">Vyberte úkol</legend>
          <p className="label mb-3" aria-hidden>
            Vyberte úkol
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {role.tasks.map((t, i) => (
              <label
                key={t.id}
                className="choice min-h-12 text-[14.5px] font-medium"
                data-active={i === taskIdx ? "" : undefined}
              >
                <input
                  type="radio"
                  name="demo-task"
                  value={t.id}
                  checked={i === taskIdx}
                  onChange={() =>
                    pick(() => {
                      setTaskIdx(i);
                      setVariant(0);
                    })
                  }
                  className="sr-only"
                />
                {t.title}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid lg:grid-cols-12">
          {/* Konverzace */}
          <div className="border-b border-line p-4 md:p-6 lg:col-span-7 lg:border-b-0 lg:border-r">
            <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-3 text-[15px] text-fg">
              {task.ask}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 text-[14px] font-medium text-fg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent-hover">
                  <Sparkle size={15} />
                </span>
                Odpověď AI
              </span>
              <div
                role="group"
                aria-label="Varianta výstupu"
                className="inline-flex rounded-[11px] border border-line bg-surface-2 p-1"
              >
                {task.variants.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    aria-pressed={variant === i}
                    onClick={() => pick(() => setVariant(i as 0 | 1))}
                    className={cx(
                      "min-h-9 rounded-[8px] px-3 text-[13.5px] font-medium transition-colors duration-200",
                      variant === i ? "bg-white/[0.08] text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    <span className="text-subtle">{i === 0 ? "A" : "B"} ·</span> {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Výstup: neviditelná kopie obou variant drží výšku → stream nic neposouvá */}
            <div
              ref={outRef}
              onClick={streaming ? skip : undefined}
              className={cx("relative mt-4 grid text-[15px] leading-relaxed", streaming && "cursor-pointer")}
            >
              {task.variants.map((v) => (
                <p key={v.label} aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre-wrap">
                  {v.output}
                </p>
              ))}
              <samp aria-hidden className="col-start-1 row-start-1 block whitespace-pre-wrap font-sans text-muted">
                {visible}
                {streaming ? <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-accent" /> : null}
              </samp>
              <p className="sr-only" aria-live="polite">
                {started ? current.output : ""}
              </p>
            </div>
            <div className="mt-4 flex min-h-9 items-center">
              {streaming ? (
                <button type="button" onClick={skip} className="btn btn-ghost btn-sm min-h-9 px-0 text-[13px] text-subtle">
                  Zobrazit celé
                </button>
              ) : null}
            </div>
          </div>

          {/* Hotový prompt */}
          <div className="flex flex-col p-4 md:p-6 lg:col-span-5">
            <div className="flex min-h-11 items-center justify-between gap-3">
              <p className="text-[14px] font-medium text-fg">Hotový prompt</p>
              <button type="button" onClick={copy} className="btn btn-secondary btn-sm min-h-11 lg:min-h-9">
                {toast ? <Check size={15} /> : <Copy size={15} />}
                Kopírovat prompt
              </button>
            </div>
            <samp className="inset mt-3 block flex-1 whitespace-pre-wrap p-4 font-mono text-[12.5px] leading-relaxed text-muted">
              {prompt}
            </samp>
            <p className="mt-3 text-[13px] text-subtle">
              Prompt je rozdělený na roli, kontext, úkol, formát a omezení. Stačí doplnit vlastní údaje.
            </p>
          </div>
        </div>
      </DemoFrame>
      {createPortal(
        <div
          role="status"
          aria-live="polite"
          className={cx(
            "pointer-events-none fixed inset-x-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] lg:bottom-8",
            toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-2 px-4 py-2.5 text-[14px] font-medium text-fg shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
            <Check size={16} className="text-success" />
            {toast ? "Zkopírováno" : ""}
          </span>
        </div>,
        document.body,
      )}
    </>
  );
}
