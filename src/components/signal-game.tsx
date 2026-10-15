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
    <div className="border border-line">
      <div className="micro-xs flex justify-between border-b border-line px-3 py-2 text-muted">
        <span>[ ZTRACENÝ SIGNÁL / MINIHRA ]</span>
        <span>
          {playing ? `KOLO ${round}/${ROUNDS}` : finished ? "DOKONČENO" : "PŘIPRAVENO"}
        </span>
      </div>
      <div className="grid gap-px bg-line p-px" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={playing && target === i ? 0 : -1}
            aria-label={target === i ? "Signál – klikněte" : `Buňka ${i + 1}`}
            onClick={() => hit(i)}
            className={cx(
              "micro-xs aspect-square",
              target === i ? "bg-accent text-bg" : miss === i ? "bg-bg-2 text-accent" : "bg-bg text-line",
              playing ? "cursor-crosshair" : "cursor-default"
            )}
          >
            {target === i ? "●" : miss === i ? "✕" : "+"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-3" aria-live="polite">
        <p className="micro">
          {finished ? (
            <>
              Průměrná reakce: <output className="text-accent">{avg} ms</output>
              {avg < 400 ? " · Reflexy na úrovni stroje." : " · Na školení vás zrychlíme."}
            </>
          ) : playing ? (
            <span className="text-muted">Klikněte na červený signál, jakmile se objeví.</span>
          ) : (
            <span className="text-muted">Než najdete cestu zpět, chyťte signál.</span>
          )}
        </p>
        {!playing ? (
          <button type="button" className="btn" onClick={start}>
            {finished ? "[ Znovu ]" : "[ Spustit ]"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
