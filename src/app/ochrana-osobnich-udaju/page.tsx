import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description: "Jak zpracováváme osobní údaje z kontaktního formuláře a při poskytování školení.",
  alternates: { canonical: "/ochrana-osobnich-udaju" },
};

export default function Page() {
  return (
    <LegalPage
      title="Osobní údaje"
      lead="Zpracováváme jen údaje, které potřebujeme k odpovědi na vaši poptávku a k poskytnutí školení."
      sections={[
        {
          h: "Správce",
          body: (
            <p>
              Správcem osobních údajů je <strong>[DOPLNIT] název společnosti</strong>, IČO [DOPLNIT], se sídlem
              [DOPLNIT], zapsaná v obchodním rejstříku vedeném [DOPLNIT]. Kontakt: [DOPLNIT] e-mail.
            </p>
          ),
        },
        {
          h: "Jaké údaje zpracováváme",
          body: (
            <ul>
              <li>Údaje z kontaktního formuláře: jméno, firma, e-mail, telefon, velikost týmu, role a text zprávy.</li>
              <li>Údaje účastníků školení: jméno, pracovní e-mail a výsledky ověření znalostí.</li>
              <li>Fakturační údaje odběratele.</li>
            </ul>
          ),
        },
        {
          h: "Účel a právní základ",
          body: (
            <ul>
              <li>Odpověď na poptávku a jednání o smlouvě – čl. 6 odst. 1 písm. b) GDPR.</li>
              <li>Poskytnutí školení a reportu pro objednatele – plnění smlouvy.</li>
              <li>Vedení účetnictví – plnění právní povinnosti.</li>
              <li>[DOPLNIT] další účely, např. zasílání novinek na základě souhlasu.</li>
            </ul>
          ),
        },
        {
          h: "Doba uložení",
          body: <p>Údaje z poptávek uchováváme [DOPLNIT] měsíců od posledního kontaktu, účetní doklady po dobu stanovenou zákonem.</p>,
        },
        {
          h: "Příjemci a zpracovatelé",
          body: (
            <ul>
              <li>Vercel Inc. – hosting webu.</li>
              <li>Resend – doručení e-mailů z kontaktního formuláře.</li>
              <li>[DOPLNIT] účetní, další zpracovatelé.</li>
            </ul>
          ),
        },
        {
          h: "Vaše práva",
          body: (
            <p>
              Máte právo na přístup k údajům, opravu, výmaz, omezení zpracování, přenositelnost a vznesení námitky.
              Stížnost můžete podat u Úřadu pro ochranu osobních údajů (www.uoou.cz). Žádosti posílejte na [DOPLNIT]
              e-mail.
            </p>
          ),
        },
      ]}
    />
  );
}
