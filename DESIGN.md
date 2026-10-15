# DESIGN — Industrial Brutalism / Tactical Telemetry

Závazný designový systém webu. Zdroj: skill `industrial-brutalist-ui`. Pokud ho máš v Claude Code k dispozici, načti ho taky.

## Zvolený archetyp: TACTICAL TELEMETRY (dark)
Jeden archetyp, jedna paleta, žádné míchání. Web má působit jako odtajněný řídicí terminál AI – „velín“, ze kterého firma ovládá své AI nástroje.

- Pouze tmavý režim (žádný light/dark přepínač).
- Žádné gradienty, měkké stíny, glassmorphism, průhlednost.
- `border-radius: 0` všude. Bez výjimky.

## Barvy (tokeny v `src/config/brand.ts` + CSS proměnné)
| Token | Hodnota | Použití |
|---|---|---|
| `--bg` | `#0A0A0A` | pozadí (ne čistá #000) |
| `--bg-2` | `#121212` | buňky gridu, panely |
| `--fg` | `#EAEAEA` | veškerý text |
| `--muted` | `#8A8A8A` | metadata, popisky |
| `--line` | `#2A2A2A` | dělicí čáry |
| `--accent` | `#FF2A2A` | JEDINÝ akcent: CTA, kritická data, tlusté dělicí linky, varování |
| `--signal` | `#4AF626` | POUZE jeden prvek na webu: status „SYSTÉM ONLINE“ u živého AI dema |

## Typografie
- **Makro (nadpisy):** Archivo Black (fallback Inter 900). UPPERCASE, `clamp(3.5rem, 10vw, 14rem)`, `letter-spacing: -0.04em`, `line-height: 0.88`.
- **Mikro (data, navigace, štítky, tlačítka):** JetBrains Mono. UPPERCASE, 11–14 px, `letter-spacing: 0.08em`, `line-height: 1.3`.
- **Běžný text (odstavce):** JetBrains Mono 15–16 px, normální casing, `line-height: 1.6`, max šířka ~68ch – čitelnost pro firemní klienty má přednost.
- **Kontrastní serif:** Playfair Display, max 1–2× na webu (např. citát v sekci O nás), s halftone/dither efektem.
- Fonty přes `next/font`, `display: swap`.

## Layout
- CSS Grid, prvky přikotvené ke stopám. Tenké linky přes `display:grid; gap:1px; background: var(--line)` a buňky s `background: var(--bg)`.
- Viditelné kompartmenty: rámečky 1px, přes celou šířku `<hr>` mezi sekcemi.
- Bimodální hustota: husté shluky mono metadat vs. obrovské prázdné plochy kolem makro typografie.
- Na průsečících gridu křížky `+`.

## Symbolika a komponenty
- ASCII rámování: `[ ŠKOLENÍ ]`, `< MODUL 02 >`, `>>>`, `///`.
- Technické štítky: `REV 2.6`, `UNIT / A-01`, `SEC.03`, `STATUS: AKTIVNÍ`, souřadnice, timestampy.
- ®, ©, ™ jako geometrické prvky, ne právní text.
- Čárové kódy (opakující se svislé linky), tlusté výstražné pruhy (červeno-černé diagonály) u bezpečnosti dat.
- Tlačítka: obdélník, 1px rámeček, mono uppercase `[ DOMLUVIT ŠKOLENÍ ]`, hover = invert (bg `--fg`, text `--bg`) nebo výplň `--accent`. Žádné zaoblení, žádný stín.
- Čísla v kalkulačce/statistikách: obří makro numerály, které klidně přetékají z viewportu.
- Sémantické tagy: `<data>`, `<output>`, `<samp>`, `<kbd>`, `<dl>`.

## Analogová degradace
- CRT scanlines na pozadí: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)`.
- Globální SVG noise/grain overlay s nízkou opacitou na rootu.
- Fotky (o nás, placeholdery) jen jako 1-bit dither / halftone, grayscale.
- Jemný phosphor glow jen u `--signal` a u kurzoru v terminálu.

## Jak to aplikovat na funkce z BRIEF.md
- **3D hero:** drátěný / bodový mrak „neuronové sítě“ v `--fg` s pár uzly v `--accent`, bez světel a stínů, reaguje na myš. Kolem HUD rámeček s křížky a živými mono souřadnicemi kurzoru.
- **AI demo:** vzhled terminálu – prompt `>`, blikající blokový kurzor, streamovaný výstup, status `● SYSTÉM ONLINE` v `--signal`.
- **Kalkulačka:** ovládací panel s posuvníky (hranaté), výstup jako obří numerály v `<output>`.
- **Datový semafor:** tři kontejnery `[ ZELENÁ ]` `[ ORANŽOVÁ ]` `[ ČERVENÁ ]` – barvy semaforu jen jako tenké značky/štítky, ne plochy; červená = `--accent`.
- **Časová osa dne:** log záznamy `09:00 >>> KDE JSME A CO JE MOŽNÉ`.
- **Kvíz:** diagnostika systému, výsledek jako report „STUPEŇ PŘIPRAVENOSTI: 62 %“.
- **Animace:** mechanické, ne „měkké“ – stepped easing, typewriter, rychlé ořezové odkrývání (clip-path), glitch max při přechodech. `prefers-reduced-motion` vše vypne.

## Zakázáno
Gradienty, zaoblené rohy, měkké stíny, emoji, ikonky ve stylu SaaS, pastelové barvy, druhá akcentní barva, stock fotky s úsměvy, generické „hero s mockupem notebooku“.
