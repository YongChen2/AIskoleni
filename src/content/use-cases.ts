/**
 * Galerie „Co AI zvládne za vás“ (úvod). Úspora času je orientační odhad pro typický případ –
 * na webu je tak výslovně označená. Ukázka = zkrácený výstup, ne celý text.
 */
export type UseCase = {
  role: string;
  task: string;
  before: string;
  after: string;
  sample: string;
  illo: "doc" | "mail" | "table" | "chart" | "stack" | "person" | "chat" | "compare" | "trend" | "book";
};

export const useCases: UseCase[] = [
  {
    role: "Obchod",
    task: "Nabídka na míru z poznámek ze schůzky",
    before: "2 h",
    after: "15 min",
    sample: "Potřeby klienta → 3 přínosy jeho jazykem → struktura nabídky → ceny k doplnění",
    illo: "doc",
  },
  {
    role: "Obchod",
    task: "Follow-up e-mail s dohodnutými kroky",
    before: "30 min",
    after: "5 min",
    sample: "Děkuji za čtvrteční schůzku. Shrnuji, na čem jsme se dohodli: …",
    illo: "mail",
  },
  {
    role: "Administrativa",
    task: "Podklady z faktur do přehledné tabulky",
    before: "3 h",
    after: "40 min",
    sample: "Dodavatel | Číslo | Částka | Splatnost – 40 faktur, 2 s chybějícím údajem",
    illo: "table",
  },
  {
    role: "Management",
    task: "Shrnutí měsíčního reportu pro poradu",
    before: "1 h",
    after: "10 min",
    sample: "3 hlavní zjištění · 2 rizika · 1 rozhodnutí, které potřebujeme dnes",
    illo: "chart",
  },
  {
    role: "Marketing",
    task: "10 variant příspěvku na sociální sítě",
    before: "2 h",
    after: "20 min",
    sample: "A: věcně s číslem · B: příběh zákazníka · C: otázka na čtenáře · …",
    illo: "stack",
  },
  {
    role: "HR",
    task: "Inzerát a otázky k pohovoru",
    before: "1,5 h",
    after: "15 min",
    sample: "Co budete dělat · Co nabízíme · 6 otázek na zkušenosti z praxe",
    illo: "person",
  },
  {
    role: "Zákaznická podpora",
    task: "Odpovědi na opakované dotazy",
    before: "20 min",
    after: "3 min",
    sample: "Dobrý den, objednávku jsme předali dopravci, sledovat ji můžete zde: …",
    illo: "chat",
  },
  {
    role: "Nákup",
    task: "Porovnání nabídek tří dodavatelů",
    before: "2 h",
    after: "20 min",
    sample: "Cena · dodací lhůta · záruka · rizika ve smlouvě – doporučení s odůvodněním",
    illo: "compare",
  },
  {
    role: "Finance",
    task: "Komentář k výsledkům za kvartál",
    before: "1 h",
    after: "15 min",
    sample: "Tržby +8 %, náklady +12 %: marže se zužuje, hlavní tlak energie a mzdy",
    illo: "trend",
  },
  {
    role: "Interní komunikace",
    task: "Návod pro kolegy krok za krokem",
    before: "2 h",
    after: "30 min",
    sample: "1. Otevřete sdílenou složku · 2. Zvolte šablonu · 3. Vyplňte jen žluté buňky",
    illo: "book",
  },
];
