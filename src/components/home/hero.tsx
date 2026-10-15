import { ButtonLink, Corners } from "@/components/ui";
import { brand } from "@/config/brand";

const meta: [string, string][] = [
  ["Formát", "Prezenčně / online"],
  ["Skupina", "6–12 osob"],
  ["Jazyk", "Čeština"],
  ["Nástroje", "ChatGPT · Claude · Copilot · Gemini"],
];

export function Hero({ visual }: { visual?: React.ReactNode }) {
  return (
    <section data-hud-code="SEC.00" data-hud-label="Řídicí panel" className="relative isolate overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {visual}
      </div>

      <div className="relative mx-4 my-4 min-h-[calc(100svh-5.5rem)] border border-line md:mx-8 md:my-8 md:min-h-[calc(100svh-10rem)]">
        <Corners />
        <div className="micro-xs flex flex-wrap justify-between gap-2 border-b border-line px-3 py-2 text-muted md:px-5">
          <span>
            <span className="text-accent">SEC.00</span> {"///"} [ ŘÍDICÍ PANEL ]
          </span>
          <span className="hidden sm:inline">UNIT / {brand.code}-01 · {brand.revision}</span>
          <span data-hud-coords>X 0000 · Y 0000</span>
        </div>

        <div className="flex min-h-[inherit] flex-col justify-end gap-10 px-3 pb-6 pt-16 md:px-5 md:pb-8">
          <h1 className="macro">
            <span className="block">Licence máte.</span>
            <span className="block text-accent">Výsledky</span>
            <span className="block">zatím ne.</span>
          </h1>

          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6">
              <p className="prose-body text-base md:text-lg">
                Školíme firemní týmy, aby AI používaly na svou skutečnou práci: nabídky, e-maily, reporty a analýzy.
                Podle rolí, na vašich úlohách a s jasnými pravidly pro data.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/kontakt" accent>
                  Domluvit školení
                </ButtonLink>
                <ButtonLink href="/#demo">Vyzkoušet AI demo</ButtonLink>
              </div>
            </div>
            <dl className="micro grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 md:col-span-4 md:col-start-9">
              {meta.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
