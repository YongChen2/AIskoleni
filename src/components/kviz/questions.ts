export type Area = "strategie" | "nastroje" | "data" | "lide";

export const areas: Record<Area, string> = {
  strategie: "Strategie",
  nastroje: "Nástroje",
  data: "Data a bezpečnost",
  lide: "Lidé a dovednosti",
};

export type Question = {
  id: string;
  area: Area;
  q: string;
  options: { label: string; score: 0 | 1 | 2 | 3 }[];
};

export const questions: Question[] = [
  {
    id: "q1",
    area: "strategie",
    q: "Má vedení jasnou představu, k čemu má AI ve firmě sloužit?",
    options: [
      { label: "Zatím jsme to neřešili", score: 0 },
      { label: "Bavíme se o tom, ale bez konkrétních cílů", score: 1 },
      { label: "Máme pár vytipovaných oblastí", score: 2 },
      { label: "Ano, s konkrétními úlohami a měřením", score: 3 },
    ],
  },
  {
    id: "q2",
    area: "nastroje",
    q: "Jaké AI nástroje lidé ve firmě používají?",
    options: [
      { label: "Žádné, nebo o tom nevíme", score: 0 },
      { label: "Každý, co si sám najde, na osobních účtech", score: 1 },
      { label: "Část týmu má firemní licence", score: 2 },
      { label: "Firemní licence pro všechny, kdo je potřebují", score: 3 },
    ],
  },
  {
    id: "q3",
    area: "data",
    q: "Existují pravidla, jaká data se smí do AI vkládat?",
    options: [
      { label: "Ne", score: 0 },
      { label: "Neformálně, každý to chápe jinak", score: 1 },
      { label: "Ano, ale lidé je moc neznají", score: 2 },
      { label: "Ano, sepsaná a lidé je znají", score: 3 },
    ],
  },
  {
    id: "q4",
    area: "lide",
    q: "Kolik lidí používá AI aspoň jednou týdně na skutečnou práci?",
    options: [
      { label: "Skoro nikdo", score: 0 },
      { label: "Pár nadšenců", score: 1 },
      { label: "Zhruba polovina", score: 2 },
      { label: "Většina týmu", score: 3 },
    ],
  },
  {
    id: "q5",
    area: "lide",
    q: "Jak lidé AI obvykle zadávají práci?",
    options: [
      { label: "Nevím / nepoužívají ji", score: 0 },
      { label: "Krátké dotazy jako do vyhledávače", score: 1 },
      { label: "Někteří dávají kontext a příklady", score: 2 },
      { label: "Strukturovaně, máme sdílené prompty", score: 3 },
    ],
  },
  {
    id: "q6",
    area: "strategie",
    q: "Měříte, kolik času AI ušetří?",
    options: [
      { label: "Ne", score: 0 },
      { label: "Jen odhadem z pocitu", score: 1 },
      { label: "U několika úloh ano", score: 2 },
      { label: "Ano, systematicky", score: 3 },
    ],
  },
  {
    id: "q7",
    area: "data",
    q: "Ví vaše firma, které dokumenty a systémy obsahují osobní nebo citlivá data?",
    options: [
      { label: "Spíš ne", score: 0 },
      { label: "Částečně", score: 1 },
      { label: "Ano, ale není to sepsané", score: 2 },
      { label: "Ano, máme to zmapované", score: 3 },
    ],
  },
  {
    id: "q8",
    area: "nastroje",
    q: "Je AI napojená na nástroje, které denně používáte (e-mail, dokumenty, CRM)?",
    options: [
      { label: "Ne", score: 0 },
      { label: "Lidé kopírují texty ručně", score: 1 },
      { label: "Částečně, např. Copilot v Office", score: 2 },
      { label: "Ano, AI je součástí našich procesů", score: 3 },
    ],
  },
  {
    id: "q9",
    area: "lide",
    q: "Prošli lidé nějakým školením práce s AI?",
    options: [
      { label: "Ne", score: 0 },
      { label: "Jen samostudium nebo webinář", score: 1 },
      { label: "Část týmu", score: 2 },
      { label: "Ano, podle rolí a s ověřením znalostí", score: 3 },
    ],
  },
];

export function recommend(pct: number) {
  if (pct < 40)
    return {
      slug: "uvodni-workshop",
      title: "Úvodní workshop",
      text: "Začněte s vedením: ujasněte si, kde AI dává smysl, vyberte nástroje a vydejte pravidla pro data. Teprve pak má smysl školit týmy.",
    };
  if (pct < 75)
    return {
      slug: "skoleni-tymu",
      title: "Školení týmů podle rolí",
      text: "Základy máte, teď je potřeba dostat AI do práce celého týmu. Školení podle rolí z nadšenců udělá standard.",
    };
  return {
    slug: "prubezny-rozvoj",
    title: "Průběžný rozvoj",
    text: "Jste dál než většina firem. Pravidelné navazující bloky vás udrží na špičce a dají vám evidenci proškolenosti.",
  };
}
