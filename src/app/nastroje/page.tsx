import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { PageHero, Section, SectionHead, Tag } from "@/components/ui";

export const metadata: Metadata = {
  title: "ChatGPT, Claude, Copilot, Gemini – srovnání pro firmy",
  description:
    "Nezávislé srovnání AI nástrojů pro firmy: ChatGPT, Claude, Microsoft Copilot a Gemini. Pro koho se který hodí, jak se napojí na vaše systémy a na co si dát pozor.",
  alternates: { canonical: "/nastroje" },
};

const tools = ["ChatGPT", "Claude", "Microsoft Copilot", "Gemini"] as const;

const rows: { label: string; values: [string, string, string, string] }[] = [
  {
    label: "Výrobce",
    values: ["OpenAI", "Anthropic", "Microsoft", "Google"],
  },
  {
    label: "Nejlépe sedí",
    values: [
      "Univerzální použití, široký tým, rychlé začátky",
      "Práce s dlouhými dokumenty, psaní, analýzy a programování",
      "Firmy postavené na Microsoft 365 (Outlook, Teams, Word, Excel)",
      "Firmy postavené na Google Workspace (Gmail, Docs, Sheets)",
    ],
  },
  {
    label: "Napojení na firemní systémy",
    values: [
      "Konektory na běžné úložiště a aplikace, vlastní GPTs",
      "Konektory a projekty se sdílenými podklady",
      "Přímo uvnitř aplikací Microsoft 365 a nad firemními daty v Microsoft Graph",
      "Přímo uvnitř aplikací Google Workspace",
    ],
  },
  {
    label: "Firemní tarif",
    values: ["Business / Enterprise", "Team / Enterprise", "Microsoft 365 Copilot", "Gemini ve Workspace"],
  },
  {
    label: "Silná stránka",
    values: [
      "Šíře funkcí: obrázky, hlas, analýza dat",
      "Kvalita a přesnost textu, práce s rozsáhlým kontextem",
      "Pracuje tam, kde lidé už jsou – žádný nový nástroj",
      "Pracuje tam, kde lidé už jsou – žádný nový nástroj",
    ],
  },
  {
    label: "Na co si dát pozor",
    values: [
      "Hlídat, kdo používá osobní účty místo firemních",
      "Méně integrací do kancelářských balíků",
      "Výsledky závisí na pořádku v oprávněních k souborům",
      "Smysl dává hlavně při plném využití Workspace",
    ],
  },
];

const picks = [
  ["Máte Microsoft 365 a lidé žijí v Outlooku a Teams", "Microsoft Copilot"],
  ["Máte Google Workspace", "Gemini"],
  ["Potřebujete univerzální nástroj pro celý tým", "ChatGPT"],
  ["Hodně pracujete s dlouhými dokumenty, smlouvami a texty", "Claude"],
];

export default function NastrojePage() {
  return (
    <>
      <PageHero
        code="SEC.30"
        label="Nástroje"
        title={
          <>
            Který <span className="text-accent">nástroj?</span>
          </>
        }
        lead="Neprodáváme licence a nemáme provize. Proto můžeme říct na rovinu, který nástroj se vám hodí – a že často nejde o jeden, ale o kombinaci."
        meta={[
          ["Nástroje", "04"],
          ["Doporučení", "Nezávislé"],
          ["Stav k", "[DOPLNIT] datum"],
          ["Rev", "1.0"],
        ]}
      />

      <Section>
        <SectionHead code="TAB.01" label="Srovnávací tabulka" meta="PRO FIREMNÍ POUŽITÍ" />
        <div className="mt-12 overflow-x-auto md:mt-16" tabIndex={0} role="region" aria-label="Srovnávací tabulka AI nástrojů">
          <table className="w-full min-w-[56rem] border-collapse border border-line text-left">
            <caption className="sr-only">Srovnání ChatGPT, Claude, Microsoft Copilot a Gemini pro firmy</caption>
            <thead>
              <tr>
                <th scope="col" className="micro w-[16%] border border-line p-4 font-normal text-muted">
                  Parametr
                </th>
                {tools.map((t) => (
                  <th key={t} scope="col" className="border border-line p-4 align-bottom">
                    <span className="macro-sm block text-[clamp(1.1rem,1.8vw,1.6rem)]">{t}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="hover:bg-bg-2">
                  <th scope="row" className="micro border border-line p-4 align-top font-normal text-muted">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="border border-line p-4 align-top text-[15px]">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="micro-xs mt-4 text-muted">
          Nástroje se mění každý měsíc. Názvy tarifů a funkce ověřujeme k datu revize – [DOPLNIT] datum poslední kontroly.
        </p>
      </Section>

      <Section>
        <SectionHead code="SEC.31" label="Rychlé doporučení" />
        <h2 className="macro-md mt-10 max-w-[14ch] md:mt-16">Když nevíte, začněte tady</h2>
        <ul className="mt-12 border-t border-line md:mt-16">
          {picks.map(([cond, tool]) => (
            <li key={cond} className="grid gap-2 border-b border-line py-5 md:grid-cols-12 md:items-baseline">
              <span className="micro text-muted md:col-span-1">IF</span>
              <span className="text-lg md:col-span-7">{cond}</span>
              <span className="micro md:col-span-4 md:text-right">
                {">>>"} <span className="text-accent">{tool}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-2">
          <Tag>Školíme na všech čtyřech</Tag>
          <Tag>Pomůžeme s výběrem</Tag>
          <Tag accent>Bez provizí</Tag>
        </div>
      </Section>

      <CtaBlock
        title={
          <>
            Vybereme <span className="text-accent">s vámi</span>
          </>
        }
        text="Nevíte, který nástroj koupit? Na úvodním workshopu porovnáme nástroje přímo na vašich úlohách."
      />
    </>
  );
}
