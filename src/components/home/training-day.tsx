"use client";

import { useEffect, useRef, useState } from "react";
import { timeline, type TimelineEntry } from "@/content/site";
import { loadEngine, prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/components/ui";

/** Pět fází vizuálu → záznamy ze sdílené časové osy (/skoleni) */
const STAGE_TIMES = ["09:00", "10:30", "11:15", "14:15", "15:00"] as const;
const steps = STAGE_TIMES.map((t) => timeline.find((e) => e.time === t)).filter(Boolean) as TimelineEntry[];

const T = "transform 0.8s var(--ease), opacity 0.55s var(--ease)";
const show = (on: boolean, delay = 0, transform = "none", off = "scale(0.92)") => ({
  opacity: on ? 1 : 0,
  transform: on ? transform : off,
  transition: T,
  transitionDelay: on ? `${delay}ms` : "0ms",
});

const NODES = [
  [18, 22], [42, 14], [70, 20], [84, 44], [62, 40], [34, 42], [14, 60], [44, 70], [76, 72], [56, 86], [24, 86],
] as const;
const EDGES = [[0, 1], [1, 2], [2, 3], [1, 4], [4, 3], [0, 5], [5, 4], [5, 6], [6, 7], [7, 4], [7, 8], [8, 3], [7, 9], [9, 10], [10, 6], [8, 9]] as const;
const TASKS = [
  { label: "Nabídka", line: "3 přínosy pro klienta", fan: "translate(-118%, -36%) rotate(-7deg)" },
  { label: "E-mail", line: "Follow-up po schůzce", fan: "translate(-50%, -64%) rotate(1deg)" },
  { label: "Report", line: "Shrnutí pro poradu", fan: "translate(18%, -30%) rotate(8deg)" },
];
const TEMPLATE = ["Role", "Kontext", "Úkol", "Formát", "Omezení"];
const TICKS = 48;

/** Vizuál dne: jedna „scéna“, mezi fázemi se mění jen transform a opacity */
function Stage({ step, className }: { step: number; className?: string }) {
  const pct = useRef<HTMLSpanElement>(null);

  // 5. fáze: počítadlo 0 → 100 % souběžně s rozsvěcením dílků kruhu
  useEffect(() => {
    const el = pct.current;
    if (!el) return;
    if (step !== 4 || prefersReducedMotion()) {
      el.textContent = step === 4 ? "100" : "0";
      return;
    }
    let kill: (() => void) | undefined;
    loadEngine().then(({ gsap }) => {
      const o = { v: 0 };
      const t = gsap.to(o, { v: 100, duration: 0.9, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) });
      kill = () => t.kill();
    });
    return () => kill?.();
  }, [step]);

  return (
    <div
      data-theme="dark"
      aria-hidden
      className={cx("card-glow relative aspect-square w-full overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent)]" />
      {/* uzly sítě – pozadí všech fází, v 1. fázi plně */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ opacity: step === 0 ? 1 : 0.28, transition: T }}>
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke="var(--line-strong)" strokeWidth="0.3" />
        ))}
        {NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 4 === 1 ? 1.6 : 1.05}
            fill={i % 4 === 1 ? "var(--accent)" : "var(--fg)"}
            opacity={i % 4 === 1 ? 1 : 0.6}
          />
        ))}
      </svg>

      {/* 1: úvod – štítek „co dnes umíme“ */}
      <div className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-line bg-surface/90 p-4 text-center backdrop-blur-sm" style={show(step === 0, 120)}>
          <p className="mono text-[11px] uppercase tracking-[0.08em] text-subtle">09:00 · kalibrace</p>
          <p className="mt-2 text-[15px] font-medium text-fg">Kde jsme a co je možné</p>
        </div>
      </div>

      {/* 2: bezpečnost – semafor se rozsvítí */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-3 rounded-[28px] border border-line bg-surface p-4" style={show(step === 1, 0)}>
          {["var(--success)", "var(--warning)", "var(--accent)"].map((c, i) => (
            <span key={c} className="relative block h-14 w-14 rounded-full bg-surface-2">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: c,
                  boxShadow: `0 0 28px 4px color-mix(in srgb, ${c} 60%, transparent)`,
                  opacity: step === 1 ? 1 : 0,
                  transition: "opacity 0.4s var(--ease)",
                  transitionDelay: step === 1 ? `${250 + i * 220}ms` : "0ms",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* 3: karty úkolů přiletí; 4: složí se do šablony promptu */}
      {TASKS.map((t, i) => (
        <div
          key={t.label}
          className="absolute left-1/2 top-1/2 w-[42%] rounded-xl border border-line bg-surface p-3.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
          style={{
            opacity: step === 2 ? 1 : 0,
            transform: step === 2 ? t.fan : step === 3 ? "translate(-50%, -50%) scale(0.8)" : `translate(${-50 + (i - 1) * 140}%, 40%) rotate(${(i - 1) * 14}deg)`,
            transition: T,
            transitionDelay: step === 2 ? `${i * 90}ms` : "0ms",
          }}
        >
          <span className="badge">{t.label}</span>
          <p className="mt-2.5 text-[clamp(11.5px,1vw,13px)] font-medium leading-snug text-fg">{t.line}</p>
          <span className="mt-2.5 block h-1 w-3/4 rounded-full bg-tint/10" />
          <span className="mt-1.5 block h-1 w-1/2 rounded-full bg-tint/10" />
        </div>
      ))}
      <div className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-line-strong bg-surface p-4" style={show(step === 3, 260, "none", "scale(0.85)")}>
          <p className="mono text-[11px] uppercase tracking-[0.08em] text-subtle">Šablona promptu</p>
          <ul className="mt-3 space-y-2">
            {TEMPLATE.map((r, i) => (
              <li key={r} className="flex items-center gap-3" style={show(step === 3, 340 + i * 70, "none", "translateX(-8px)")}>
                <span className="w-16 text-[12px] font-medium text-accent-hover">{r}</span>
                <span className="h-1.5 flex-1 rounded-full bg-tint/10" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5: ověření – kruh z dílků doběhne na 100 % */}
      <div className="absolute inset-[16%]" style={show(step === 4, 0, "none", "scale(0.94)")}>
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 h-[9%] w-[2.2%] -translate-x-1/2 rounded-full"
            style={{
              transformOrigin: "50% 555%",
              rotate: `${(i / TICKS) * 360}deg`,
              background: "var(--accent)",
              opacity: step === 4 ? 1 : 0.12,
              transition: "opacity 0.25s var(--ease)",
              transitionDelay: step === 4 ? `${i * 16}ms` : "0ms",
            }}
          />
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-fg tabular-nums">
            <span ref={pct}>0</span> %
          </p>
          <p className="mt-2 text-[13px] text-muted">proškoleno · report pro vedení</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Scrollytelling „Jak probíhá školicí den“.
 * Desktop: sekce se pinne na ~4× výšku viewportu, průběh určuje aktivní krok (vlevo) a fázi vizuálu (vpravo).
 * Mobil: kroky pod sebou, každý s vlastním malým vizuálem a reveal animací.
 */
export function TrainingDay() {
  const pinned = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  // mobil: vizuál se rozehraje, až když je krok vidět
  const [seen, setSeen] = useState<number[]>([]);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let cleanup: (() => void) | undefined;
    let dead = false;
    const setup = async () => {
      cleanup?.();
      cleanup = undefined;
      if (!mq.matches) return;
      const { ScrollTrigger } = await loadEngine();
      if (dead || !mq.matches) return;
      const st = ScrollTrigger.create({
        trigger: pinned.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        onUpdate: (self) => {
          setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
          if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
        },
        onRefresh: () => window.dispatchEvent(new Event("theme:refresh")),
      });
      cleanup = () => st.kill(true);
    };
    void setup();
    mq.addEventListener("change", setup);

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setSeen((s) => (s.includes(+(e.target as HTMLElement).dataset.i!) ? s : [...s, +(e.target as HTMLElement).dataset.i!]))),
      { threshold: 0.5 }
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => {
      dead = true;
      mq.removeEventListener("change", setup);
      cleanup?.();
      io.disconnect();
    };
  }, []);

  const head = (
    <div data-reveal-block>
      <p className="eyebrow">Školicí den</p>
      <h2 className="display-2 mt-5">
        Jak probíhá <span className="hl">jeden den</span>
      </h2>
    </div>
  );

  return (
    <section data-theme="light" data-band="" aria-labelledby="den-title" className="relative">
      <span id="den-title" className="sr-only">
        Jak probíhá školicí den
      </span>

      {/* desktop: pin */}
      <div ref={pinned} className="hidden h-[100svh] items-center lg:flex">
        <div className="shell grid w-full grid-cols-12 items-center gap-10">
          <div className="col-span-5">
            {head}
            <div className="relative mt-10 pl-6">
              <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-tint/[0.08]" aria-hidden>
                <span ref={bar} className="absolute inset-0 origin-top rounded-full bg-accent" style={{ transform: "scaleY(0)" }} />
              </span>
              <ol className="space-y-1">
                {steps.map((s, i) => (
                  <li
                    key={s.time}
                    aria-current={i === step ? "step" : undefined}
                    className="flex items-baseline gap-4 py-2 transition-opacity duration-300"
                    style={{ opacity: i === step ? 1 : 0.42 }}
                  >
                    <time className={cx("mono w-12 shrink-0 text-[13px]", i === step ? "text-accent-hover" : "text-subtle")}>{s.time}</time>
                    <span className="text-[19px] font-semibold tracking-[-0.02em] text-fg">{s.title}</span>
                  </li>
                ))}
              </ol>
              {/* popis aktivního kroku: všechny texty v jedné buňce mřížky → pevná výška, žádný posun */}
              <div className="mt-6 grid">
                {steps.map((s, i) => (
                  <p key={s.time} className="body col-start-1 row-start-1 text-[16px]" style={{ ...show(i === step, 80, "none", "translateY(8px)") }}>
                    <span className="badge mb-3 flex w-fit">{s.tag}</span>
                    {s.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-6 col-start-7">
            <Stage step={step} className="mx-auto max-h-[72svh] max-w-[72svh]" />
          </div>
        </div>
      </div>

      {/* mobil a tablet: kroky pod sebou */}
      <div className="shell py-20 lg:hidden">
        {head}
        <ol className="mt-10 space-y-14">
          {steps.map((s, i) => (
            <li key={s.time} ref={(el) => void (items.current[i] = el)} data-i={i} data-reveal-block>
              <Stage step={seen.includes(i) ? i : -1} className="max-w-md" />
              <p className="mt-5 flex items-center gap-3">
                <time className="mono text-[13px] text-accent-hover">{s.time}</time>
                <span className="badge">{s.tag}</span>
              </p>
              <h3 className="title mt-2">{s.title}</h3>
              <p className="body mt-2 text-[16px]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
