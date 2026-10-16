# DESIGN — Engineering Platform (2026)

Závazný designový systém webu. Nahrazuje původní „Tactical Telemetry“. Pokud je k dispozici, řiď se i skilly
`taste-skill-frontend:design-taste-frontend` a `taste-skill-soft:high-end-visual-design`.

**Směr:** moderní web technické platformy. Inspirace: Linear, Vercel, Raycast, Resend.
Má být tmavý, čistý, prémiový a technický, ale ne retro. Web má působit jako produkt, kterému firma svěří své lidi,
ne jako terminál. Výkonnostní rozpočet z `UPGRADE-1.md`, sekce 0, platí dál a má přednost před efekty.

Nastavení: `VARIANCE 6 / MOTION 5 / DENSITY 4`. Rozvržení je asymetrické, ale klidné. Pohyb je jemný a vždy
motivovaný. Hustota je vzdušná.

## Barvy (tokeny v `src/config/brand.ts` → CSS proměnné)
| Token | Hodnota | Použití |
|---|---|---|
| `--bg` | `#08090B` | pozadí stránky |
| `--surface` | `#0E1014` | karty, panely |
| `--surface-2` | `#13161B` | vnořené povrchy, inputy, hover |
| `--line` | `rgba(255,255,255,0.08)` | okraje, oddělovače |
| `--line-strong` | `rgba(255,255,255,0.14)` | hover okraj, aktivní stav |
| `--fg` | `#F2F3F5` | nadpisy, důležitý text |
| `--muted` | `#9BA1AB` | běžný text odstavců (sekundární) |
| `--subtle` | `#7D838D` | popisky, metadata (terciární; ~5 : 1 na povrchu – zvednuto z #5D636D kvůli WCAG AA) |
| `--accent` | `#FF3B3B` | jediný akcent: primární CTA, highlighty, glow |
| `--accent-hover` | `#FF5A4F` | světlejší akcent: text odznaků, ikony, přechod v `.hl` |
| `--accent-strong` | `#E0282D` | pozadí primárních tlačítek (bílý text 4,66 : 1); hover = silnější záře, ne světlejší barva |
| `--success` / `--warning` | `#3DD68C` / `#F5A524` | jen stavové odznaky (semafor, kvíz, online stav dema) |

Pravidla:
- Akcent se používá střídmě: CTA, jedno zvýrazněné slovo v nadpisu, tečka u odznaku, záře. Velké červené plochy nedělat.
- Povolené jsou jemné radiální gradienty a záře za hero a klíčovými kartami (akcent na 8–15 % opacity),
  gradientové okraje karet o šířce 1 px a šum nejvýš 3 %.
- Zakázané jsou fialovo-modré „AI“ gradienty, neon, druhý akcent, světlý režim a míchání teplých a studených šedí.

## Barevná prostředí (UPGRADE-4)
Tři theme přes `data-theme` na sekci; tokeny pro všechna tři generuje `brand.ts` (`themeCss`).

| Token | dark | light (teplý papír) | accent (červená plocha) |
|---|---|---|---|
| `--bg` | `#08090B` | `#F5F4F1` | `#E0282D` |
| `--surface` / `--surface-2` | `#0E1014` / `#13161B` | `#FFFFFF` / `#F0EFEB` | bílá 6 % / 10 % |
| `--line` | bílá 8 % | `rgba(8,9,11,0.08)` | bílá 22 % |
| `--fg` / `--muted` / `--subtle` | `#F2F3F5` / `#9BA1AB` / `#7D838D` | `#0B0C0E` / `#555A62` / `#646973` | vše bílá (AA na červené projde jen bílá) |
| `--accent-hover` (text v akcentu) | `#FF5A4F` | `#BE1D23` | `#FFE6E3` |
| primární tlačítko | `#E0282D` + bílý text | `#E0282D` + bílý text | bílé + tmavý text (`--on-accent`) |
| stín karty (`--shadow-card`) | tmavý difuzní | `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)` | jemný |

- `--tint` je barva jemných překryvů (`bg-tint/[0.06]` místo `bg-white/…`), v light je tmavá.
- **Dramaturgie úvodu:** hero (dark) → problém, formáty (light) → AI demo (dark) → kalkulačka, čísla, FAQ (light)
  → CTA (accent) → patička (dark). Podstránky: hero dark, obsah light, CTA accent.
- **Plynulý přechod:** pás = sekce s `data-band`. `ThemeBackdrop` drží pod obsahem pevnou vrstvu se třemi plochami
  a prolíná jen jejich opacity, zatímco hranice pásů jede od 80 % do 50 % výšky viewportu. Bez JS má každý pás
  vlastní pozadí. Hlavička přebírá theme pásu pod sebou.

## Typografie
- **Font:** Geist (sans) pro nadpisy i text, Geist Mono jen na drobné štítky, čísla, kód a AI terminál.
  Fonty jsou self-hosted podmnožiny v `src/fonts`, viz `src/config/fonts.ts`.
- **H1:** `clamp(2.75rem, 6vw, 5.5rem)`, řez 600, tracking −0.045em, line-height 1.02. Sentence case.
- **H2:** `clamp(2rem, 4vw, 3.5rem)`, řez 600, tracking −0.04em, line-height 1.08.
- **H3:** 20–24 px, řez 600, tracking −0.02em.
- **Text:** 16–18 px, line-height 1.6, barva `--muted`, šířka nejvýš ~65ch.
- **Eyebrow:** 12 px, kapitálky, tracking 0.08em, barva `--muted`. Nejvýš jeden na tři sekce a jen jako malý štítek.
- **Mono:** 12–13 px, bez kapitálek (kromě eyebrow), tabulková čísla `tabular-nums`.
- Velká písmena se jinde nepoužívají. Nadpisy nejsou obří a nepřetékají ze stránky.
- Nemíchat fonty kvůli zvýraznění. Zvýraznění řeší barva `--fg` nebo `--accent`.

## Tvary a povrchy
- **Zaoblení:** karty 16–20 px (`--radius-card: 18px`), vnořené prvky 12 px, tlačítka 10–12 px nebo pill, inputy 10 px.
  Rohy musí být konzistentní: hranaté prvky se nemíchají se zaoblenými.
- **Karta (`.card`):** `--surface`, okraj 1 px `--line` a jemný vnitřní highlight nahoře
  (`inset 0 1px 0 rgba(255,255,255,0.04)`). Na hover se zesvětlí okraj (`--line-strong`) a přidá se jemná záře.
  Hover nesmí posouvat layout.
- **Klíčová karta (`.card-glow`):** jako `.card` a navíc gradientový okraj 1 px (bílá → akcent) a radiální záře za kartou.
- **Stíny:** jen difuzní a tmavé s nízkou opacitou (`0 20px 60px -20px rgba(0,0,0,0.6)`). Ostré černé stíny jsou zakázané.
- **Mřížka:** max. šířka obsahu 1200 px (`.shell`), boční okraje 20 px na mobilu a 32 px na desktopu.
- **Mezery:** sekce mají 128–160 px na desktopu a 80–96 px na mobilu (`.section`).
- **Bento grid** se používá pro výhody, formáty a principy. Má různě velké buňky a tolik buněk, kolik je obsahu.

## Komponenty
- **Header:** sticky, průhledný. Po odscrollování dostane `backdrop-filter: blur(12px)`, poloprůhledné pozadí
  a okraj dole. Má jeden řádek a výšku 64 px. Logo vlevo, navigace uprostřed, CTA vpravo.
- **Tlačítka:**
  - `.btn-primary`: `--accent-strong`, bílý text, radius 10 px, výška 44 px a jemná vnitřní záře.
  - `.btn-secondary`: `--surface-2`, okraj `--line`.
  - `.btn-ghost`: jen text.
  - Text tlačítka je vždy na jednom řádku a bez hranatých závorek. Šipka `→` může být v kruhu na konci.
  - `:active` = `scale(0.98)`. Na desktopu mají tlačítka magnetický efekt (posun max. 4 px).
- **Odznak (`.badge`):** pill, 12 px, okraj `--line`, volitelná barevná tečka (success, warning nebo accent).
- **Eyebrow (`.eyebrow`):** malý štítek nad nadpisem sekce, volitelně s tečkou v akcentu.
- **Inputy:** `--surface-2`, okraj `--line`, radius 10 px. Při focusu okraj `--line-strong` a prstenec v akcentu na 25 %.
  Label je vždy nad polem a chyba pod ním. Placeholder nenahrazuje label.
- **Slidery:** zaoblená stopa 4 px, vyplněná část v akcentu, kulatý úchyt 18 px s okrajem.
- **Progress nahoře:** tenký pruh 2 px v akcentu podle scrollu (náhrada HUD).
- **Mobilní tab bar:** plovoucí zaoblená lišta (radius 18 px) se 12 px odsazením od okrajů, blur a poloprůhledný povrch.
- **Zvuky:** zůstávají volitelné a výchozí stav je vypnuto. Přepínač je malá ikona reproduktoru v hlavičce.
- **Ikony:** tenké linkové SVG (stroke 1.5), inline, bez knihovny. Emoji nepoužívat.

## Aplikace na funkce
- **3D hero:** stejná síť jako dosud, ale klidnější:
  - pomalá rotace a jemná reakce na myš nebo náklon
  - hloubka pomocí opacity podle vzdálenosti (fog)
  - bílé body s nízkou opacitou, pár akcentních uzlů se září
  - za sítí radiální akcentní záře
  - síť nesmí odvádět pozornost od nadpisu
- **Video pozadí (`<VideoBackground>`):** nahrazuje mřížku `.grid-bg` v hero úvodu (`hero`), v hlavičkách podstránek
  a v CTA blocích (`ambient`); mřížka zůstává jen na 404.
  - smyčka 8 s bez zvuku z `public/video` (zpracování `scripts/video.sh`), video opacity 0,32–0,42
  - překryv: gradient z barvy pozadí na straně textu + vinětace → text drží kontrast AA (ověřeno měřením přes snímky smyčky)
  - video se spouští až v idle po načtení stránky a kreslí se do `<canvas>` (není kandidát LCP), přehrává jen ve viewportu;
    reduced motion, Save-Data a 2g/3g = jen poster
  - 3D síť v hero zůstává nad videem se sníženou opacitou (85 %)
- **AI demo:** produktová karta ve stylu okna aplikace, odpovědi jsou předgenerované (`src/content/demo.ts`):
  - nahoře tři tečky, název „AI asistent“ a štítek „Ukázka“; pod tím záložky rolí „Obchod / Administrativa / Management / Marketing“
  - výběr ze 3 úkolů jako chipy, přepínač „A / B“ mezi dvěma variantami výstupu
  - simulovaný stream (~2 s, klik = celé hned, reduced motion = hned celé); výška je rezervovaná, nic neposkakuje
  - hotový prompt v mono písmu, tlačítko „Kopírovat prompt“ s toastem „Zkopírováno“
- **Kalkulačka:** čisté zaoblené slidery vlevo, výsledek ve velké kartě se zářivým okrajem a animovaným číslem.
- **Semafor, kvíz, časová osa:** stejná funkce, moderní karty a jemné barevné odznaky (zelená / oranžová / červená).
- **404:** čistá stránka s mini hrou v kartě.

## Pohyb
Plynulost má přednost.
- Lenis zůstává (lerp ~0.1). Na dotyku je nativní scroll.
- **Reveal:** fade + posun 16–24 px nahoru, 500–700 ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`, stagger 60–80 ms,
  spustí se jednou. Obsah nad ohybem je vidět hned ze SSR a nikdy se neschovává.
- **Přechody stránek:** jemný fade 200 ms.
- **Mikrointerakce:** hover glow, magnetická tlačítka (jen desktop), `:active` scale.
  Easing je vždy custom cubic-bezier, nikdy `linear` ani `ease-in-out`.
- **Běžící pás nástrojů:** dvě řady opačným směrem, CSS `translateX`, rovnoměrný (lineární) pohyb je u nekonečného
  pásu jediná výjimka z pravidla custom easingu. Mimo viewport pauza, na hover zpomalení na 25 %, reduced motion = statický.
- **Velká čísla:** odpočet od 0 při vstupu do viewportu (`power3.out`, 1,6 s, jednou), `tabular-nums`. Číslo nad
  ohybem se nenuluje. Bez zdroje zůstává `[DOPLNIT]`.
- **Zakázáno:**
  - blikání, stepped easing, clip-path odkrývání, glitch, dešifrování textu
  - nekonečné mikroanimace
  - `filter: blur` na scrollujícím obsahu
  - animace jiných vlastností než `transform` a `opacity`
- `prefers-reduced-motion` vypne Lenis, reveal, 3D pohyb, gyroskop a magnetiku. Obsah je vidět hned.

## Odstraněno (už nepoužívat)
- scanlines, CRT, dither a halftone, globální šum nad 3 %
- ASCII závorky `[ ]` v tlačítkách, `>>>`, `///`, kódy `SEC.03` a `UNIT / A-01`, souřadnice, `REV`
- vlastní kurzor-zaměřovač, boot sekvence, dešifrování nadpisů
- výstražné pruhy, čárové kódy, křížky na průsečících, obří přetékající numerály, `®` jako ornament
- obří kapitálkové nadpisy, mono písmo v odstavcích a navigaci, kontrastní serif

## Přístupnost
- Kontrast textu splňuje WCAG AA: `--muted` na `--bg` má ~7 : 1, `--subtle` ~5 : 1, bílá na `--accent-strong` 4,66 : 1.
- Focus: `outline: 2px solid var(--accent)` s offsetem 2 px.
- Dotykové cíle mají aspoň 44 × 44 px.
- Sémantické tagy `<output>`, `<data>`, `<samp>` a `<dl>` zůstávají tam, kde dávají smysl.
