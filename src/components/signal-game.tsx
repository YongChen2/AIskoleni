"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "./ui";

const COLS = 8;
const ROWS = 5;
const ROUNDS = 8;

const randomDelay = () => 400 + Math.random() * 900;
const randomCell = () => Math.floor(Math.random() * COLS * ROWS);

/** Mini hra pro 404: chyť ztracený signál. Měří reakční čas. */
export function SignalGame() {
  const [target, setTarget] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [miss, setMiss] = useState<number | null>(null);
  const shownAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playing = round > 0 && round <= ROUNDS;
  const finished = round > ROUNDS;
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function next(r: number) {
    setTarget(null);
    if (r > ROUNDS) {
      setRound(r);
      return;
    }
    setRound(r);
    timer.current = setTimeout(() => {
      setTarget(randomCell());
      shownAt.current = performance.now();
    }, randomDelay());
  }

  function start() {
    setTimes([]);
    setMiss(null);
    next(1);
  }

  function hit(i: number) {
    if (!playing || target === null) return;
    if (i !== target) {
      setMiss(i);
      return;
    }
    setMiss(null);
    setTimes((t) => [...t, performance.now() - shownAt.current]);
    next(round + 1);
  }

  return (
    <div className="card-glow overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <p className="text-[15px] font-medium text-fg">Chyťte signál</p>
        <span className="mono text-[13px] text-subtle">
          {playing ? `Kolo ${round}/${ROUNDS}` : finished ? "Hotovo" : "Připraveno"}
        </span>
      </div>
      <div className="grid gap-1.5 p-4" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={playing && target === i ? 0 : -1}
            aria-label={target === i ? "Signál – klikněte" : `Buňka ${i + 1}`}
            onClick={() => hit(i)}
            className={cx(
              "aspect-square rounded-md border transition-colors duration-150",
              target === i
                ? "border-accent bg-accent shadow-[0_0_18px_rgba(255,59,59,0.55)]"
                : miss === i
                  ? "border-accent/40 bg-accent/10"
                  : "border-line bg-surface-2",
              playing ? "cursor-pointer" : "cursor-default"
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4" aria-live="polite">
        <p className="text-[14.5px] text-muted">
          {finished ? (
            <>
              Průměrná reakce: <output className="mono font-medium text-fg">{avg} ms</output>
              {avg < 400 ? " · Reflexy na úrovni stroje." : " · Na školení vás zrychlíme."}
            </>
          ) : playing ? (
            "Klikněte na červený čtverec, jakmile se objeví."
          ) : (
            "Než najdete cestu zpět, chyťte signál."
          )}
        </p>
        {!playing ? (
          <button type="button" className="btn btn-secondary btn-sm min-h-11 lg:min-h-9" onClick={start}>
            {finished ? "Znovu" : "Spustit"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
