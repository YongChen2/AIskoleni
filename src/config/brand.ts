/**
 * Jediné místo pro značku. Změnou tohoto souboru se přebarví a přejmenuje celý web.
 * Barvy se propisují do CSS proměnných v `src/app/layout.tsx` (viz `brandCssVars`).
 * Fonty se mění v `src/config/fonts.ts`.
 */
export const brand = {
  name: "AI Akademie",
  /** Krátká značka do HUD prvků a štítků */
  code: "AA",
  mark: "®",
  claim: "AI ve firmě, která opravdu pracuje",
  description:
    "Praktická firemní školení AI podle rolí. Úvodní workshop pro vedení, školení týmů a průběžný rozvoj – s reportem pro vedení a bezpečnou prací s daty.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-skoleni.vercel.app",
  locale: "cs_CZ",
  revision: "REV 1.0",

  contact: {
    email: "[DOPLNIT]@example.cz",
    phone: "[DOPLNIT] +420 000 000 000",
    company: "[DOPLNIT] Název s.r.o.",
    ico: "[DOPLNIT] IČO",
    address: "[DOPLNIT] Ulice 1, 110 00 Praha",
    coords: "50.0755°N 14.4378°E",
  },

  colors: {
    bg: "#0A0A0A",
    bg2: "#121212",
    fg: "#EAEAEA",
    muted: "#8A8A8A",
    line: "#2A2A2A",
    accent: "#FF2A2A",
    signal: "#4AF626",
    /** Pouze tenké značky v datovém semaforu (/bezpecnost) */
    trafficGreen: "#3DBA4E",
    trafficOrange: "#FF9A1F",
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

export const brandCssVars = {
  "--bg": brand.colors.bg,
  "--bg-2": brand.colors.bg2,
  "--fg": brand.colors.fg,
  "--muted": brand.colors.muted,
  "--line": brand.colors.line,
  "--accent": brand.colors.accent,
  "--signal": brand.colors.signal,
} as React.CSSProperties;
