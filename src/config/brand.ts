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
    subtle: "#5D636D",
    accent: "#FF3B3B",
    accentHover: "#FF5A4F",
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

export const brandCssVars = {
  "--bg": brand.colors.bg,
  "--surface": brand.colors.surface,
  "--surface-2": brand.colors.surface2,
  "--line": brand.colors.border,
  "--line-strong": brand.colors.borderStrong,
  "--fg": brand.colors.fg,
  "--muted": brand.colors.muted,
  "--subtle": brand.colors.subtle,
  "--accent": brand.colors.accent,
  "--accent-hover": brand.colors.accentHover,
  "--success": brand.colors.success,
  "--warning": brand.colors.warning,
} as React.CSSProperties;
