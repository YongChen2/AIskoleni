import { ButtonLink, Section, SectionHead } from "@/components/ui";
import { DemoLoader } from "@/components/demo/demo-loader";

export function DemoSection() {
  return (
    <Section id="demo" theme="dark" className="scroll-mt-20 overflow-hidden">
      <div aria-hidden className="glow left-1/2 top-[16rem] h-[40rem] w-[70rem] -translate-x-1/2 opacity-80" />
      <SectionHead
        align="center"
        eyebrow="AI demo"
        title="Podívejte se, co AI zvládne za vás"
        lead="Vyberte roli a jeden z běžných úkolů. Uvidíte výstup ve dvou variantách a hlavně prompt, který si můžete zkopírovat a používat."
      />
      <div data-reveal-block className="relative mx-auto mt-14 max-w-5xl md:mt-16">
        <DemoLoader />
      </div>
      <div data-reveal-block className="relative mt-10 flex flex-col items-center gap-5 text-center">
        <p className="body text-[16px]">Na školení si stejné postupy vyzkoušíte na vlastních úlohách.</p>
        <ButtonLink href="/kontakt" variant="secondary" arrow>
          Domluvit školení
        </ButtonLink>
      </div>
    </Section>
  );
}
