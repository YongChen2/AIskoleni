# PERF — výkonnostní měření

Rozpočet (UPGRADE-1.md, sekce 0): Lighthouse mobil Performance ≥ 90, LCP < 2,0 s, CLS < 0,05, INP < 150 ms, 60 fps při scrollu (mobil CPU 4× slowdown).

## Metodika
- Produkční build (`next build && next start`) lokálně, Chrome 14x, Lighthouse 12.
- **Lighthouse:** výchozí mobilní profil (simulované throttling: Slow 4G + CPU 4×) a `--preset=desktop`. 5 stránek.
- **Scroll fps:** Playwright + CDP, CPU 4× slowdown. Mobil 390×844 dotykovými gesty (`Input.synthesizeScrollGesture`), desktop 1440×900 kolečkem myši. Měří se intervaly `requestAnimationFrame` během scrollu celé stránky.
- **INP proxy:** Event Timing API (`durationThreshold 16`) při CPU 4× – kvíz (9 odpovědí), semafor (4 zařazení), menu, FAQ, posuvník kalkulačky. Uvedena nejhorší interakce.
- Lokální měření nejsou totožná s produkcí na Vercelu (CDN, Brotli, reálná síť), ale jsou srovnatelná mezi sebou.

## 1. Výchozí stav (před UPGRADE-1)

| Režim | Stránka | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | JS (KB) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 94 | 100 | 100 | 100 | 906 ms | 3082 ms | 10 ms | 0 | 993 ms | 253 |
| mobile | `/skoleni` | 96 | 100 | 100 | 100 | 756 ms | 2775 ms | 7 ms | 0 | 784 ms | 221 |
| mobile | `/bezpecnost` | 96 | 100 | 100 | 100 | 754 ms | 2771 ms | 6 ms | 0 | 897 ms | 222 |
| mobile | `/kviz` | 96 | 100 | 100 | 100 | 757 ms | 2776 ms | 7 ms | 0 | 888 ms | 223 |
| mobile | `/kontakt` | 95 | 100 | 100 | 100 | 755 ms | 2924 ms | 7 ms | 0 | 807 ms | 253 |
| desktop | `/` | 100 | 100 | 100 | 100 | 246 ms | 669 ms | 0 ms | 0 | 445 ms | 498 |
| desktop | `/skoleni` | 100 | 100 | 100 | 100 | 205 ms | 585 ms | 0 ms | 0 | 261 ms | 261 |
| desktop | `/bezpecnost` | 100 | 100 | 100 | 100 | 205 ms | 585 ms | 0 ms | 0 | 322 ms | 261 |
| desktop | `/kviz` | 100 | 100 | 100 | 100 | 204 ms | 585 ms | 0 ms | 0 | 244 ms | 261 |
| desktop | `/kontakt` | 100 | 100 | 100 | 100 | 204 ms | 625 ms | 0 ms | 0 | 250 ms | 261 |

| Režim | Stránka | Průměr fps | p95 snímek | Dlouhé snímky (>25 ms) | CLS při scrollu |
|---|---|---|---|---|---|
| mobile | `/` | 56.9 | 16.8 ms | 2 % | 0.001 |
| mobile | `/skoleni` | 58.8 | 16.8 ms | 2 % | 0.141 |
| mobile | `/bezpecnost` | 59.9 | 16.8 ms | 0.2 % | 0 |
| desktop | `/` | 58.5 | 16.7 ms | 0.8 % | 0 |
| desktop | `/skoleni` | 58.8 | 16.8 ms | 1.4 % | 0.067 |
| desktop | `/bezpecnost` | 60 | 16.7 ms | 0 % | 0 |

| Režim | Interakcí | Nejhorší interakce (INP proxy) |
|---|---|---|
| mobile | 18 | 64 ms |
| desktop | 18 | 96 ms |


### Zjištění
- **LCP na mobilu 2,8–3,1 s – nad rozpočtem.** Pozorované LCP je ~50 ms; simulace ho prodlužuje kvůli objemu dat stahovaných před prvním vykreslením: 6 přednačítaných fontů (133 KB, včetně Playfair použitého jen na `/o-nas`) + první vlna JS (~150 KB).
- **CLS 0,141 při scrollu na `/skoleni`** (mobil) – časová osa dne rozbaluje/sbaluje záznamy podle pozice scrollu a posouvá obsah. Lighthouse to nezachytí (měří jen načtení).
- Scroll drží ~57–60 fps, 0–2 % dlouhých snímků. Interakce do 100 ms.

## 2. Po UPGRADE-1 (finální audit)

