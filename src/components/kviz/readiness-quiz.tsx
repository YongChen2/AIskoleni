"use client";

import Link from "next/link";
import { useState } from "react";
import { cx } from "@/components/ui";
import { type Area, areas, questions, recommend } from "./questions";

export function ReadinessQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);

  const finished = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const total = questions.reduce((s, x) => s + (answers[x.id] ?? 0), 0);
  const pct = Math.round((total / (questions.length * 3)) * 100);

  function choose(score: number) {
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
    return (
      <div className="border border-line" aria-live="polite">
        <div className="micro-xs flex justify-between border-b border-line px-3 py-2 text-muted md:px-5">
          <span>[ REPORT / DIAGNOSTIKA DOKONČENA ]</span>
          <span>{questions.length}/{questions.length}</span>
        </div>
        <div className="p-4 md:p-8">
          <p className="micro text-muted">Stupeň připravenosti</p>
          <p className="macro mt-4 leading-none">
            <output>{pct}&nbsp;%</output>
          </p>
          <div className="mt-6 h-3 border border-line" aria-hidden>
            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <dl className="hairgrid border-x-0 sm:grid-cols-2 lg:grid-cols-4">
          {byArea.map((a) => (
            <div key={a.area} className="p-4 md:p-6">
              <dt className="micro text-muted">{areas[a.area]}</dt>
              <dd className={cx("macro-sm mt-3", a.area === weakest.area && "text-accent")}>
                <data value={a.pct}>{a.pct} %</data>
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-8 p-4 md:p-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="micro text-accent">{">>>"} Doporučený formát</p>
            <h3 className="macro-md mt-4">{rec.title}</h3>
            <p className="prose-body mt-4">{rec.text}</p>
            <p className="prose-body mt-4 text-muted">
              Nejslabší oblast: <strong className="font-normal text-fg">{areas[weakest.area]}</strong>. Na tu se
              zaměříme nejdřív.
            </p>
          </div>
          <div className="flex flex-col gap-3 self-end lg:col-span-4 lg:col-start-9">
            <Link
              href={`/kontakt?format=${rec.slug}&skore=${pct}`}
              className="btn btn-accent"
            >
              [ Probrat výsledek ]
            </Link>
            <Link href={`/skoleni#${rec.slug}`} className="btn">
              [ Detail formátu ]
            </Link>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
            >
              [ Spustit znovu ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-line">
      <div className="micro-xs flex justify-between border-b border-line px-3 py-2 text-muted md:px-5">
        <span>
          [ DIAGNOSTIKA / {areas[q.area].toUpperCase()} ]
        </span>
        <span>
          {String(step + 1).padStart(2, "0")}/{String(questions.length).padStart(2, "0")}
        </span>
      </div>
      <div className="flex h-1 gap-px bg-line" aria-hidden>
        {questions.map((x, i) => (
          <span key={x.id} className={cx("flex-1", i < step ? "bg-accent" : i === step ? "bg-fg" : "bg-bg")} />
        ))}
      </div>
      <fieldset key={q.id} className="p-4 md:p-8">
        <legend className="sr-only">Otázka {step + 1}</legend>
        <p className="micro text-muted">Q.{String(step + 1).padStart(2, "0")}</p>
        <h3 className="macro-sm mt-4 max-w-[28ch]">{q.q}</h3>
        <div className="mt-8 grid gap-px border border-line bg-line">
          {q.options.map((o, i) => (
            <button
              key={o.label}
              type="button"
              onClick={() => choose(o.score)}
              className={cx(
                "flex items-baseline gap-4 bg-bg px-4 py-4 text-left hover:bg-fg hover:text-bg",
                answers[q.id] === o.score && "text-accent"
              )}
            >
              <kbd className="micro-xs text-muted">{String.fromCharCode(65 + i)}</kbd>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
        {step > 0 ? (
          <button type="button" className="micro mt-6 text-muted hover:text-fg" onClick={() => setStep((s) => s - 1)}>
            {"<<<"} Zpět
          </button>
        ) : null}
      </fieldset>
    </div>
  );
}
