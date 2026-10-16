import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { coursesSchema } from "@/lib/schema";
import { CtaBlock } from "@/components/cta-block";
import { DayTimeline } from "@/components/day-timeline";
import { Check, FileText, Layers, Users } from "@/components/icons";
import { Badge, PageHero, Section, SectionHead, cx } from "@/components/ui";
import { formats, included, timeline } from "@/content/site";

export const metadata: Metadata = {
  title: "Formáty školení",
  description:
    "Úvodní workshop pro vedení, školení týmů podle rolí a průběžný rozvoj. Podívejte se, jak vypadá školicí den a co je vždy v ceně.",
  alternates: { canonical: "/skoleni" },
};

const includedIcons = [Layers, FileText, Users];

export default function SkoleniPage() {
  return (
    <>
      <PageHero
        label="Formáty"
        title={
          <>
            Tři <span className="hl">kroky</span>
          </>
        }
        lead="Začínáme s vedením, pokračujeme po týmech a pak držíme tempo. Každý krok funguje i samostatně, ale největší efekt mají dohromady."
        meta={[
          ["Moduly", "3 navazující"],
          ["Jazyk", "Čeština"],
          ["Místo", "U vás / online"],
          ["Výstup", "Report pro vedení"],
        ]}
      />

      <Section className="pt-8! lg:pt-12!">
        <ol className="space-y-4" data-reveal-group>
          {formats.map((f, idx) => (
            <li key={f.slug} id={f.slug} data-reveal className={cx("scroll-mt-24 p-6 md:p-10", idx === 0 ? "card-glow" : "card")}>
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <span className="mono inline-flex h-8 items-center rounded-lg border border-line bg-surface-2 px-2.5 text-[13px] text-muted">
                      {f.step}
                    </span>
                    <span className="label">Krok {idx + 1} ze 3</span>
                  </div>
                  <h2 className="mt-6 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.035em]">{f.title}</h2>
                  <p className="lead mt-4">{f.short}</p>
                  <Badge dot tone="success" className="mt-6">
                    {f.output}
                  </Badge>
                </div>
                <div className="lg:col-span-7">
                  <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                    {[
                      ["Pro koho", f.audience],
                      ["Rozsah", f.size],
                      ["Délka", f.duration],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-surface-2 px-4 py-3.5">
                        <dt className="label">{k}</dt>
                        <dd className="mt-1 text-[15px] text-fg">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {f.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[15px] text-muted">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-hover">
                          <Check size={12} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="den">
        <SectionHead
          eyebrow="Školicí den"
          title="Jak vypadá jeden den"
          lead="Ukázkový program úvodního dne. Skutečný program sestavíme podle vašich rolí a úloh."
        />
        <div className="mt-14 md:mt-20">
          <DayTimeline entries={timeline} />
        </div>
      </Section>

      <Section>
        <SectionHead title="Vždy v ceně" />
        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-3" data-reveal-group>
          {included.map((i, n) => {
            const Icon = includedIcons[n] ?? Layers;
            return (
              <li key={i.code} data-reveal className="card card-hover p-6 md:p-8">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent-hover">
                  <Icon size={20} />
                </span>
                <h3 className="title mt-6">{i.title}</h3>
                <p className="body mt-3 text-[15px]">{i.text}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <CtaBlock />
      <JsonLd data={coursesSchema} />
    </>
  );
}
