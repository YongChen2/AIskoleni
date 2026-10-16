/** Registr článků. Tělo článku je v `<slug>.mdx` ve stejné složce. */
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  tag: string;
};

export const posts: Post[] = [
  {
    slug: "5-uloh-ai-v-obchode",
    title: "5 úloh, které AI zvládne v obchodě",
    description:
      "Follow-upy, příprava na schůzku, nabídky, zápisy a analýza ztracených obchodů. Pět úloh, kde obchodníkům AI ušetří nejvíc času.",
    date: "2026-09-08",
    readingMinutes: 5,
    tag: "Obchod",
  },
  {
    slug: "co-nikdy-nedavat-do-chatgpt",
    title: "Co nikdy nedávat do ChatGPT",
    description:
      "Osobní údaje, hesla, nezveřejněná čísla. Jaká data do AI nástrojů nepatří, proč a jak s nimi přesto pracovat bezpečně.",
    date: "2026-09-22",
    readingMinutes: 6,
    tag: "Bezpečnost",
  },
  {
    slug: "copilot-vs-claude-ve-firme",
    title: "Copilot vs. Claude ve firmě",
    description:
      "Microsoft Copilot žije v Outlooku a Teams, Claude vyniká v práci s textem. Kdy se hodí který a proč se často vyplatí oba.",
    date: "2026-10-06",
    readingMinutes: 5,
    tag: "Nástroje",
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(iso));
