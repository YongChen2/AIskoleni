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
