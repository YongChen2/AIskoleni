import { Check, Close } from "@/components/icons";
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
      <SectionHead
        title={
          <>
            Lidé AI mají. Neumí ji použít <span className="text-muted">na svou práci.</span>
          </>
        }
        lead="Nejde o nástroj, ale o návyk. Školení mění to, jak lidé zadávají práci – a to je vidět na výsledcích."
      />

      <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2" data-reveal-group>
        <div data-reveal className="card p-6 md:p-8">
          <p className="text-[14px] font-medium text-muted">Dnes</p>
          <ul className="mt-6 space-y-4">
            {problems.map((p) => (
              <li key={p} className="flex gap-3.5 text-muted">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-subtle">
                  <Close size={13} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal className="card-glow p-6 md:p-8">
          <p className="text-[14px] font-medium text-fg">Po školení</p>
          <ul className="mt-6 space-y-4">
            {solutions.map((p) => (
              <li key={p} className="flex gap-3.5 text-fg">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-hover">
                  <Check size={14} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
