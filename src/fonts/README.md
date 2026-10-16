# Fonty (self-hosted podmnožiny)

- `Geist-subset.woff2` – Geist (variabilní, osa wght 400–700), © Vercel, SIL OFL 1.1
- `GeistMono-subset.woff2` – Geist Mono (variabilní, osa wght 400–600), © Vercel, SIL OFL 1.1

Zdroj: npm balíček `geist` (`dist/fonts/geist-sans/Geist-Variable.ttf`, `dist/fonts/geist-mono/GeistMono-Variable.ttf`).

Podmnožina: `U+0020-007E, U+00A0-017F, U+2010-2027, U+2030-203A, U+20AC, U+2122, U+2190-2199, U+2212, U+2264-2265, U+25CF, U+2713, U+2715`

Přegenerování (fonttools + brotli):

```bash
U="U+0020-007E,U+00A0-017F,U+2010-2027,U+2030-203A,U+20AC,U+2122,U+2190-2199,U+2212,U+2264-2265,U+25CF,U+2713,U+2715"
fonttools varLib.instancer Geist-Variable.ttf wght=400:700 -o GS.ttf
fonttools varLib.instancer GeistMono-Variable.ttf wght=400:600 -o GM.ttf
pyftsubset GS.ttf --unicodes="$U" --flavor=woff2 --no-hinting --layout-features='kern,liga,calt,locl,mark,mkmk,ccmp,tnum,ss01' --output-file=Geist-subset.woff2
pyftsubset GM.ttf --unicodes="$U" --flavor=woff2 --no-hinting --layout-features='kern,liga,calt,locl,mark,mkmk,ccmp' --output-file=GeistMono-subset.woff2
```

Pokud web začne používat znaky mimo podmnožinu (např. jiný jazyk), rozšiřte rozsah.
