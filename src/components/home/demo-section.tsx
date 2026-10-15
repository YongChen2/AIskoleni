import { Section, SectionHead } from "@/components/ui";
import { DemoLoader } from "@/components/demo/demo-loader";
import { DEMO_DAILY_LIMIT } from "@/components/demo/roles";

export function DemoSection() {
  return (
    <Section id="demo" className="scroll-mt-20">
      <SectionHead code="SEC.03" label="Živé AI demo" meta={`LIMIT ${DEMO_DAILY_LIMIT} DOTAZŮ / DEN`} />
      <div className="mt-10 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-end">
        <h2 className="macro-md lg:col-span-7">Zkuste si to na vlastním úkolu</h2>
        <p className="prose-body text-muted lg:col-span-5">
          Vyberte roli a zadejte úkol, který dnes řešíte. AI vrátí ukázkový výstup a hlavně prompt, který si můžete
          uložit. Přesně tohle se na školení učíme – jen do hloubky a na vašich datech.
        </p>
      </div>
      <div className="mt-12 md:mt-16">
        <DemoLoader />
      </div>
    </Section>
  );
}
