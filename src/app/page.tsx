import { CtaBlock } from "@/components/cta-block";
import { Faq } from "@/components/home/faq";
import { Formats } from "@/components/home/formats";
import { Hero } from "@/components/home/hero";
import { Problem } from "@/components/home/problem";
import { Proof } from "@/components/home/proof";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Formats />
      <Proof />
      <Faq />
      <CtaBlock />
    </>
  );
}
