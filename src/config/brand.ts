/**
 * Jediné místo pro značku. Změnou tohoto souboru se přebarví a přejmenuje celý web.
 * Barvy se propisují do CSS proměnných v `src/app/layout.tsx` (viz `brandCssVars`).
 * Fonty se mění v `src/config/fonts.ts`.
 */
export const brand = {
  name: "AI Akademie",
  claim: "AI ve firmě, která opravdu pracuje",
  description:
    "Praktická firemní školení AI podle rolí. Úvodní workshop pro vedení, školení týmů a průběžný rozvoj – s reportem pro vedení a bezpečnou prací s daty.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-skoleni.vercel.app",
  locale: "cs_CZ",

  contact: {
    email: "[DOPLNIT]@example.cz",
    phone: "[DOPLNIT] +420 000 000 000",
    company: "[DOPLNIT] Název s.r.o.",
    ico: "[DOPLNIT] IČO",
    address: "[DOPLNIT] Ulice 1, 110 00 Praha",
  },

  colors: {
    bg: "#08090B",
    /** Povrchy karet (1. a 2. úroveň) */
    surface: "#0E1014",
    surface2: "#13161B",
    /** Okraje – průhledná bílá, aby seděly na jakémkoli povrchu */
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.14)",
    /** Neprůhledný ekvivalent `border` na pozadí (WebGL, OG obrázky) */
    borderSolid: "#1C1D1F",
    fg: "#F2F3F5",
    muted: "#9BA1AB",
    subtle: "#7D838D",
    accent: "#FF3B3B",
    accentHover: "#FF5A4F",
    /** Pozadí primárních tlačítek – tmavší akcent kvůli kontrastu bílého textu (4,66 : 1, WCAG AA) */
    accentStrong: "#E0282D",
    /** Stavové odznaky (semafor, kvíz, online stav dema) – jen jemně, ne plochy */
    success: "#3DD68C",
    warning: "#F5A524",
  },
} as const;

export const nav = [
  { href: "/skoleni", label: "Školení" },
  { href: "/bezpecnost", label: "Bezpečnost" },
  { href: "/nastroje", label: "Nástroje" },
  { href: "/kviz", label: "Kvíz" },
  { href: "/blog", label: "Blog" },
  { href: "/o-nas", label: "O nás" },
] as const;

/**
 * Tři barevná prostředí (UPGRADE-4): sekce s `data-theme="dark|light|accent"` přepíše tokeny níže.
 * `tint` = barva jemných překryvů (hover, stopy posuvníků), `onAccent` = text na primárním tlačítku.
 * Kontrast AA je ověřený pro text `fg`, `muted` i `subtle` na `bg` i `surface` každého theme.
 */
const themes = {
  dark: {
    bg: brand.colors.bg,
    surface: brand.colors.surface,
    surface2: brand.colors.surface2,
    border: brand.colors.border,
    borderStrong: brand.colors.borderStrong,
    fg: brand.colors.fg,
    muted: brand.colors.muted,
    subtle: brand.colors.subtle,
    accent: brand.colors.accent,
    accentHover: brand.colors.accentHover,
    accentStrong: brand.colors.accentStrong,
    onAccent: "#FFFFFF",
    success: brand.colors.success,
    warning: brand.colors.warning,
    tint: "#FFFFFF",
    edge: "rgba(255,255,255,0.16)",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px -30px rgba(0,0,0,0.7)",
    scheme: "dark",
  },
  light: {
    /** teplý papír */
    bg: "#F5F4F1",
    surface: "#FFFFFF",
    surface2: "#F0EFEB",
    border: "rgba(8,9,11,0.08)",
    borderStrong: "rgba(8,9,11,0.16)",
    fg: "#0B0C0E",
    muted: "#555A62",
    /** 5,0 : 1 na papíru */
    subtle: "#646973",
    accent: "#E0282D",
    /** text v akcentu (odznaky, ikony) – tmavší kvůli kontrastu malého písma (5,6 : 1) */
    accentHover: "#BE1D23",
    accentStrong: "#E0282D",
    onAccent: "#FFFFFF",
    success: "#0F7A45",
    warning: "#9A5800",
    tint: "#0B0C0E",
    edge: "rgba(8,9,11,0.10)",
    shadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
    scheme: "light",
  },
  accent: {
    bg: "#E0282D",
    surface: "rgba(255,255,255,0.06)",
    surface2: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.22)",
    borderStrong: "rgba(255,255,255,0.4)",
    /** na červené projde AA jen čistě bílá (4,66 : 1) → všechny úrovně textu bílé */
    fg: "#FFFFFF",
    muted: "#FFFFFF",
    subtle: "#FFFFFF",
    accent: "#FFFFFF",
    accentHover: "#FFE6E3",
    /** primární tlačítko je bílé s tmavým textem */
    accentStrong: "#FFFFFF",
    onAccent: "#0B0C0E",
    success: "#FFFFFF",
    warning: "#FFFFFF",
    /** tmavé překryvy (hover, aktivní odkaz) → bílý text na nich má víc kontrastu */
    tint: "#000000",
    edge: "rgba(255,255,255,0.35)",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 60px -30px rgba(80,0,0,0.6)",
    scheme: "dark",
  },
} as const;

export type ThemeName = keyof typeof themes;
export const themeBg = { dark: themes.dark.bg, light: themes.light.bg, accent: themes.accent.bg } as const;

const vars = (t: (typeof themes)[ThemeName]) =>
  [
    ["--bg", t.bg],
    ["--surface", t.surface],
    ["--surface-2", t.surface2],
    ["--line", t.border],
    ["--line-strong", t.borderStrong],
    ["--fg", t.fg],
    ["--muted", t.muted],
    ["--subtle", t.subtle],
    ["--accent", t.accent],
    ["--accent-hover", t.accentHover],
    ["--accent-strong", t.accentStrong],
    ["--on-accent", t.onAccent],
    ["--success", t.success],
    ["--warning", t.warning],
    ["--tint", t.tint],
    ["--edge", t.edge],
    ["--shadow-card", t.shadow],
  ] as const;

/** CSS pro `[data-theme]` – vkládá se do <head> v layoutu */
export const themeCss = (Object.keys(themes) as ThemeName[])
  .map((n) => `[data-theme="${n}"]{${vars(themes[n]).map(([k, v]) => `${k}:${v}`).join(";")};color-scheme:${themes[n].scheme};color:var(--fg)}`)
  .join("\n");

export const brandCssVars = Object.fromEntries(vars(themes.dark)) as React.CSSProperties;