Měřeno stejnou metodikou jako výchozí stav. Výchozí hodnoty pro **reálné throttling, scroll a INP** byly přeměřeny znovu na původním kódu (commit `a085951`, sestaven v samostatném worktree) opravenou metodikou – viz poznámky pod tabulkami. ✓ = zlepšení, ✗ = zhoršení; rozdíly v jednotkách ms jsou v rámci šumu měření.

### Lighthouse mobil – simulované throttling (výchozí profil)

| Stránka | Perf | LCP | FCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| `/` | 94 → **97** ✓ | 3082 ms → **2614 ms** ✓ | 906 ms → **903 ms** ✓ | 10 ms → **6 ms** ✓ | 0 → **0** | 993 ms → **1524 ms** ✗ |
| `/skoleni` | 96 → **98** ✓ | 2775 ms → **2465 ms** ✓ | 756 ms → **753 ms** ✓ | 7 ms → **6 ms** ✓ | 0 → **0** | 784 ms → **1314 ms** ✗ |
| `/bezpecnost` | 96 → **98** ✓ | 2771 ms → **2463 ms** ✓ | 754 ms → **753 ms** ✓ | 6 ms → **5 ms** ✓ | 0 → **0** | 897 ms → **1447 ms** ✗ |
| `/kviz` | 96 → **98** ✓ | 2776 ms → **2464 ms** ✓ | 757 ms → **753 ms** ✓ | 7 ms → **6 ms** ✓ | 0 → **0** | 888 ms → **1339 ms** ✗ |
| `/kontakt` | 95 → **97** ✓ | 2924 ms → **2613 ms** ✓ | 755 ms → **753 ms** ✓ | 7 ms → **5 ms** ✓ | 0 → **0** | 807 ms → **1483 ms** ✗ |

### Lighthouse mobil – reálné throttling (`--throttling-method=devtools`, Slow 4G + CPU 4×)

| Stránka | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 93 → **98** ✓ | 2673 ms → **1672 ms** ✓ | 4 ms → **9 ms** ✗ | 0.003 → **0** ✓ |
| `/skoleni` | 93 → **99** ✓ | 2677 ms → **1446 ms** ✓ | 5 ms → **12 ms** ✗ | 0.01 → **0** ✓ |
| `/bezpecnost` | 80 → **98** ✓ | 2675 ms → **1668 ms** ✓ | 4 ms → **10 ms** ✗ | 0.249 → **0** ✓ |
| `/kviz` | 99 → **98** ✗ | 1673 ms → **1686 ms** ✗ | 4 ms → **9 ms** ✗ | 0.002 → **0** ✓ |
| `/kontakt` | 99 → **99** | 1668 ms → **1441 ms** ✓ | 5 ms → **9 ms** ✗ | 0.001 → **0** ✓ |

### Lighthouse desktop – simulované

| Stránka | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 100 → **100** | 669 ms → **580 ms** ✓ | 0 ms → **0 ms** | 0 → **0** |
| `/skoleni` | 100 → **100** | 585 ms → **539 ms** ✓ | 0 ms → **0 ms** | 0 → **0** |
| `/bezpecnost` | 100 → **100** | 585 ms → **539 ms** ✓ | 0 ms → **0 ms** | 0 → **0** |
| `/kviz` | 100 → **100** | 585 ms → **584 ms** ✓ | 0 ms → **0 ms** | 0 → **0** |
| `/kontakt` | 100 → **100** | 625 ms → **538 ms** ✓ | 0 ms → **0 ms** | 0 → **0** |

### Scroll při CPU 4× (fps / dlouhé snímky > 25 ms / CLS během scrollu)

| Režim | Stránka | fps | Dlouhé snímky | CLS při scrollu |
|---|---|---|---|---|
| mobile | `/` | 60 → **60** | 0 % → **0 %** | 0.001 → **0** ✓ |
| mobile | `/skoleni` | 60 → **60** | 0 % → **0 %** | 0.094 → **0** ✓ |
| mobile | `/bezpecnost` | 59.9 → **59.9** | 0.2 % → **0.2 %** | 0 → **0** |
| desktop | `/` | 60 → **60** | 0 % → **0 %** | 0 → **0** |
| desktop | `/skoleni` | 60 → **60** | 0 % → **0 %** | 0.063 → **0** ✓ |
| desktop | `/bezpecnost` | 60 → **60** | 0 % → **0 %** | 0 → **0** |


### INP (nejhorší interakce, CPU 4×: kvíz, semafor, menu, FAQ, posuvník kalkulačky)

| Režim | Před | Po |
|---|---|---|
| mobil | 32–64 ms | 32–40 ms (jednou 136 ms, ve 4 dalších bězích ≤ 40 ms) |
| desktop | 16–96 ms | 32 ms |

### Kontrola rozpočtu

