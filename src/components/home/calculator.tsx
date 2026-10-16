"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Section, SectionHead } from "@/components/ui";
import { loadEngine, prefersReducedMotion } from "@/lib/motion";

const WEEKS = 46; // pracovní týdny v roce po odečtení dovolené a svátků

const fmt = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

/** Číslo, které se k nové hodnotě plynule „dopočítá“ (sdílená smyčka gsap.ticker). */
function Counter({ value, id, htmlFor }: { value: number; id?: string; htmlFor: string }) {
  const ref = useRef<HTMLOutputElement>(null);
  const shown = useRef(value);
  // text v DOM po prvním renderu řídí jen animace – React by ho jinak na snímek přepsal na cílovou hodnotu
  const [initial] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      shown.current = value;
      el.textContent = fmt.format(value);
      return;
    }
    let kill: (() => void) | undefined;
    let cancelled = false;
    loadEngine().then(({ gsap }) => {
      if (cancelled) return;
      const o = { v: shown.current };
      const t = gsap.to(o, {
        v: value,
        duration: 0.6,
        ease: "expo.out",
        onUpdate: () => {
          shown.current = o.v;
          el.textContent = fmt.format(Math.round(o.v));
        },
      });
      kill = () => t.kill();
    });
    return () => {
      cancelled = true;
      kill?.();
    };
  }, [value]);

  return (
    <output ref={ref} id={id} htmlFor={htmlFor} className="tabular-nums">
      {fmt.format(initial)}
    </output>
  );
}

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  id,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  id: string;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] text-muted">
          {label}
        </label>
        <span className="text-[15px] text-fg">
          <data value={value} className="mono font-medium">
            {fmt.format(value)}
          </data>{" "}
          <span className="text-subtle">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-1"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mono -mt-1 flex justify-between text-[12px] text-subtle">
        <span>{fmt.format(min)}</span>
        <span>{fmt.format(max)}</span>
      </div>
    </div>
  );
}

export function Calculator() {
  const uid = useId();
  const [people, setPeople] = useState(20);
  const [hours, setHours] = useState(5);
  const [rate, setRate] = useState(600);
  const [share, setShare] = useState(25);

  const hoursSaved = people * hours * WEEKS * (share / 100);
  const money = hoursSaved * rate;
  const ids = {
    people: `${uid}-people`,
    hours: `${uid}-hours`,
    rate: `${uid}-rate`,
    share: `${uid}-share`,
  };
  const inputs = Object.values(ids).join(" ");

  return (
    <Section id="kalkulacka">
      <SectionHead
        title="Kolik vás stojí rutina?"
        lead="Posuňte jezdce podle svého týmu. Výsledek je orientační – reálné číslo změříme po školení na vašich úlohách."
      />

      <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12" data-reveal-group>
        <div data-reveal className="card space-y-7 p-6 md:p-8 lg:col-span-5">
          <Slider id={ids.people} label="Počet lidí" unit="osob" value={people} min={1} max={500} step={1} onChange={setPeople} />
          <Slider id={ids.hours} label="Rutina týdně na osobu" unit="h" value={hours} min={1} max={20} step={1} onChange={setHours} />
          <Slider id={ids.rate} label="Hodinová sazba" unit="Kč" value={rate} min={200} max={2500} step={50} onChange={setRate} />
          <Slider id={ids.share} label="Část rutiny, kterou AI zrychlí" unit="%" value={share} min={10} max={50} step={5} onChange={setShare} />
        </div>

        <div data-reveal className="card-glow relative isolate flex flex-col overflow-hidden p-6 md:p-10 lg:col-span-7">
          <div aria-hidden className="glow -z-10 -right-40 -top-40 h-[30rem] w-[30rem]" />
          <p className="text-[15px] text-muted">Hodnota práce, kterou AI zrychlí za rok</p>
          <p className="mt-3 whitespace-nowrap text-[clamp(2.75rem,6.5vw,5.25rem)] font-semibold leading-none tracking-[-0.045em] text-fg [contain:layout_paint]">
            <Counter value={Math.round(money)} htmlFor={inputs} />
            <span className="ml-3 text-[0.4em] font-medium tracking-[-0.02em] text-muted">Kč</span>
          </p>

          <div className="mt-10 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <p className="label">Ušetřený čas</p>
              <p className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-fg">
                <Counter value={Math.round(hoursSaved)} htmlFor={inputs} />
                <span className="ml-1.5 text-[0.6em] font-medium text-muted">h / rok</span>
              </p>
            </div>
            <div>
              <p className="label">Na osobu</p>
              <p className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-fg">
                <Counter value={Math.round(hoursSaved / people)} htmlFor={inputs} />
                <span className="ml-1.5 text-[0.6em] font-medium text-muted">h / rok</span>
              </p>
            </div>
          </div>
          <p className="label mt-auto pt-10">
            Výpočet: lidé × hodiny týdně × {WEEKS} týdnů × podíl zrychlení × sazba. Orientační odhad, ne příslib.
          </p>
        </div>
      </div>
    </Section>
  );
}
