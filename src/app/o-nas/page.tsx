import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { Corners, PageHero, Section, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Kdo stojí za školeními, jak pracujeme a proč učíme AI na reálných úlohách místo obecných příkladů.",
  alternates: { canonical: "/o-nas" },
};

const principles = [
  ["P.01", "Vaše úlohy, ne naše příklady", "Před každým školením si projdeme vaši agendu. Cvičíme na e-mailech, nabídkách a tabulkách, které lidé řeší každý den."],
  ["P.02", "Nezávislost", "Neprodáváme licence a nemáme provize od výrobců. Doporučíme nástroj, který se hodí vám."],
  ["P.03", "Měřitelný výsledek", "Ověření znalostí, report pro vedení a doporučení, co dál. Žádné „bylo to zajímavé“ bez dopadu."],
  ["P.04", "Bezpečnost od první minuty", "Pravidla práce s daty nejsou příloha na konci, ale součást každého bloku."],
];

const team = [
  { name: "[DOPLNIT] Jméno Příjmení", role: "[DOPLNIT] Lektor, zakladatel", unit: "T-01" },
  { name: "[DOPLNIT] Jméno Příjmení", role: "[DOPLNIT] Lektorka, bezpečnost dat", unit: "T-02" },
  { name: "[DOPLNIT] Jméno Příjmení", role: "[DOPLNIT] Lektor, obchod a marketing", unit: "T-03" },
];

export default function ONasPage() {
  return (
    <>
      <PageHero
        code="SEC.60"
        label="O nás"
        title={
          <>
            Učíme <span className="text-accent">práci</span>, ne nástroje
          </>
        }
        lead="[DOPLNIT: krátký příběh] Začínali jsme jako lidé, kteří AI sami zaváděli ve firmách. Viděli jsme, že licence nestačí – lidé potřebují vědět, jak AI použít na svou konkrétní práci. Tak vznikla školení podle rolí."
        meta={[
          ["Založeno", "[DOPLNIT]"],
          ["Sídlo", "[DOPLNIT]"],
          ["Lektoři", "[DOPLNIT]"],
        ]}
      />

      <Section>
        <h2 className="sr-only">Náš přístup</h2>
        <figure className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <SectionHead code="Q.01" label="Přístup" />
          </div>
          <blockquote className="lg:col-span-10">
            <p className="dither-text font-serif text-[clamp(2.5rem,7vw,7rem)] italic leading-[0.95]">
              „Nikdo nepotřebuje vědět, jak AI funguje. Potřebuje vědět, co s ní zítra udělá jinak.“
            </p>
          </blockquote>
          <figcaption className="micro text-muted lg:col-span-6">— [DOPLNIT] Jméno, zakladatel</figcaption>
        </figure>
      </Section>

      <Section>
        <SectionHead code="SEC.61" label="Principy" />
        <h2 className="sr-only">Principy</h2>
        <ul className="hairgrid mt-12 md:mt-16 md:grid-cols-2">
          {principles.map(([code, title, text]) => (
            <li key={code} className="p-5 md:p-8">
              <p className="micro text-accent">{code}</p>
              <h3 className="macro-sm mt-6">{title}</h3>
              <p className="prose-body mt-4 text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHead code="SEC.62" label="Tým" meta="FOTO: [DOPLNIT]" />
        <h2 className="sr-only">Tým</h2>
        <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {team.map((t) => (
            <li key={t.unit}>
              <div className="relative aspect-[4/5] border border-line">
                <Corners />
                <div className="halftone absolute inset-3" aria-hidden />
                <span className="micro-xs absolute left-3 top-3 bg-bg px-2 py-1 text-muted">UNIT / {t.unit}</span>
                <span className="micro-xs absolute bottom-3 right-3 bg-bg px-2 py-1 text-accent">[DOPLNIT] FOTO</span>
              </div>
              <p className="micro mt-4">{t.name}</p>
              <p className="micro-xs mt-1 text-muted">{t.role}</p>
            </li>
          ))}
        </ul>
        <p className="micro-xs mt-6 text-muted">
          Fotky použijte černobílé a převeďte do 1-bit ditheru / halftone (např. CSS třída <code>halftone</code> nebo
          předzpracování v editoru).
        </p>
      </Section>

      <CtaBlock />
    </>
  );
}
