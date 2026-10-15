import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/kontakt/contact-form";
import { PageHero, Section } from "@/components/ui";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Kontakt – domluvit školení",
  description:
    "Napište nám, kolik lidí chcete školit a v jakých rolích. Ozveme se do dvou pracovních dnů a navrhneme formát školení.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        code="SEC.70"
        label="Kontakt"
        title={
          <>
            Domluvit <span className="text-accent">školení</span>
          </>
        }
        lead="Pár údajů o vašem týmu a ozveme se do dvou pracovních dnů. První hovor je nezávazný a trvá zhruba půl hodiny."
      />
      <Section className="pt-0! md:pt-0!">
        <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="micro space-y-6">
              <div>
                <dt className="text-muted">E-mail</dt>
                <dd className="mt-1 text-base normal-case tracking-normal">
                  <a href={`mailto:${brand.contact.email}`} className="hover:text-accent">
                    {brand.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Telefon</dt>
                <dd className="mt-1 text-base tracking-normal">{brand.contact.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Fakturační údaje</dt>
                <dd className="mt-1 normal-case">
                  {brand.contact.company}
                  <br />
                  {brand.contact.ico}
                  <br />
                  {brand.contact.address}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Odezva</dt>
                <dd className="mt-1">Do 2 pracovních dnů</dd>
              </div>
            </dl>
          </aside>
          <div className="lg:col-span-8">
            <Suspense fallback={<div className="micro min-h-[40rem] border border-line p-6 text-muted">[ NAČÍTÁM FORMULÁŘ ]</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
