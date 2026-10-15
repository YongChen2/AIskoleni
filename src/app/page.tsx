import { JsonLd } from "@/components/json-ld";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { CtaBlock } from "@/components/cta-block";
import { Calculator } from "@/components/home/calculator";
import { DemoSection } from "@/components/home/demo-section";
import { Faq } from "@/components/home/faq";
import { Formats } from "@/components/home/formats";
import { Hero } from "@/components/home/hero";
import { HeroVisual } from "@/components/hero3d/hero-visual";
import { StaticNetwork } from "@/components/hero3d/static-network";
import { Problem } from "@/components/home/problem";
import { Proof } from "@/components/home/proof";

export default function Home() {
  return (
    <>
      <Hero visual={<HeroVisual fallback={<StaticNetwork />} />} />
      <Problem />
      <Formats />
      <DemoSection />
      <Calculator />
      <Proof />
      <Faq />
      <CtaBlock />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
    </>
  );
}
