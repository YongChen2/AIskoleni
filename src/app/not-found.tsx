import type { Metadata } from "next";
import { SignalGame } from "@/components/signal-game";
import { ButtonLink, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="px-4 pb-20 pt-10 md:px-8 md:pt-16">
      <SectionHead code="ERR.404" label="Signál ztracen" meta="STATUS: NENALEZENO" />
      <div className="mt-10 grid gap-12 md:mt-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="macro text-[clamp(6rem,22vw,20rem)]">
            4<span className="text-accent">0</span>4
          </h1>
          <p className="prose-body mt-8">
            Tahle stránka neexistuje, nebo se přesunula. Zkuste úvod, nebo si mezitím otestujte reflexy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" accent>
              Zpět na úvod
            </ButtonLink>
            <ButtonLink href="/skoleni">Formáty školení</ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SignalGame />
        </div>
      </div>
    </section>
  );
}
