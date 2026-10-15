"use client";

import { animate } from "motion";
import { useEffect, useId, useRef, useState } from "react";
import { Section, SectionHead } from "@/components/ui";

const WEEKS = 46; // pracovní týdny v roce po odečtení dovolené a svátků

const fmt = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

/** Číslo, které se k nové hodnotě „dopočítá“ mechanicky po krocích. */
function Counter({ value, id, htmlFor }: { value: number; id?: string; htmlFor: string }) {
  const ref = useRef<HTMLOutputElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt.format(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: "linear",
      onUpdate: (v) => {
        el.textContent = fmt.format(Math.round(v / 10) * 10);
      },
      onComplete: () => {
        el.textContent = fmt.format(value);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return (
    <output ref={ref} id={id} htmlFor={htmlFor} className="tabular-nums">
      {fmt.format(value)}
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
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="micro text-muted">
          {label}
        </label>
        <span className="micro">
          <data value={value} className="text-lg">
            {fmt.format(value)}
          </data>{" "}
          <span className="text-muted">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-4"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="micro-xs mt-1 flex justify-between text-muted">
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
      <SectionHead code="SEC.04" label="Kalkulačka úspory" meta={`${WEEKS} PRACOVNÍCH TÝDNŮ / ROK`} />
      <h2 className="macro-md mt-10 max-w-[16ch] md:mt-16">Kolik vás stojí rutina?</h2>

      <div className="hairgrid mt-12 md:mt-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="micro border-b border-line px-4 py-3 text-muted md:px-6">[ OVLÁDACÍ PANEL ]</p>
          <Slider id={ids.people} label="Počet lidí" unit="osob" value={people} min={1} max={500} step={1} onChange={setPeople} />
          <div className="border-t border-line" />
          <Slider id={ids.hours} label="Rutina týdně / osoba" unit="h" value={hours} min={1} max={20} step={1} onChange={setHours} />
          <div className="border-t border-line" />
          <Slider id={ids.rate} label="Hodinová sazba" unit="Kč" value={rate} min={200} max={2500} step={50} onChange={setRate} />
          <div className="border-t border-line" />
          <Slider id={ids.share} label="Část rutiny, kterou AI zrychlí" unit="%" value={share} min={10} max={50} step={5} onChange={setShare} />
        </div>

        <div className="flex flex-col justify-between overflow-hidden lg:col-span-7">
          <div className="p-4 md:p-6">
            <p className="micro text-muted">{">>>"} Ušetřený čas za rok</p>
            <p className="macro mt-4 whitespace-nowrap text-[clamp(2.75rem,7.5vw,10rem)] leading-none">
              <Counter value={Math.round(hoursSaved)} htmlFor={inputs} />
              <span className="micro ml-3 align-top tracking-normal text-muted">HOD</span>
            </p>
          </div>
          <div className="border-t-2 border-accent p-4 md:p-6">
            <p className="micro text-muted">{">>>"} Hodnota této práce</p>
            <p className="macro mt-4 whitespace-nowrap text-[clamp(2.75rem,7.5vw,10rem)] leading-none text-accent">
              <Counter value={Math.round(money)} htmlFor={inputs} />
              <span className="micro ml-3 align-top tracking-normal text-muted">KČ</span>
            </p>
          </div>
          <p className="micro-xs border-t border-line p-4 text-muted md:px-6">
            Výpočet: lidé × hodiny týdně × {WEEKS} týdnů × podíl zrychlení. Orientační odhad, ne příslib. Reálné číslo
            změříme po školení na vašich úlohách.
          </p>
        </div>
      </div>
    </Section>
  );
}
