import { PageHero, Section } from "@/components/ui";

/** Šablona právní stránky. Text je vzor – před spuštěním ho musí zkontrolovat právník. */
export function LegalPage({
  title,
  lead,
  sections,
}: {
  title: string;
  lead: string;
  sections: { h: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <PageHero label="Právní informace" title={title} lead={lead} meta={[["Platnost od", "[DOPLNIT]"], ["Verze", "1.0"]]} />
      <Section className="pt-0! lg:pt-0!">
        <p className="flex gap-3 rounded-xl border border-warning/30 bg-warning/[0.06] px-4 py-3 text-[14.5px] text-warning">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
          Vzorový text. Místa označená [DOPLNIT] vyplňte a celý dokument nechte zkontrolovat právníkem.
        </p>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <nav aria-label="Obsah dokumentu" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-28 space-y-1">
              {sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#cast-${i + 1}`} className="flex gap-3 rounded-lg px-3 py-2 text-[14px] text-muted transition-colors duration-200 hover:bg-white/[0.04] hover:text-fg">
                    <span className="mono text-subtle">{i + 1}</span>
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-[65ch] lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <section key={s.h} id={`cast-${i + 1}`} className="mb-12 scroll-mt-24">
                <h2 className="mb-4 flex items-baseline gap-3 text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-[-0.025em]">
                  <span className="mono text-[14px] font-normal text-subtle">{i + 1}</span>
                  {s.h}
                </h2>
                <div className="space-y-4 text-muted [&_strong]:font-medium [&_strong]:text-fg [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:marker:text-subtle">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
