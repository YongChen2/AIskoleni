import type { Metadata } from "next";
import { SignalGame } from "@/components/signal-game";
import { ButtonLink, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section data-theme="dark" data-band="" className="relative isolate overflow-hidden pb-24 pt-16 md:pt-24">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
      <div aria-hidden className="glow -z-10 left-[-10%] top-[-20%] h-[36rem] w-[44rem]" />
      <div className="shell grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow>Chyba 404</Eyebrow>
          <h1 className="display-1 mt-6">
            Tahle stránka <span className="hl">neexistuje</span>
          </h1>
          <p className="lead mt-6">Možná se přesunula, nebo je v odkazu překlep. Zkuste úvod – nebo si mezitím otestujte reflexy.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/" variant="primary">
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
