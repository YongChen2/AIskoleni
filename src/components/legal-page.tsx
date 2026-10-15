import { PageHero, Section } from "@/components/ui";

/** Šablona právní stránky. Text je vzor – před spuštěním ho musí zkontrolovat právník. */
export function LegalPage({
  code,
  title,
  lead,
  sections,
}: {
  code: string;
  title: string;
  lead: string;
  sections: { h: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <PageHero code={code} label="Právní informace" title={title} lead={lead} meta={[["Platnost od", "[DOPLNIT]"], ["Verze", "1.0"]]} />
      <Section className="pt-0! md:pt-0!">
        <p className="micro border border-accent px-4 py-3 text-accent">
          [!] Vzorový text. Místa označená [DOPLNIT] vyplňte a celý dokument nechte zkontrolovat právníkem.
        </p>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <ol className="micro hidden space-y-2 text-muted lg:col-span-3 lg:block">
            {sections.map((s, i) => (
              <li key={s.h}>
                {String(i + 1).padStart(2, "0")} {s.h}
              </li>
            ))}
          </ol>
          <div className="prose-body lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <section key={s.h} className="mb-12">
                <h2 className="macro-sm mb-4 border-t border-line pt-4">
                  <span className="micro mr-3 align-middle text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </h2>
                <div className="space-y-4 text-muted [&_strong]:font-normal [&_strong]:text-fg [&_ul]:list-['—_'] [&_ul]:space-y-1 [&_ul]:pl-6">
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
