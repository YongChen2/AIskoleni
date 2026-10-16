import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { Badge, PageHero, Section, SectionHead, cx } from "@/components/ui";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Kdo stojí za školeními, jak pracujeme a proč učíme AI na reálných úlohách místo obecných příkladů.",
  alternates: { canonical: "/o-nas" },
};

const principles = [
  ["01", "Vaše úlohy, ne naše příklady", "Před každým školením si projdeme vaši agendu. Cvičíme na e-mailech, nabídkách a tabulkách, které lidé řeší každý den."],
  ["02", "Nezávislost", "Neprodáváme licence a nemáme provize od výrobců. Doporučíme nástroj, který se hodí vám."],
  ["03", "Měřitelný výsledek", "Ověření znalostí, report pro vedení a doporučení, co dál. Žádné „bylo to zajímavé“ bez dopadu."],
  ["04", "Bezpečnost od první minuty", "Pravidla práce s daty nejsou příloha na konci, ale součást každého bloku."],
];

const team = [
  { name: "[DOPLNIT] Jméno Příjmení", role: "[DOPLNIT] Lektor, zakladatel", unit: "1" },
  { name: "[DOPLNIT] Jméno Příjmení", role: "[DOPLNIT] Lektorka, bezpečnost dat", unit: "2" },
  { name: "[DOPLNIT] Jméno Příjmení", role: "[DOPLNIT] Lektor, obchod a marketing", unit: "3" },
];

export default function ONasPage() {
  return (
    <>
      <PageHero
        label="O nás"
        title={
          <>
            Učíme <span className="hl">práci</span>, ne nástroje
          </>
        }
        lead="[DOPLNIT: krátký příběh] Začínali jsme jako lidé, kteří AI sami zaváděli ve firmách. Viděli jsme, že licence nestačí – lidé potřebují vědět, jak AI použít na svou konkrétní práci. Tak vznikla školení podle rolí."
        meta={[
          ["Založeno", "[DOPLNIT]"],
          ["Sídlo", "[DOPLNIT]"],
          ["Lektoři", "[DOPLNIT]"],
        ]}
      />

      <Section className="pt-8! lg:pt-12!">
        <h2 className="sr-only">Náš přístup</h2>
        <figure className="card-glow relative isolate overflow-hidden p-8 md:p-14">
          <div aria-hidden className="glow -z-10 -right-32 -top-40 h-[30rem] w-[36rem]" />
          <svg width="36" height="26" viewBox="0 0 28 20" aria-hidden className="text-accent-hover">
            <path
              fill="currentColor"
              d="M0 20V12.2C0 5.5 3.6 1.4 10.3 0l1.2 2.6C7.8 3.8 6 6.1 5.8 9.2H11V20H0Zm16.5 0V12.2C16.5 5.5 20.1 1.4 26.8 0L28 2.6c-3.7 1.2-5.5 3.5-5.7 6.6h5.2V20h-11Z"
            />
          </svg>
          <blockquote className="mt-8 max-w-[30ch]">
            <p className="text-[clamp(1.6rem,3.2vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-fg">
              Nikdo nepotřebuje vědět, jak AI funguje. Potřebuje vědět, co s ní zítra udělá jinak.
            </p>
          </blockquote>
          <figcaption className="mt-8 text-[15px] text-muted">[DOPLNIT] Jméno, zakladatel</figcaption>
        </figure>
      </Section>

      <Section>
        <SectionHead eyebrow="Principy" title="Jak pracujeme" />
        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2" data-reveal-group>
          {principles.map(([n, title, text]) => (
            <li key={n} data-reveal className="card card-hover p-6 md:p-8">
              <span className="mono inline-flex h-8 items-center rounded-lg border border-line bg-surface-2 px-2.5 text-[13px] text-muted">{n}</span>
              <h3 className="title mt-6">{title}</h3>
              <p className="body mt-3 text-[15px]">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHead title="Tým" lead="Lektoři, kteří AI sami používají v každodenní práci." />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {team.map((t) => (
            <li key={t.unit} className="card overflow-hidden p-2">
              <div
                className={cx(
                  "relative flex aspect-[4/5] items-end rounded-[12px] border border-line p-4",
                  "bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,var(--surface-2),var(--bg))]"
                )}
              >
                <span aria-hidden className="absolute left-1/2 top-[38%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-surface" />
                <Badge tone="warning" dot>
                  [DOPLNIT] foto
                </Badge>
              </div>
              <div className="px-3 pb-3 pt-4">
                <p className="text-[16px] font-medium text-fg">{t.name}</p>
                <p className="mt-0.5 text-[14px] text-muted">{t.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="label mt-6">Fotky doplňte v poměru 4 : 5, ideálně na jednotném tmavém pozadí.</p>
      </Section>

      <CtaBlock />
    </>
  );
}
