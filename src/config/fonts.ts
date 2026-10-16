import localFont from "next/font/local";

/*
 * Geist a Geist Mono jako self-hosted podmnožiny (src/fonts, OFL):
 * Latin + Latin-1 + Latin Extended-A (čeština, slovenština, němčina…), typografická interpunkce a pár symbolů.
 * Variabilní fonty → jeden soubor na rodinu pro všechny řezy. Přegenerování: viz src/fonts/README.md.
 */

/**
 * Nadpisy i běžný text. `swap` + automaticky dopočítaný fallback (Arial se size-adjust/ascent-override
 * podle metrik Geistu) → výměna fontu text téměř neposune (CLS).
 */
export const fontSans = localFont({
  src: "../fonts/Geist-subset.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

/**
 * Jen drobné štítky, čísla, kód a AI terminál. Nepřednačítá se (není v LCP);
 * fallback má stejnou šířku znaku (0,6 em) → výměna nic neposune.
 */
export const fontMono = localFont({
  src: "../fonts/GeistMono-subset.woff2",
  weight: "400 600",
  display: "swap",
  preload: false,
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "Menlo", "Courier New", "monospace"],
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
