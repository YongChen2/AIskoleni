import { Badge, Section, SectionHead } from "@/components/ui";
import { stats, testimonials } from "@/content/site";

const missing = (v: string) => v.includes("[DOPLNIT]");

export function Proof() {
  return (
    <Section theme="light">
      <SectionHead title="Výsledky, které jdou změřit" lead="Po každém školení vedení dostane report. Tady jsou souhrnná čísla a hlas klientů." />

      <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:mt-20 lg:grid-cols-4" data-reveal-group>
        {stats.map((s) => (
          <div key={s.label} data-reveal className="flex flex-col bg-surface p-5 md:p-7">
            <dt className="order-2 mt-3 text-[15px] text-muted">{s.label}</dt>
            <dd className="order-1 text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-fg">
              {missing(s.value) ? <span className="text-subtle">—</span> : s.value}
            </dd>
            <dd className="order-3 mt-4">
              {missing(s.value) ? (
                <Badge tone="warning" dot className="h-auto whitespace-normal py-1 leading-snug">
                  [DOPLNIT] {s.note}
                </Badge>
              ) : (
                <span className="label">{s.note}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <figure key={i} className="card flex flex-col p-6 md:p-8">
            <svg width="28" height="20" viewBox="0 0 28 20" aria-hidden className="text-accent-hover">
              <path
                fill="currentColor"
                d="M0 20V12.2C0 5.5 3.6 1.4 10.3 0l1.2 2.6C7.8 3.8 6 6.1 5.8 9.2H11V20H0Zm16.5 0V12.2C16.5 5.5 20.1 1.4 26.8 0L28 2.6c-3.7 1.2-5.5 3.5-5.7 6.6h5.2V20h-11Z"
              />
            </svg>
            <blockquote className="mt-6 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-fg">{t.quote}</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-8">
              <span aria-hidden className="h-9 w-9 rounded-full border border-line bg-gradient-to-br from-surface-2 to-bg" />
              <span>
                <span className="block text-[15px] font-medium text-fg">{t.who}</span>
                <span className="block text-[13px] text-subtle">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
