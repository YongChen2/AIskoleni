import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Jaké cookies a podobné technologie web používá.",
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  return (
    <LegalPage
      code="LEG.02"
      title="Cookies"
      lead="Web nepoužívá reklamní ani analytické cookies, proto vás neobtěžujeme cookie lištou."
      sections={[
        {
          h: "Co používáme",
          body: (
            <p>
              Web používá jen technicky nezbytné úložiště prohlížeče, bez kterého by nefungoval. Tyto technologie
              nevyžadují souhlas.
            </p>
          ),
        },
        {
          h: "Měření návštěvnosti",
          body: (
            <p>
              [DOPLNIT] Pokud zapnete Vercel Web Analytics, měří návštěvnost bez cookies a bez identifikace
              návštěvníků. Pokud přidáte jinou analytiku (např. Google Analytics), je nutné doplnit cookie lištu se
              souhlasem a upravit tuto stránku.
            </p>
          ),
        },
        {
          h: "Správce",
          body: <p>[DOPLNIT] název společnosti, IČO, sídlo, kontaktní e-mail.</p>,
        },
      ]}
    />
  );
}
