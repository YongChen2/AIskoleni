import { Section, SectionHead } from "@/components/ui";
import { DemoLoader } from "@/components/demo/demo-loader";
import { DEMO_DAILY_LIMIT } from "@/components/demo/roles";

export function DemoSection() {
  return (
    <Section id="demo" className="scroll-mt-20 overflow-hidden">
      <div aria-hidden className="glow left-1/2 top-[16rem] h-[40rem] w-[70rem] -translate-x-1/2 opacity-80" />
      <SectionHead
        align="center"
        eyebrow="Živé AI demo"
        title="Zkuste si to na vlastním úkolu"
        lead={`Vyberte roli a zadejte úkol, který dnes řešíte. Dostanete ukázkový výstup a hlavně prompt, který si můžete uložit. Limit ${DEMO_DAILY_LIMIT} dotazů denně.`}
      />
      <div data-reveal-block className="relative mx-auto mt-14 max-w-5xl md:mt-16">
        <DemoLoader />
      </div>
    </Section>
  );
}
