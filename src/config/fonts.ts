import { Archivo_Black, JetBrains_Mono, Playfair_Display } from "next/font/google";

/** Makro typografie – nadpisy */
export const fontDisplay = Archivo_Black({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

/** Mikro typografie i běžný text */
export const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-mono",
});

/** Kontrastní serif – max 1–2× na webu */
export const fontSerif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  display: "swap",
  variable: "--font-serif",
});

export const fontVariables = `${fontDisplay.variable} ${fontMono.variable} ${fontSerif.variable}`;
