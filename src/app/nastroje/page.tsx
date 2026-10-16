import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { Swipe } from "@/components/swipe";
import { ArrowRight } from "@/components/icons";
import { Badge, PageHero, Section, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "ChatGPT, Claude, Copilot, Gemini, Grok – srovnání pro firmy",
  description:
    "Nezávislé srovnání AI nástrojů pro firmy: ChatGPT, Claude, Microsoft Copilot, Gemini a Grok. Pro koho se který hodí, jak se napojí na vaše systémy a na co si dát pozor.",
  alternates: { canonical: "/nastroje" },
};

const tools = ["ChatGPT", "Claude", "Microsoft Copilot", "Gemini", "Grok"] as const;

const rows: { label: string; values: [string, string, string, string, string] }[] = [
  {
    label: "Výrobce",
    values: ["OpenAI", "Anthropic", "Microsoft", "Google", "xAI (firma Elona Muska)"],
  },
  {
    label: "Nejlépe sedí",
    values: [
      "Univerzální použití, široký tým, rychlé začátky",
      "Práce s dlouhými dokumenty, psaní, analýzy a programování",
      "Firmy postavené na Microsoft 365 (Outlook, Teams, Word, Excel)",
      "Firmy postavené na Google Workspace (Gmail, Docs, Sheets)",
      "Aktuální informace z webu a sítě X: rešerše, sledování trendů a dění na trhu",
    ],
  },
  {
    label: "Napojení na firemní systémy",
    values: [
      "Konektory na běžné úložiště a aplikace, vlastní GPTs",
      "Konektory a projekty se sdílenými podklady",
      "Přímo uvnitř aplikací Microsoft 365 a nad firemními daty v Microsoft Graph",
      "Přímo uvnitř aplikací Google Workspace",
      "Napojení na Google Drive; do Microsoft 365 a Google Workspace se zapojuje méně než Copilot a Gemini",
    ],
  },
  {
    label: "Firemní tarif",
    values: [
      "Business / Enterprise",
      "Team / Enterprise",
      "Microsoft 365 Copilot",
      "Gemini ve Workspace",
      "Business (cca 30 USD za uživatele měsíčně: správa týmu, analytika, Google Drive) / Enterprise (navíc SSO, SCIM, audit, volitelně Enterprise Vault s vlastními šifrovacími klíči). xAI uvádí, že firemní data nepoužívá k trénování.",
    ],
  },
  {
    label: "Silná stránka",
    values: [
      "Šíře funkcí: obrázky, hlas, analýza dat",
      "Kvalita a přesnost textu, práce s rozsáhlým kontextem",
      "Pracuje tam, kde lidé už jsou – žádný nový nástroj",
      "Pracuje tam, kde lidé už jsou – žádný nový nástroj",
      "Aktuálnost: čerpá z dění na síti X a na webu",
    ],
  },
  {
    label: "Na co si dát pozor",
    values: [
      "Hlídat, kdo používá osobní účty místo firemních",
      "Méně integrací do kancelářských balíků",
      "Výsledky závisí na pořádku v oprávněních k souborům",
      "Smysl dává hlavně při plném využití Workspace",
      "V českých firmách zatím málo rozšířený. Spíš doplněk než hlavní firemní nástroj",
    ],
  },
];

const picks = [
  ["Máte Microsoft 365 a lidé žijí v Outlooku a Teams", "Microsoft Copilot"],
  ["Máte Google Workspace", "Gemini"],
  ["Potřebujete univerzální nástroj pro celý tým", "ChatGPT"],
  ["Hodně pracujete s dlouhými dokumenty, smlouvami a texty", "Claude"],
  ["Potřebujete sledovat aktuální dění a trendy na síti X", "Grok jako doplněk"],
];

export default function NastrojePage() {
  return (
    <>
      <PageHero
        label="Nástroje"
        title={
          <>
            Který <span className="hl">nástroj?</span>
          </>
        }
        lead="Neprodáváme licence a nemáme provize. Proto můžeme říct na rovinu, který nástroj se vám hodí – a že často nejde o jeden, ale o kombinaci."
        meta={[
          ["Nástroje", "5"],
          ["Doporučení", "Nezávislé"],
          ["Stav k", "[DOPLNIT] datum"],
          ["Revize", "1.0"],
        ]}
      />

      <Section className="pt-8! lg:pt-12!">
        <SectionHead title="Srovnání pro firemní použití" />
        {/* mobil: swipe karty po nástrojích */}
        <Swipe count={tools.length} label="Srovnání nástrojů" className="mt-12 lg:hidden">
          {tools.map((t, ti) => (
            <li key={t} className="card w-[86%] shrink-0 p-5 sm:w-[60%]">
              <h3 className="title">{t}</h3>
              <p className="label mt-1">{rows[0].values[ti]}</p>
              <dl className="mt-5 space-y-4">
                {rows.slice(1).map((r) => (
                  <div key={r.label} className="border-t border-line pt-3">
                    <dt className="label">{r.label}</dt>
                    <dd className="mt-1 text-[15px] text-fg">{r.values[ti]}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </Swipe>
        <div
          className="card mt-14 hidden overflow-x-auto lg:block"
          tabIndex={0}
          role="region"
          aria-label="Srovnávací tabulka AI nástrojů"
        >
          <table className="w-full min-w-[64rem] table-fixed border-collapse text-left">
            <caption className="sr-only">Srovnání ChatGPT, Claude, Microsoft Copilot, Gemini a Grok pro firmy</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-[14%] px-5 py-5 text-[13px] font-medium text-subtle">
                  Parametr
                </th>
                {tools.map((t, ti) => (
                  <th key={t} scope="col" className="px-5 py-5 align-bottom">
                    <span className="block text-[18px] font-semibold tracking-[-0.02em] text-fg">{t}</span>
                    <span className="label mt-0.5 block font-normal">{rows[0].values[ti]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r) => (
                <tr key={r.label} className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-tint/[0.02]">
                  <th scope="row" className="px-5 py-5 align-top text-[14px] font-medium text-muted">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="px-5 py-5 align-top text-[14.5px] text-fg/90">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="label mt-4">
          Nástroje se mění každý měsíc. Názvy tarifů a funkce ověřujeme k datu revize – [DOPLNIT] datum poslední kontroly. Tarify Groku jsou aktuální k lednu 2026.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="Rychlé doporučení" title="Když nevíte, začněte tady" />
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge>Srovnáváme nezávisle</Badge>
              <Badge>Pomůžeme s výběrem</Badge>
              <Badge tone="danger" dot>
                Bez provizí
              </Badge>
            </div>
          </div>
          <ul className="space-y-3 lg:col-span-8" data-reveal-group>
            {picks.map(([cond, tool]) => (
              <li key={cond} data-reveal className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <span className="text-[16px] text-fg">{cond}</span>
                <span className="flex shrink-0 items-center gap-3 text-[15px] font-medium text-fg">
                  <ArrowRight size={16} className="text-subtle" />
                  <span className="badge badge-danger">{tool}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBlock
        title={
          <>
            Vybereme <span className="hl">s vámi</span>
          </>
        }
        text="Nevíte, který nástroj koupit? Na úvodním workshopu porovnáme nástroje přímo na vašich úlohách."
      />
    </>
  );
}
