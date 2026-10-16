/** Obsah sdílený mezi stránkami a strukturovanými daty (JSON-LD). */

export type Format = {
  step: string;
  slug: string;
  title: string;
  short: string;
  audience: string;
  size: string;
  duration: string;
  output: string;
  points: string[];
};

export const formats: Format[] = [
  {
    step: "01",
    slug: "uvodni-workshop",
    title: "Úvodní workshop",
    short: "Vedení zjistí, kde AI firmě ušetří nejvíc času, a odnese si konkrétní plán zavedení.",
    audience: "Vedení a klíčoví lidé",
    size: "do 12 lidí",
    duration: "půlden až den",
    output: "Mapa příležitostí a plán zavedení",
    points: [
      "Co dnešní nástroje reálně zvládnou a kde selhávají",
      "Živé ukázky na vašich dokumentech a procesech",
      "Výběr 3–5 úloh s nejrychlejší návratností",
      "Pravidla pro práci s daty, která můžete hned vydat",
    ],
  },
  {
    step: "02",
    slug: "skoleni-tymu",
    title: "Školení týmů podle rolí",
    short: "Obchod, administrativa, marketing i management – každý trénuje na úlohách ze své agendy.",
    audience: "Týmy rozdělené podle rolí",
    size: "bloky po 6–10 lidech",
    duration: "3–4 hodiny na blok",
    output: "Ověření znalostí a report pro vedení",
    points: [
      "Cvičení na reálných e-mailech, nabídkách a tabulkách",
      "Knihovna promptů pro konkrétní role",
      "Krátké ověření znalostí na konci bloku",
      "Report: kdo absolvoval, co umí, kde jsou mezery",
    ],
  },
  {
    step: "03",
    slug: "prubezny-rozvoj",
    title: "Průběžný rozvoj",
    short: "Nástroje se mění každý měsíc. Pravidelné navazující bloky udrží tým v kondici.",
    audience: "Celá firma",
    size: "podle potřeby",
    duration: "měsíčně nebo kvartálně",
    output: "Přehled proškolenosti pro audit",
    points: [
      "Novinky v nástrojích přeložené do vaší praxe",
      "Konzultace k úlohám, které tým rozpracoval",
      "Školení nově nastoupených kolegů",
      "Průběžná evidence proškolenosti (např. pro AI Act)",
    ],
  },
];

export const included = [
  {
    code: "INC.01",
    title: "Příprava na míru",
    text: "Před školením projdeme vaše procesy a připravíme cvičení z vaší agendy. Žádné obecné příklady o psaní básniček.",
  },
  {
    code: "INC.02",
    title: "Materiály a šablony promptů",
    text: "Každý účastník dostane přehledné materiály a knihovnu ověřených promptů pro svou roli, kterou může používat hned druhý den.",
  },
  {
    code: "INC.03",
    title: "Report pro vedení",
    text: "Po školení dostanete shrnutí: kdo se zúčastnil, jak dopadlo ověření znalostí, kde vidíme největší potenciál a co doporučujeme dál.",
  },
];

export type TimelineEntry = { time: string; title: string; text: string; tag: string };