| Požadavek | Výsledek | Stav |
|---|---|---|
| Lighthouse mobil Performance ≥ 90 | 97–98 (simulované), 98–99 (reálné throttling) | splněno |
| CLS < 0,05 | 0 na všech měřených stránkách (načtení i scroll, simulované i reálné throttling) | splněno |
| INP < 150 ms | ≤ 40 ms typicky, max. 136 ms | splněno |
| LCP < 2,0 s | **1,4–1,7 s s reálným throttlingem; 2,5–2,6 s v simulaci Lighthouse** | splněno v reálném měření, v simulaci ne – viz níže |
| 60 fps při scrollu (mobil CPU 4×) | 59,9–60 fps, ≤ 0,2 % dlouhých snímků | splněno |
| Animovat jen transform / opacity / clip-path | ano; `will-change` jen během reveal animace | splněno |
| Jedna sdílená rAF smyčka | `gsap.ticker` pohání Lenis, reveal, počítadla, dešifrování, kurzor, HUD i 3D (R3F `advance()`, mobilní WebGL) | splněno |
| `prefers-reduced-motion` | vypnuto: Lenis, boot, dešifrování, kurzor, 3D (statická síť), gyroskop, reveal, přechody | splněno |

### Proč simulované LCP zůstává nad 2,0 s
Lighthouse v simulovaném režimu (lantern) nepočítá skutečný průběh, ale odhaduje ho z grafu požadavků: do LCP započte všechno, co se stáhlo před pozorovaným LCP. Skutečné LCP nastává ~50 ms po začátku, ale už v té době prohlížeč stahuje framework (React + Next.js runtime ≈ 160 KB), který se odstranit nedá. Odstranili jsme vše ostatní, co šlo: fonty z 6 souborů / 133 KB na 2 soubory / 45 KB (self-hosted podmnožiny, Playfair se nepřednačítá) a těžké knihovny (GSAP, Lenis, three.js) se načítají až po vykreslení. Měření se skutečným zpomalením sítě a CPU ukazuje LCP 1,4–1,7 s. Na produkci (Vercel CDN, Brotli, HTTP/2) bude přenos menší než lokálně.

### Zhoršení: Speed Index
Speed Index na mobilu vzrostl z ~0,9 s na ~1,4 s. Příčina je záměrná: boot sekvence při první návštěvě překryje obsah na ≤ 1,5 s. Obsah se pod ní vykresluje hned (LCP, FCP i Performance skóre se zlepšily), Speed Index ale měří vizuální průběh. Při dalších stránkách v relaci se boot nespouští.

