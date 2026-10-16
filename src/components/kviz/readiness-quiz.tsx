"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { cx } from "@/components/ui";
import { haptic } from "@/lib/haptics";
import { play } from "@/lib/sound";
import { type Area, areas, questions, recommend } from "./questions";

const tone = (pct: number) => (pct >= 67 ? "success" : pct >= 34 ? "warning" : "danger");
const barColor = { success: "bg-success", warning: "bg-warning", danger: "bg-accent" } as const;

export function ReadinessQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);

  const finished = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const total = questions.reduce((s, x) => s + (answers[x.id] ?? 0), 0);
  const pct = Math.round((total / (questions.length * 3)) * 100);

  function choose(score: number) {
    haptic(12);
    play(step === questions.length - 1 ? "confirm" : "click");
    setAnswers((a) => ({ ...a, [q.id]: score }));
    setStep((s) => s + 1);
  }

  const byArea = (Object.keys(areas) as Area[]).map((a) => {
    const qs = questions.filter((x) => x.area === a);
    const sum = qs.reduce((s, x) => s + (answers[x.id] ?? 0), 0);
    return { area: a, pct: Math.round((sum / (qs.length * 3)) * 100) };
  });

  if (finished) {
    const rec = recommend(pct);
    const weakest = [...byArea].sort((a, b) => a.pct - b.pct)[0];
    const t = tone(pct);
    return (
      <div className="card-glow mx-auto max-w-4xl overflow-hidden [contain:layout_paint]" aria-live="polite">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-8">
          <p className="text-[15px] font-medium text-fg">Výsledek</p>
          <span className="badge badge-success badge-dot">Dokončeno</span>
        </div>
        <div className="p-5 md:p-8">
          <p className="text-[15px] text-muted">Stupeň připravenosti</p>
          <p className="mt-3 text-[clamp(3.5rem,8vw,6rem)] font-semibold leading-none tracking-[-0.05em] text-fg">
            <output>{pct}&nbsp;%</output>
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-tint/[0.07]" aria-hidden>
            <div className={cx("h-full origin-left rounded-full", barColor[t])} style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
        </div>
        <dl className="grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {byArea.map((a) => (
            <div key={a.area} className="bg-surface p-5 md:p-6">
              <dt className="text-[14px] text-muted">{areas[a.area]}</dt>
              <dd className="mt-2 flex items-center gap-2 text-[24px] font-semibold tracking-[-0.03em] text-fg">
                <data value={a.pct}>{a.pct} %</data>
                {a.area === weakest.area ? <span className="badge badge-danger text-[11px]">Nejslabší</span> : null}
              </dd>
              <dd className="mt-3 h-1 overflow-hidden rounded-full bg-tint/[0.07]" aria-hidden>
                <div className={cx("h-full origin-left rounded-full", barColor[tone(a.pct)])} style={{ transform: `scaleX(${a.pct / 100})` }} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Doporučený formát</p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.035em]">{rec.title}</h2>
            <p className="body mt-4">{rec.text}</p>
            <p className="body mt-4">
              Nejslabší oblast: <strong className="font-medium text-fg">{areas[weakest.area]}</strong>. Na tu se zaměříme nejdřív.
            </p>
          </div>
          <div className="flex flex-col gap-3 self-end lg:col-span-4 lg:col-start-9">
            <Link href={`/kontakt?format=${rec.slug}&skore=${pct}`} className="btn btn-primary">
              Probrat výsledek
              <span className="btn-arrow">
                <ArrowRight size={16} />
              </span>
            </Link>
            <Link href={`/skoleni#${rec.slug}`} className="btn btn-secondary">
              Detail formátu
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
            >
              Spustit znovu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-3xl overflow-hidden [contain:layout_paint]">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-8">
        <span className="badge">{areas[q.area]}</span>
        <span className="mono text-[13px] text-subtle">
          {step + 1} / {questions.length}
        </span>
      </div>
      <div className="flex gap-1 px-5 pt-5 md:px-8" aria-hidden>
        {questions.map((x, i) => (
          <span
            key={x.id}
            className={cx("h-1 flex-1 rounded-full transition-colors duration-300", i < step ? "bg-accent" : i === step ? "bg-fg/60" : "bg-tint/[0.08]")}
          />
        ))}
      </div>
      <fieldset key={q.id} data-sound="custom" className="p-5 md:p-8">
        <legend className="sr-only">Otázka {step + 1}</legend>
        <h2 className="max-w-[30ch] text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">{q.q}</h2>
        <div className="mt-8 grid gap-2.5">
          {q.options.map((o, i) => (
            <button
              key={o.label}
              type="button"
              onClick={() => choose(o.score)}
              data-active={answers[q.id] === o.score || undefined}
              className="choice group min-h-14 py-3 text-left text-[16px]"
            >
              <kbd className="mono inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-bg text-[12px] text-subtle transition-colors duration-200 group-hover:text-fg">
                {String.fromCharCode(65 + i)}
              </kbd>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
        {step > 0 ? (
          <button type="button" className="btn btn-ghost mt-5 -ml-3 min-h-11" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft size={16} />
            Zpět
          </button>
        ) : null}
      </fieldset>
    </div>
  );
}
