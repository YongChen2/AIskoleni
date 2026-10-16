# UPGRADE 2 — Modernizace vzhledu („ne jak z roku 2005“)

## Stav
Opravy už provedené ručně (jen commitnout):
- `src/components/hero3d/neural-canvas.tsx`: `advance(time / 1000)` – R3F s `frameloop="never"` bere čas v sekundách, dostával ms → síť rotovala ~1000× rychleji („točí se jak blázen“).
- `src/app/o-nas/page.tsx`: citát bez `dither-text` (tečkový vzor dělal při scrollu moiré = blikání) a menší velikost.

## Cíl
Web působí zastarale (terminál, scanlines, ASCII, mono všude, obří kapitálky). Nový směr: **moderní „engineering platform“ web roku 2026** – inspirace: https://dribbble.com/shots/26978736-Engineering-Platform-Web-Design-ZeBeyond (pokud uživatel vloží screenshot, řiď se jím přednostně). Styl jako Linear, Vercel, Raycast, Resend: tmavý, čistý, prémiový, technický, ale ne retro.

Použij skilly `taste-skill-frontend:design-taste-frontend` a `taste-skill-soft:high-end-visual-design`, pokud jsou dostupné. `DESIGN.md` přepiš na nový systém (staré Tactical Telemetry odstraň, ať si neodporují). Obsah, funkce, URL, SEO a výkonnostní rozpočet z UPGRADE-1 zůstávají.

## Nový design systém
### Barvy (tokeny v `src/config/brand.ts`)
- Pozadí `#08090B`, povrchy `#0E1014` / `#13161B`, okraje `rgba(255,255,255,0.08)`.
- Text `#F2F3F5`, sekundární `#9BA1AB`, terciární `#5D636D`.
- Akcent ponechat červený, ale modernější: `#FF3B3B` → hover `#FF5A4F`; jemné použití (CTA, highlighty, glow), ne plochy.
- Povolené: jemné radiální gradienty/glow za hero a klíčovými kartami (akcent ~8–15 % opacity), gradientové okraje karet (1px), jemný šum max 3 %.

### Typografie
- Nadpisy: **Geist** nebo **Inter Display** (600–700), sentence case (ne VELKÁ PÍSMENA), tracking −0.03 až −0.045em. H1 `clamp(2.75rem, 6vw, 5.5rem)` – výrazně menší než dnes.
- Text: Geist / Inter 16–18 px, line-height 1.6, barva sekundární.
- Mono (**Geist Mono**) jen na drobné štítky, čísla, kód a AI terminál – ne na odstavce a navigaci.
- Kapitálky jen u malých eyebrow štítků (12 px, tracking 0.08em).

### Tvary a povrchy
- Zaoblení: karty 16–20 px, tlačítka 10–12 px (nebo pill), inputy 10 px.
- Karty: povrch + 1px okraj + jemný vnitřní highlight nahoře, hover = světlejší okraj + jemný glow, ne posun layoutu.
- Header: sticky, průhledný s `backdrop-filter: blur(12px)` a okrajem dole až po scrollu.
- Bento grid pro výhody/formáty, velkorysé mezery (sekce 120–160 px desktop, 72–96 px mobil).

### Odstranit
Scanlines, CRT, dither/halftone, globální noise > 3 %, ASCII závorky `[ ]` v tlačítkách, `///`, `SEC.03`, `UNIT / A-01`, souřadnice, vlastní kurzor-zaměřovač, boot sekvence „SYSTEM BOOT“, dešifrování nadpisů (bliká), červeno-černé výstražné pruhy, obří přetékající numerály.

### Ponechat a modernizovat
- **3D hero síť**: zachovat, ale klidnější – pomalá rotace, jemná hloubka (fog/opacity podle vzdálenosti), body v bílé s nízkou opacitou + pár akcentních uzlů s glow, za ní radiální akcentní záře. Nesmí odvádět pozornost od nadpisu.
- **AI demo**: jako moderní produktová karta (styl chat/IDE okna s tečkami v rohu, tabs „Obchod / Marketing…“), streamovaný výstup, mono jen uvnitř.
- **Kalkulačka**: čisté slidery (zaoblené), výsledek ve velké kartě s animovaným číslem.
- **Semafor, kvíz, časová osa**: stejná funkce, moderní karty a odznaky (zelená/oranžová/červená jako jemné badge).
- **HUD** → jen tenký progress bar nahoře (2 px, akcent).
- **Spodní lišta na mobilu**: ponechat, ale jako moderní floating tab bar (zaoblená, blur).
- **Zvuky**: ponechat volitelné, přepínač jako malá ikona.

### Pohyb (plynulost je priorita)
- Lenis ponechat (lerp ~0.1), na dotyku nativní scroll.
- Reveal: fade + posun 16–24 px nahoru, 500–700 ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`, stagger 60–80 ms. Žádné clip-path „mechanické“ efekty, žádné blikání.
- Přechody stránek: jemný fade 200 ms.
- Mikrointerakce: tlačítka magnetický efekt jen na desktopu (max 4 px), hover glow.
- Hlídat: žádný prvek nesmí blikat/probliknout při načtení (FOUC, opacity 0 → pozdě spuštěný JS). Obsah nad ohybem viditelný hned ze SSR.

## Postup
1. Nový `DESIGN.md` + tokeny, fonty (Geist přes `next/font` / balíček `geist`) → build → commit
2. Globální styly, header, footer, tlačítka, karty, mobilní tab bar; odstranit retro efekty → commit
3. Úvod: hero (zklidněné 3D + glow), bento sekce, AI demo karta, kalkulačka, FAQ → commit
4. Podstránky: /skoleni, /bezpecnost, /nastroje, /kviz, /blog, /o-nas, /kontakt, právní, 404 → commit
5. Pohyb: reveal, přechody, mikrointerakce; kontrola že nic nebliká → commit
6. Audit: Lighthouse mobil ≥ 90, CLS < 0.05, 60 fps scroll; screenshoty mobil + desktop každé stránky a vlastní kontrola, že nic nevypadá retro/terminálově → oprav → commit + push

Po každém kroku `npm run build`, commit, push na `main`.
