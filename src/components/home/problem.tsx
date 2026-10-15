import { Section, SectionHead } from "@/components/ui";

const problems = [
  "Licence jsou zaplacené, ale většina lidí je otevře párkrát za měsíc.",
  "AI se používá jako vyhledávač – krátký dotaz, průměrná odpověď, zklamání.",
  "Nikdo neví, která data do nástroje smí a která ne.",
  "Pár nadšenců jede napřed, zbytek týmu čeká, co z toho vzejde.",
];

const solutions = [
  "Trénujeme na úlohách z vaší agendy, ne na obecných příkladech.",
  "Každá role dostane vlastní postupy a knihovnu promptů.",
  "Jasná pravidla pro data, která firma může vydat ještě ten den.",
  "Ověření znalostí a report, ze kterého vedení vidí posun.",
];

export function Problem() {
  return (
    <Section>
      <SectionHead code="SEC.01" label="Diagnostika" meta="PROBLÉM → ŘEŠENÍ" />
      <h2 className="macro-md mt-10 max-w-[16ch] md:mt-16">
        Lidé AI mají. Neumí ji použít na <span className="text-accent">svou práci.</span>
      </h2>

      <div className="hairgrid mt-12 md:mt-20 md:grid-cols-2">
        <div className="p-5 md:p-8">
          <p className="micro text-accent">[!] Stav dnes</p>
          <ul className="mt-6 space-y-5">
            {problems.map((p, i) => (
              <li key={p} className="grid grid-cols-[3rem_1fr] gap-2">
                <span className="micro-xs pt-1 text-muted">ERR.{String(i + 1).padStart(2, "0")}</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-bg-2! p-5 md:p-8">
          <p className="micro">{">>>"} Po školení</p>
          <ul className="mt-6 space-y-5">
            {solutions.map((p, i) => (
              <li key={p} className="grid grid-cols-[3rem_1fr] gap-2">
                <span className="micro-xs pt-1 text-muted">FIX.{String(i + 1).padStart(2, "0")}</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
