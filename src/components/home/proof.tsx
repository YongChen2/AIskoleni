import { Section, SectionHead, Tag } from "@/components/ui";
import { stats, testimonials } from "@/content/site";

export function Proof() {
  return (
    <Section>
      <SectionHead code="SEC.05" label="Reference" meta="DATA K DOPLNĚNÍ" />
      <dl className="hairgrid mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col p-5 md:p-8">
            <dt className="micro text-muted">{s.label}</dt>
            <dd className="macro-md mt-6 break-words">
              {s.value === "[DOPLNIT]" ? <span className="text-line">[—]</span> : s.value}
            </dd>
            <dd className="micro-xs mt-4 text-muted">
              {s.value === "[DOPLNIT]" ? <Tag accent>[DOPLNIT] {s.note}</Tag> : s.note}
            </dd>
          </div>
        ))}
      </dl>

      <div className="hairgrid mt-px md:grid-cols-2">
        {testimonials.map((t, i) => (
          <figure key={i} className="p-5 md:p-8">
            <p className="micro-xs text-muted">REF.{String(i + 1).padStart(2, "0")}</p>
            <blockquote className="mt-4 text-lg">„{t.quote}“</blockquote>
            <figcaption className="micro mt-6">
              {t.who} <span className="text-muted">/ {t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
