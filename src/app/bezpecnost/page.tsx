import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { DataSemafor } from "@/components/semafor/data-semafor";
import { Badge, PageHero, Section, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Bezpečná práce s daty v AI",
  description:
    "Co do ChatGPT, Claude nebo Copilotu patří a co ne. Vyzkoušejte si datový semafor a základní pravidla bezpečné práce s AI ve firmě.",
  alternates: { canonical: "/bezpecnost" },
};

const rules = [
  ["01", "Firemní licence, ne osobní účty", "Firemní tarify nástrojů obvykle nepoužívají vaše data k trénování modelů a dávají správci kontrolu. Osobní bezplatné účty na firemní data nepatří."],
  ["02", "Anonymizace před vložením", "Jména, e-maily, rodná čísla a názvy klientů nahraďte kódy. AI k analýze většinou nepotřebuje vědět, o koho jde."],
  ["03", "Člověk výstup vždy zkontroluje", "AI umí znít přesvědčivě i když se mýlí. Za text, který odejde ven, odpovídá ten, kdo ho odeslal."],
  ["04", "Jedna stránka pravidel pro celou firmu", "Krátká interní směrnice: které nástroje, na jaká data a kdo schvaluje výjimky. Na školení ji připravíme s vámi."],
];

export default function BezpecnostPage() {
  return (
    <>
      <PageHero
        label="Bezpečnost dat"
        title={
          <>
            Co do AI <span className="hl">nepatří</span>
          </>
        }
        lead="Největší riziko AI ve firmě není technologie, ale nejasná pravidla. Lidé buď vkládají všechno, nebo ze strachu nic. Obojí stojí peníze."
        meta={[
          ["Zóny", "3"],
          ["Karty", "10"],
          ["Rámec", "GDPR · AI Act"],
          ["Formát", "Interaktivní test"],
        ]}
      />

      <Section id="semafor" className="pt-8! lg:pt-12!">
        <SectionHead
          title="Zelená, oranžová, nebo červená?"
          lead="Rozřaďte běžné typy firemních dat podle toho, jestli je smíte vložit do AI nástroje. Ke každé kartě dostanete hned vysvětlení."
        />
        <div className="mt-12 md:mt-16">
          <DataSemafor />
        </div>
        <p className="label mt-4">
          Zjednodušený model pro orientaci. Konkrétní pravidla závisí na vaší licenci, smlouvách a interních předpisech.
        </p>
      </Section>

      <Section>
        <SectionHead eyebrow="Pravidla" title="Čtyři pravidla, která stačí" />
        <ol className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2" data-reveal-group>
          {rules.map(([n, title, text]) => (
            <li key={n} data-reveal className="card card-hover p-6 md:p-8">
              <span className="mono inline-flex h-8 items-center rounded-lg border border-line bg-surface-2 px-2.5 text-[13px] text-muted">{n}</span>
              <h3 className="title mt-6">{title}</h3>
              <p className="body mt-3 text-[15px]">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="card-glow relative isolate grid gap-10 overflow-hidden p-6 md:p-12 lg:grid-cols-12">
          <div aria-hidden className="glow -z-10 -left-40 -top-40 h-[28rem] w-[28rem]" />
          <div className="lg:col-span-5">
            <Badge dot tone="warning">
              AI Act · článek 4
            </Badge>
            <h2 className="display-2 mt-6">Povinnost AI gramotnosti</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="lead">
              Evropský AI Act ukládá firmám, které AI používají, přijmout opatření na podporu AI gramotnosti svých lidí –
              přiměřeně tomu, jak a k čemu AI používají. Školení s ověřením znalostí a evidencí proškolenosti je nejsnazší
              způsob, jak to doložit.
            </p>
            <p className="label mt-6">
              Znění podle nařízení (EU) 2026/1744 (Digital Omnibus), účinné od 27. 7. 2026. Nejde o právní poradenství. Výklad pro
              vaši firmu konzultujte s právníkem.
            </p>
          </div>
        </div>
      </Section>

      <CtaBlock
        title={
          <>
            Pravidla <span className="hl">do týdne</span>
          </>
        }
        text="Na úvodním workshopu s vedením připravíme interní pravidla práce s AI, která můžete hned vydat."
      />
    </>
  );
}
