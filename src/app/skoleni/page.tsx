import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { DayTimeline } from "@/components/day-timeline";
import { PageHero, Section, SectionHead } from "@/components/ui";
import { formats, included, timeline } from "@/content/site";

export const metadata: Metadata = {
  title: "Formáty školení",
  description:
    "Úvodní workshop pro vedení, školení týmů podle rolí a průběžný rozvoj. Podívejte se, jak vypadá školicí den a co je vždy v ceně.",
  alternates: { canonical: "/skoleni" },
};

export default function SkoleniPage() {
  return (
    <>
      <PageHero
        code="SEC.10"
        label="Formáty"
        title={
          <>
            Tři <span className="text-accent">kroky</span>
          </>
        }
        lead="Začínáme s vedením, pokračujeme po týmech a pak držíme tempo. Každý krok funguje i samostatně, ale největší efekt mají dohromady."
        meta={[
          ["Moduly", "03"],
          ["Jazyk", "Čeština"],
          ["Místo", "U vás / online"],
          ["Výstup", "Report pro vedení"],
        ]}
      />

      {formats.map((f, idx) => (
        <Section key={f.slug} id={f.slug} className="scroll-mt-24">
          <SectionHead code={`MOD.${f.step}`} label={`Krok ${idx + 1}`} meta={f.output} />
          <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p aria-hidden className="macro text-line">{f.step}</p>
              <h2 className="macro-md mt-4">{f.title}</h2>
            </div>
            <div className="lg:col-span-7">
              <p className="prose-body text-lg">{f.short}</p>
              <dl className="hairgrid micro mt-10 grid-cols-2">
                {[
                  ["Pro koho", f.audience],
                  ["Rozsah", f.size],
                  ["Délka", f.duration],
                  ["Výstup", f.output],
                ].map(([k, v]) => (
                  <div key={k} className="p-4">
                    <dt className="text-muted">{k}</dt>
                    <dd className="mt-2">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-10 space-y-3">
                {f.points.map((p) => (
                  <li key={p} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="micro pt-1 text-accent">{">>>"}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      <Section id="den">
        <SectionHead code="SEC.11" label="Jak vypadá školicí den" meta="09:00 — 15:30" />
        <h2 className="macro-md mt-10 max-w-[14ch] md:mt-16">Jeden den, záznam po záznamu</h2>
        <p className="prose-body mt-6 text-muted">
          Ukázkový program úvodního dne. Skutečný program sestavíme podle vašich rolí a úloh.
        </p>
        <div className="mt-12 md:mt-20">
          <DayTimeline entries={timeline} />
        </div>
      </Section>

      <Section>
        <SectionHead code="SEC.12" label="Vždy v ceně" />
        <ul className="hairgrid mt-12 md:mt-16 md:grid-cols-3">
          {included.map((i) => (
            <li key={i.code} className="p-5 md:p-8">
              <p className="micro text-accent">{i.code}</p>
              <h3 className="macro-sm mt-8">{i.title}</h3>
              <p className="mt-4 text-muted">{i.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBlock />
    </>
  );
}