### Co se v UPGRADE-1 opravilo nad rámec nových funkcí
- **CLS při scrollu na `/skoleni` (0,094 → 0):** časová osa rozbalovala bloky podle scrollu; teď scroll mění jen zvýraznění a sticky panel, rozbalení je na klik.
- **CLS při načtení na pomalé síti (`/bezpecnost` 0,249 → 0):** výměna fontu přezalamovala text. Mono písmo má teď fallback se stejnou šířkou znaku (0,6 em), nadpisové písmo `font-display: block` (12 KB, přednačtené).
- **INP:** blikání terminálového kurzoru přes `steps()` zdržovalo vykreslení po interakci až o ~350 ms; nahrazeno plynulým doznívaním a pozastavením mimo viewport.
- **3D na mobilu:** three.js + R3F by přidalo ~500 ms TBT, proto mobil používá vlastní odlehčený WebGL renderer (stejná síť a shader).
- **Hydratace:** efekty měnící text čekají na hydrataci konkrétního prvku (dříve chyba React #418 a překreslení podstromu).

## 3. Po UPGRADE-2 (modernizace vzhledu)

Stejná metodika a stejné skripty jako v části 2. Srovnání je proti stavu po UPGRADE-1 (`a7411f2`).

### Lighthouse mobil – simulované throttling

| Stránka | Perf | A11y | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| `/` | 97 → **97** | 100 → **100** | 2614 ms → **2622 ms** | 6 ms → **8 ms** | 0 → **0** | 1524 ms → **1059 ms** ✓ |
| `/skoleni` | 98 → **97** | 100 → **100** | 2465 ms → **2621 ms** ✗ | 6 ms → **15 ms** | 0 → **0** | 1314 ms → **1059 ms** ✓ |
| `/bezpecnost` | 98 → **97** | 100 → **100** | 2463 ms → **2507 ms** | 5 ms → **49 ms** | 0 → **0** | 1447 ms → **1062 ms** ✓ |
| `/kviz` | 98 → **98** | 100 → **100** | 2464 ms → **2491 ms** | 6 ms → **36 ms** | 0 → **0** | 1339 ms → **1058 ms** ✓ |
| `/kontakt` | 97 → **96** | 100 → **100** | 2613 ms → **2689 ms** | 5 ms → **74 ms** | 0 → **0** | 1483 ms → **1072 ms** ✓ |

Rozdíly v LCP a TBT o desítky ms jsou na hranici šumu. V jiném běhu stejného buildu (`lh-u2b`) vyšla
mobilní Performance 97–98 a TBT 8–25 ms.

### Lighthouse mobil – reálné throttling (Slow 4G + CPU 4×), 2 běhy

| Stránka | Perf | LCP | CLS |
|---|---|---|---|
| `/` | 98 → **99** | 1672 ms → **1570–1587 ms** ✓ | 0 → **0** |
| `/skoleni` | 99 → **99** | 1446 ms → **1579–1586 ms** | 0 → **0** |
| `/bezpecnost` | 98 → **99** | 1668 ms → **1573–1578 ms** ✓ | 0 → **0,001** |
| `/kviz` | 98 → **99** | 1686 ms → **1564–1592 ms** ✓ | 0 → **0** |
| `/kontakt` | 99 → **99** | 1441 ms → **1564–1567 ms** | 0 → **0** |

### Lighthouse desktop
Performance 100 a přístupnost 100 na všech pěti stránkách, LCP 547–609 ms, TBT 0–4 ms, CLS 0.

### Scroll při CPU 4× a INP

| Režim | Stránka | fps | Dlouhé snímky | CLS při scrollu |
|---|---|---|---|---|
| mobile | `/` | 60 → **59,9** | 0 % → **0,2 %** | 0 → **0** |
| mobile | `/skoleni` | 60 → **60** | 0 % → **0 %** | 0 → **0** |
| mobile | `/bezpecnost` | 59,9 → **60** | 0,2 % → **0 %** | 0 → **0** |
| desktop | všechny tři | 60 → **60** | 0 % → **0 %** | 0 → **0** |

INP (nejhorší interakce): mobil 32–40 ms → **40 ms**, desktop 32 ms → **32 ms**.

CLS při fontu zpožděném o 1,5 s: ≤ 0,0007 na 5 stránkách ve 2 šířkách.

### Kontrola rozpočtu

| Požadavek | Výsledek | Stav |
|---|---|---|
| Lighthouse mobil Performance ≥ 90 | 96–98 (simulované), 99 (reálné throttling) | splněno |
| CLS < 0,05 | 0–0,001 (načtení, scroll, pomalý font) | splněno |
| INP < 150 ms | ≤ 40 ms | splněno |
| LCP < 2,0 s | 1,56–1,59 s s reálným throttlingem; 2,5–2,7 s v simulaci | stejně jako v UPGRADE-1, viz část 2 |
| 60 fps při scrollu | 59,9–60 fps | splněno |
| Animace jen transform / opacity | reveal, progress pruhy, tečky swipe, magnetika (`translate`) i 3D prolnutí | splněno |
| Jedna sdílená rAF smyčka | `gsap.ticker` (Lenis, počítadla, 3D); reveal, progress nahoře, hlavička a tab bar nemají vlastní smyčku | splněno |
| Nic nebliká | automatická kontrola na 11 stránkách × 2 šířky: žádný prvek ve viewportu se po načtení neskryl | splněno |

### Co se v UPGRADE-2 změnilo z hlediska výkonu
- **Speed Index −30 % (~1,4 s → ~1,06 s):** odstraněna boot sekvence. Tím je vyřešené zhoršení popsané v části 2.
- **Fonty:** Archivo Black + JetBrains Mono (45 KB) nahrazeny Geist + Geist Mono (19,6 + 20 KB). Mono se nepřednačítá.
- **Vlastní záložní font „Geist Fallback“:** automatický fallback next/font měl jediný `size-adjust` 107 %
  pro všechny řezy, takže odstavce se při výměně fontu přezalamovaly (CLS 0,138 na `/kviz` s reálným throttlingem).
  Teď má Regular 103,7 % a Bold 101,1 % podle změřené šířky českého textu → CLS 0.
- **Mobilní 3D až po první interakci:** první WebGL kontext inicializuje GPU proces. V Lighthouse (SwiftShader)
  to trvalo ~2,5 s a volal se dvakrát (testovací plátno + skutečné), takže TBT bylo 2,7 s a Performance 68.
  Mobil teď testovací plátno nevytváří a WebGL spouští v idle po prvním scrollu nebo dotyku. Do té doby je vidět
  stejná statická síť ze SSR, na kterou se 3D plynule prolne.
- **Reveal bez rAF:** místo GSAP clip-path jde o IntersectionObserver + CSS přechod (compositor). Skrývá se jen
  obsah pod ohybem a až po hydrataci.
- **Kontrast (přístupnost 96 → 100):** primární tlačítka mají `--accent-strong` #E0282D (bílá 4,66 : 1)
  a `--subtle` je zvednuté na #7D838D (~5 : 1).
