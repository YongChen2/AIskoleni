# UPGRADE 1 — Plynulost, načítání, wow efekty, mobil

Navazuje na hotový web. Design dál řídí `DESIGN.md` (Tactical Telemetry). Hlavní cíl: web musí být **máslově plynulý při scrollu i načítání** – na desktopu i mobilu. Plynulost má přednost před efektem: když efekt sekne, zjednoduš ho.

## 0. Výkonnostní rozpočet (závazný)
- 60 fps při scrollu (ověř Chrome DevTools Performance, mobil CPU 4× slowdown).
- Lighthouse mobil Performance ≥ 90, CLS < 0.05, INP < 150 ms, LCP < 2,0 s.
- Animovat jen `transform` a `opacity` (a `clip-path`). Žádné animace `top/left/width/height`, žádné `filter: blur` při scrollu.
- Jedna sdílená smyčka `requestAnimationFrame` (Lenis + GSAP ticker + R3F), ne víc nezávislých smyček.
- `will-change` jen dočasně během animace.
- `prefers-reduced-motion`: vypnout Lenis, boot, dešifrování, gyroskop, kurzor – obsah hned.

## 1. Scroll – „plovoucí luxus“
- Lenis: `lerp ~0.08`, `wheelMultiplier ~0.9`, propojit s GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`).
- Kotvy a navigace přes `lenis.scrollTo` s plynulým dojezdem; po změně stránky scroll na začátek bez skoku.
- Na dotykových zařízeních nativní scroll (Lenis `syncTouch: false`) – nativní je na mobilu nejplynulejší; animace řídí ScrollTrigger.
- Reveal animace sekcí: mechanické clip-path odkrývání, krátké (≤ 600 ms), spouštět jednou.

## 2. Boot sekvence (preloader)
- Jen při první návštěvě (příznak v `sessionStorage`, v try/catch), max ~1,5 s, přeskočitelná klikem/klávesou.
- Terminálový výpis: `> SYSTEM BOOT…`, `> LOADING MODULES [████░░]`, `> NEURAL NET: ONLINE`, reálný progres načítání fontů/3D.
- Nesmí blokovat LCP: obsah stránky se renderuje pod overlayem, overlay se jen odsune (clip-path / translateY).
- Mezi stránkami žádný preloader – jen krátké mechanické odhalení obsahu.

## 3. Wow prvky
### Dešifrování nadpisů
- Makro nadpisy se při vstupu do viewportu „dekódují“ z náhodných znaků (A–Z, 0–9, ▓▒░) do finálního textu, ~500–800 ms, jednou.
- Text je v DOM od začátku (SEO, a11y) – efekt jen vizuální vrstva; `aria-label` s finálním textem.
- Respektovat diakritiku (ŠKOLENÍ, ČEŠTINA).

### Vlastní kurzor (jen zařízení s myší: `(hover: hover) and (pointer: fine)`)
- Zaměřovač `+` s malým mono štítkem souřadnic `X:0412 Y:0218`.
- Nad odkazy/tlačítky se rozšíří na hranatý rámeček `[ ]` kolem prvku, nad textem úzký kurzor.
- Pohyb přes `transform` v rAF s jemným lerpem, systémový kurzor skrýt jen tam, kde vlastní funguje.

### HUD scroll ukazatel
- Pevný panel v rohu (desktop): `SEC.03 / BEZPEČNOST`, `PROGRESS 42 %`, `VEL 1.2`, tenký progress bar v `--accent`.
- Na mobilu zmenšená verze v horní liště (jen progress + sekce).

## 4. 3D hero – i na mobilu
- Desktop: síť reaguje na myš (stávající) + na scroll (body se při odjezdu z hera rozpadají / rozprostřou).
- Mobil: odlehčená síť (méně bodů, `dpr` max 1.5, bez antialias), reaguje na **náklon telefonu (gyroskop)**.
  - iOS vyžaduje povolení `DeviceOrientationEvent.requestPermission()` → malé tlačítko `[ AKTIVOVAT SENZOR ]` v heru; bez povolení síť jemně pluje sama.
- Načíst až po LCP (idle), fallback statická síť z SSR jako dnes. Při skrytí tabu / mimo viewport pozastavit render (`frameloop="demand"` nebo pause).
- Hlídat mobil Lighthouse ≥ 90 – když 3D sníží skóre pod 90, zmenši počet bodů, ne cíl.

## 5. Mobil jako priorita
- **Spodní navigační lišta** (terminal style) na dosah palce: 4–5 položek + `[ MENU ]` pro zbytek, `safe-area-inset-bottom`, skrývá se při scrollu dolů a ukáže při scrollu nahoru.
- **Swipe karty**: formáty školení a nástroje jako swipovací karty (CSS scroll-snap, ne JS knihovna), indikátor `02 / 03`.
- **Haptika**: `navigator.vibrate` (krátké 10–20 ms) při odpovědi v kvízu, zařazení v semaforu, hlavních CTA. Feature-detect; iOS Safari Vibration API nepodporuje → tiše nic.
- Dotykové cíle min 44×44 px, žádné hover-only interakce.

## 6. Volitelné UI zvuky
- Přepínač `[ SOUND: OFF ]` v HUD/liště, výchozí VYPNUTO, volba v `localStorage` (try/catch).
- Krátké tiché mechanické zvuky (klik, potvrzení, boot pípnutí) generované přes Web Audio API (bez souborů), hlasitost nízká.
- Nikdy nepřehrávat bez předchozí interakce uživatele.

## Postup
1. Výkonnostní audit současného stavu (Lighthouse mobil/desktop, Performance trace) → zapsat výchozí čísla do `PERF.md`
2. Lenis + jednotná rAF smyčka + reveal animace → build → commit
3. Boot sekvence + přechody mezi stránkami → commit
4. Dešifrování nadpisů, vlastní kurzor, HUD → commit
5. 3D hero: scroll reakce + mobilní verze s gyroskopem → commit
6. Mobil: spodní lišta, swipe karty, haptika → commit
7. UI zvuky → commit
8. Finální audit, porovnání s krokem 1 v `PERF.md`, oprava všeho pod rozpočtem → commit + push

Po každém kroku `npm run build`, oprav chyby, commit, push na `main` (Vercel nasadí automaticky).
