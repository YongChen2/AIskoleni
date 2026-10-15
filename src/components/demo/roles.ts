export const demoRoles = [
  {
    id: "obchod",
    label: "Obchod",
    example: "Napiš follow-up e-mail klientovi, který byl minulý týden na prezentaci, ale zatím se neozval.",
  },
  {
    id: "administrativa",
    label: "Administrativa",
    example: "Připrav přehlednou tabulku z faktur, které mi chodí e-mailem, a navrhni, jak je třídit.",
  },
  {
    id: "management",
    label: "Management",
    example: "Shrň výsledky kvartálu pro poradu vedení – tržby rostly o 8 %, náklady o 12 %, máme dvě nové zakázky.",
  },
  {
    id: "marketing",
    label: "Marketing",
    example: "Navrhni tři varianty příspěvku na LinkedIn o tom, že rozšiřujeme výrobu.",
  },
] as const;

export type DemoRoleId = (typeof demoRoles)[number]["id"];

export const DEMO_DAILY_LIMIT = 5;
export const DEMO_MAX_TASK = 600;

/** Oddělovače sekcí ve streamované odpovědi */
export const MARK_OUTPUT = "===VYSTUP===";
export const MARK_PROMPT = "===PROMPT===";
