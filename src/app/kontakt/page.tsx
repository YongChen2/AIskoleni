import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/kontakt/contact-form";
import { Clock, Mail, Phone } from "@/components/icons";
import { PageHero, Section } from "@/components/ui";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Kontakt – domluvit školení",
  description:
    "Napište nám, kolik lidí chcete školit a v jakých rolích. Ozveme se do dvou pracovních dnů a navrhneme formát školení.",
  alternates: { canonical: "/kontakt" },
};

const info = [
  { Icon: Mail, k: "E-mail", v: <a href={`mailto:${brand.contact.email}`} className="transition-colors hover:text-accent-hover">{brand.contact.email}</a> },
  { Icon: Phone, k: "Telefon", v: brand.contact.phone },
  { Icon: Clock, k: "Odezva", v: "Do 2 pracovních dnů" },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        label="Kontakt"
        title={
          <>
            Domluvit <span className="hl">školení</span>
          </>
        }
        lead="Pár údajů o vašem týmu a ozveme se do dvou pracovních dnů. První hovor je nezávazný a trvá zhruba půl hodiny."
      />
      <Section className="pt-0! lg:pt-0!">
        <div className="grid gap-4 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="card p-6 lg:sticky lg:top-24">
              <ul className="space-y-5">
                {info.map(({ Icon, k, v }) => (
                  <li key={k} className="flex gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-muted">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="label block">{k}</span>
                      <span className="mt-0.5 block text-[15px] text-fg">{v}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="divider my-6" />
              <p className="label">Fakturační údaje</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {brand.contact.company}
                <br />
                {brand.contact.ico}
                <br />
                {brand.contact.address}
              </p>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <Suspense fallback={<div className="card min-h-[44rem] p-6 text-[15px] text-subtle">Načítám formulář…</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
