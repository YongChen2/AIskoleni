import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { DataSemafor } from "@/components/semafor/data-semafor";
import { PageHero, Section, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Bezpečná práce s daty v AI",
  description:
    "Co do ChatGPT, Claude nebo Copilotu patří a co ne. Vyzkoušejte si datový semafor a základní pravidla bezpečné práce s AI ve firmě.",
  alternates: { canonical: "/bezpecnost" },
};

const rules = [
  ["R.01", "Firemní licence, ne osobní účty", "Firemní tarify nástrojů obvykle nepoužívají vaše data k trénování modelů a dávají správci kontrolu. Osobní bezplatné účty na firemní data nepatří."],
  ["R.02", "Anonymizace před vložením", "Jména, e-maily, rodná čísla a názvy klientů nahraďte kódy. AI k analýze většinou nepotřebuje vědět, o koho jde."],
  ["R.03", "Člověk výstup vždy zkontroluje", "AI umí znít přesvědčivě i když se mýlí. Za text, který odejde ven, odpovídá ten, kdo ho odeslal."],
  ["R.04", "Jedna stránka pravidel pro celou firmu", "Krátká interní směrnice: které nástroje, na jaká data a kdo schvaluje výjimky. Na školení ji připravíme s vámi."],
];

export default function BezpecnostPage() {
  return (
    <>
      <PageHero
        code="SEC.20"
        label="Bezpečnost dat"
        title={
          <>
            Co do AI <span className="text-accent">nepatří</span>
          </>
        }
        lead="Největší riziko AI ve firmě není technologie, ale nejasná pravidla. Lidé buď vkládají všechno, nebo ze strachu nic. Obojí stojí peníze."
        meta={[
          ["Zóny", "03"],
          ["Karty", "10"],
          ["Rámec", "GDPR · AI Act"],
          ["Status", "Simulace"],
        ]}
      />
      <div className="hazard h-3" aria-hidden />

      <Section id="semafor">
        <SectionHead code="SIM.01" label="Datový semafor" meta="INTERAKTIVNÍ TEST" />
        <div className="mt-10 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-end">
          <h2 className="macro-md lg:col-span-7">Zelená, oranžová, nebo červená?</h2>
          <p className="prose-body text-muted lg:col-span-5">
            Rozřaďte běžné typy firemních dat podle toho, jestli je smíte vložit do AI nástroje. Ke každé kartě
            dostanete hned vysvětlení.
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <DataSemafor />
        </div>
        <p className="micro-xs mt-4 text-muted">
          Zjednodušený model pro orientaci. Konkrétní pravidla závisí na vaší licenci, smlouvách a interních předpisech.
        </p>
      </Section>

      <Section>
        <SectionHead code="SEC.21" label="Čtyři pravidla" />
        <ol className="hairgrid mt-12 md:mt-16 md:grid-cols-2">
          {rules.map(([code, title, text]) => (
            <li key={code} className="p-5 md:p-8">
              <p className="micro text-accent">{code}</p>
              <h3 className="macro-sm mt-6">{title}</h3>
              <p className="prose-body mt-4 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead code="SEC.22" label="AI Act" />
            <p aria-hidden className="macro mt-10 text-line">Art. 4</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="macro-sm">Povinnost AI gramotnosti</h2>
            <p className="prose-body mt-6">
              Evropský AI Act ukládá firmám, které AI používají, zajistit dostatečnou úroveň AI gramotnosti svých lidí.
              Školení s ověřením znalostí a průběžnou evidencí proškolenosti je nejjednodušší způsob, jak to doložit.
            </p>
            <p className="micro-xs mt-6 text-muted">
              Nejde o právní poradenství. Výklad pro vaši firmu konzultujte s právníkem.
            </p>
          </div>
        </div>
      </Section>

      <CtaBlock
        title={
          <>
            Pravidla <span className="text-accent">do týdne</span>
          </>
        }
        text="Na úvodním workshopu s vedením připravíme interní pravidla práce s AI, která můžete hned vydat."
      />
    </>
  );
}
