import { Section, SectionHead } from "@/components/ui";
import { faq } from "@/content/site";

export function Faq() {
  return (
    <Section id="faq">
      <SectionHead code="SEC.06" label="Časté dotazy" meta={`${faq.length} ZÁZNAMŮ`} />
      <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-12">
        <h2 className="macro-md lg:col-span-4">FAQ</h2>
        <div className="border-t border-line lg:col-span-8">
          {faq.map((f, i) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-baseline gap-4 py-5 hover:text-accent [&::-webkit-details-marker]:hidden">
                <span className="micro-xs text-muted">Q.{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg">{f.q}</span>
                <span aria-hidden className="micro text-accent group-open:hidden">[+]</span>
                <span aria-hidden className="micro hidden text-accent group-open:inline">[−]</span>
              </summary>
              <p className="prose-body pb-6 pl-10 text-muted md:pl-12">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
