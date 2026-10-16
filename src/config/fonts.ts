import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

/*
 * Makro a mikro písmo jsou self-hosted podmnožiny (src/fonts, OFL):
 * Latin + Latin-1 + Latin Extended-A (čeština, slovenština, němčina…), typografická interpunkce
 * a použité symboly (█ ░ ▒ ▓ ● ™ → ×). JetBrains Mono jako variabilní font omezený na 400–700.
 * Jeden soubor na rodinu místo dvou (latin + latin-ext) → méně dat před prvním vykreslením (LCP).
 * Přegenerování: viz src/fonts/README.md.
 */

/**
 * Makro typografie – nadpisy. `block`: nadpis se ukáže až s fontem (12 KB, přednačtený),
 * jinak by výměna fallbacku za úzké/široké písmo přezalomila obří nadpisy a posunula stránku (CLS).
 */
export const fontDisplay = localFont({
  src: "../fonts/ArchivoBlack-subset.woff2",
  weight: "400",
  display: "block",
  variable: "--font-display",
  fallback: ["Arial Black", "Arial", "sans-serif"],
});

/**
 * Mikro typografie i běžný text (LCP). `swap` s fallbackem stejné šířky znaku (0,6 em jako JetBrains Mono:
 * Menlo, Courier New, Android monospace) a pevnou výškou řádku → výměna fontu nic neposune.
 */
export const fontMono = localFont({
  src: "../fonts/JetBrainsMono-subset.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["Menlo", "Courier New", "monospace"],
});

/** Kontrastní serif – jen na /o-nas, proto se nepřednačítá */
export const fontSerif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  display: "swap",
  preload: false,
  variable: "--font-serif",
});

export const fontVariables = `${fontDisplay.variable} ${fontMono.variable} ${fontSerif.variable}`;