export const timeline: TimelineEntry[] = [
  {
    time: "09:00",
    title: "Kde jsme a co je možné",
    tag: "Kalibrace",
    text: "Krátká diagnostika: co už tým používá, kde naráží a co od dne čeká. Ukážeme, co dnešní nástroje opravdu umí – a kde si vymýšlejí.",
  },
  {
    time: "09:45",
    title: "Jak AI zadávat práci",
    tag: "Základy",
    text: "Struktura dobrého zadání: role, kontext, vstupy, formát výstupu. Každý si hned přepíše jeden svůj reálný úkol a porovná výsledek.",
  },
  {
    time: "10:30",
    title: "Bezpečně s daty",
    tag: "Bezpečnost",
    text: "Co do nástroje patří a co ne. Rozdíl mezi spotřebitelskou a firemní licencí, anonymizace a pravidla, která firma může vydat ještě ten den.",
  },
  {
    time: "11:15",
    title: "Dílna podle rolí",
    tag: "Praxe",
    text: "Práce na úlohách z vlastní agendy: obchod píše nabídky a follow-upy, administrativa zpracovává dokumenty, management připravuje podklady.",
  },
  {
    time: "12:30",
    title: "Oběd",
    tag: "Pauza",
    text: "Pauza. Často nejcennější část dne – lidé si navzájem ukazují, co jim fungovalo.",
  },
  {
    time: "13:15",
    title: "Tabulky, data a analýzy",
    tag: "Praxe",
    text: "Jak nechat AI vyčistit tabulku, najít v datech trend nebo připravit podklad pro poradu – a jak výsledek ověřit.",
  },
  {
    time: "14:15",
    title: "Vlastní knihovna promptů",
    tag: "Výstup",
    text: "Z nejlepších zadání dne sestavíme týmovou knihovnu promptů, kterou si účastníci odnesou a sdílejí.",
  },
  {
    time: "15:00",
    title: "Ověření a další kroky",
    tag: "Report",
    text: "Krátký praktický test, zpětná vazba a domluva na navazujícím bloku. Vedení dostane report do týdne.",
  },
];

export const faq = [
  {
    q: "Pro koho je školení určené?",
    a: "Pro firmy od 5 do několika stovek zaměstnanců, které chtějí, aby lidé používali AI na skutečnou práci. Technické znalosti účastníci nepotřebují.",
  },
  {
    q: "Jaké nástroje školíte?",
    a: "ChatGPT, Claude, Microsoft Copilot a Gemini. Školíme na tom, co ve firmě máte nebo plánujete mít. Když nástroj teprve vybíráte, doporučíme nezávisle.",
  },
  {
    q: "Probíhá školení u nás, nebo online?",
    a: "Obojí. Úvodní workshop doporučujeme prezenčně, navazující bloky fungují dobře i online.",
  },
  {
    q: "Co když naše data nesmí opustit firmu?",
    a: "Pravidla práce s daty jsou pevnou součástí každého školení. Pomůžeme nastavit, co do nástrojů patří, co ne a jak citlivé údaje anonymizovat.",
  },
  {
    q: "Jak poznáme, že školení mělo smysl?",
    a: "Každý blok končí krátkým ověřením znalostí a vedení dostane report. Doporučujeme si předem vybrat 2–3 úlohy a po měsíci změřit, kolik času na nich tým ušetřil.",
  },
  {
    q: "Pomůže nám školení se splněním AI Actu?",
    a: "AI Act ukládá firmám, které AI používají, přijmout opatření na podporu AI gramotnosti svých lidí – přiměřeně tomu, jak a k čemu AI používají. Školení i průběžná evidence proškolenosti vám k tomu dají podklady. Právní poradenství ale neposkytujeme.",
  },
  {
    q: "Kolik školení stojí?",
    a: "Cena závisí na počtu lidí, rozsahu přípravy a formátu. Po krátkém úvodním hovoru pošleme nabídku na míru. [DOPLNIT: orientační ceník, pokud ho chcete zveřejnit]",
  },
];

export const stats = [
  { value: "[DOPLNIT]", label: "proškolených lidí", note: "číslo doplnit" },
  { value: "[DOPLNIT]", label: "firem a týmů", note: "číslo doplnit" },
  { value: "[DOPLNIT]", label: "hodnocení účastníků", note: "např. 4,8 / 5" },
  { value: "4", label: "nástroje, které školíme", note: "ChatGPT · Claude · Copilot · Gemini" },
];

export const testimonials = [
  {
    quote: "[DOPLNIT] Citace spokojeného klienta – co se po školení v týmu změnilo.",
    who: "[DOPLNIT] Jméno Příjmení",
    role: "[DOPLNIT] pozice, firma",
  },
  {
    quote: "[DOPLNIT] Druhá reference – ideálně s konkrétním číslem ušetřeného času.",
    who: "[DOPLNIT] Jméno Příjmení",
    role: "[DOPLNIT] pozice, firma",
  },
];
