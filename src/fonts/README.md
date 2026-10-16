# Fonty (self-hosted podmnožiny)

- `ArchivoBlack-subset.woff2` – Archivo Black, © The Archivo Black Project Authors, SIL OFL 1.1
- `JetBrainsMono-subset.woff2` – JetBrains Mono (variabilní, osa wght 400–700), © The JetBrains Mono Project Authors, SIL OFL 1.1

Podmnožina: `U+0020-007E, U+00A0-017F, U+2010-2027, U+2030-203A, U+20AC, U+2122, U+2190-2199, U+2212, U+2264-2265, U+2580-259F, U+25A0-25CF, U+2715`

Přegenerování (fonttools + brotli):

```bash
U="U+0020-007E,U+00A0-017F,U+2010-2027,U+2030-203A,U+20AC,U+2122,U+2190-2199,U+2212,U+2264-2265,U+2580-259F,U+25A0-25CF,U+2715"
fonttools varLib.instancer "JetBrainsMono[wght].ttf" wght=400:700 -o JBM.ttf
pyftsubset JBM.ttf --unicodes="$U" --flavor=woff2 --no-hinting --layout-features='kern,liga,calt,locl,mark,mkmk,ccmp' --output-file=JetBrainsMono-subset.woff2
pyftsubset ArchivoBlack-Regular.ttf --unicodes="$U" --flavor=woff2 --no-hinting --layout-features='kern,liga,locl,mark,mkmk,ccmp' --output-file=ArchivoBlack-subset.woff2
```

Pokud web začne používat znaky mimo podmnožinu (např. jiný jazyk), rozšiřte rozsah.
