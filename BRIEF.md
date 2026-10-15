# BRIEF — AI školení web (pracovní název „AI Akademie“)

## Cíl
Megalomanský showcase web o firemním AI školení. Dvě role zároveň:
1. **Prodej školení** – firmy si domluví workshop / školení týmů.
2. **Vizitka technologií** – web sám je důkaz, co umíme (3D, animace, živá AI, interaktivita).

Značka zatím NEEXISTUJE → všechny barvy, fonty, logo a název drž v jednom místě (`/src/config/brand.ts` + CSS tokeny), aby šla značka vyměnit za 10 minut.

Inspirace POUZE tématy (ne designem, ne texty): https://filip-reha.cz/skoleni
Všechny texty piš vlastní, česky, prodejně, bez AI frází.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Framer Motion + GSAP (ScrollTrigger) + Lenis smooth scroll
- React Three Fiber + drei (3D hero)
- MDX blog
- Vercel AI SDK + Anthropic API (živé AI demo) – klíč v `.env.local`, `.env.example` commitnout
- Resend (formulář) – klíč v env
- Deploy Vercel, repo GitHub: https://github.com/YongChen2/AIskoleni

## Design
**Závazný je `DESIGN.md`** (skill industrial-brutalist-ui, archetyp Tactical Telemetry, jen tmavý režim). Při konfliktu s tímto briefem vyhrává DESIGN.md. Žádný generický „AI template“ vzhled.

## Sitemap
1. **/** Úvod
   - 3D hero (drátěná „neuronová“ síť reagující na myš, HUD rámeček – viz DESIGN.md), silný claim + CTA „Domluvit školení“
   - Problém → řešení (lidé AI mají, ale neumí ji použít na vlastní práci)
   - 3 formáty školení (karty, scroll animace)
   - **Živé AI demo**: návštěvník vybere roli (obchod / administrativa / management / marketing) + napíše úkol → AI vrátí ukázkový výstup a hotový prompt. Rate limit (např. 5 dotazů/IP/den).
   - **Kalkulačka úspory**: počet lidí × hodiny týdně na rutině × hodinová sazba → ušetřený čas a peníze za rok (animovaná čísla)
   - Reference/čísla (placeholder), FAQ, závěrečné CTA
2. **/skoleni** Formáty
   - Krok 1: Úvodní workshop (vedení, do 12 lidí, půlden–den)
   - Krok 2: Školení týmů podle rolí (bloky 6–10 lidí, ověření znalostí, report pro vedení)
   - Krok 3: Průběžný rozvoj (měsíčně/kvartálně, přehled proškolenosti pro audit)
   - **Interaktivní časová osa školicího dne** (sticky scroll, bloky se rozbalují)
   - „Co je vždy v ceně“: příprava na míru, materiály a šablony promptů, report pro vedení
3. **/bezpecnost** Bezpečná práce s daty
   - **Interaktivní „datový semafor“**: návštěvník přetahuje typy dat (faktura, osobní údaje, marketingový text…) do zelená / oranžová / červená → okamžitá zpětná vazba
4. **/nastroje** ChatGPT, Claude, Microsoft Copilot, Gemini – srovnávací tabulka pro firmy (nezávislé doporučení)
5. **/kviz** Interaktivní test „Jak je vaše firma připravená na AI“ (8–10 otázek → skóre + doporučený formát školení → CTA)
6. **/blog** MDX, 3 vzorové články (např. „5 úloh, které AI zvládne v obchodě“, „Co nikdy nedávat do ChatGPT“, „Copilot vs Claude ve firmě“)
7. **/o-nas** Příběh, přístup, placeholder fotky
8. **/kontakt** Formulář (jméno, firma, velikost týmu, obory/role, zpráva) → Resend, honeypot + validace (zod)
9. **/ochrana-osobnich-udaju**, **/cookies** – šablony s `[DOPLNIT]` místo firemních údajů
10. 404 stránka s malou interaktivní hříčkou

## Technické požadavky
- Mobil first, plynulé 60 fps, `prefers-reduced-motion` vypne těžké animace a 3D (fallback obrázek/gradient)
- 3D a AI demo načítat lazy (dynamic import), Lighthouse cíl 90+ (performance), 100 (SEO, a11y)
- SEO: metadata každé stránky, OG obrázky (next/og), sitemap.xml, robots.txt, JSON-LD (Organization, Service, FAQPage, Course)
- Pouze tmavý režim (viz DESIGN.md)
- Cookie lišta jen pokud přidáš analytiku (Vercel Analytics je cookieless → lišta není nutná)
- Všechny placeholdery označit `[DOPLNIT]` a vypsat je na konci do `TODO-OBSAH.md`

## Postup (pro Claude Code)
1. Init projektu, závislosti, brand config, layout, navigace, footer → commit
2. Úvod (bez 3D) + /skoleni → build → commit
3. 3D hero, scroll animace → commit
4. AI demo (API route + rate limit), kalkulačka → commit
5. Semafor, kvíz, nástroje → commit
6. Blog MDX, o nás, kontakt + Resend, právní stránky, 404 → commit
7. SEO, OG, JSON-LD, optimalizace, `npm run build` bez chyb a varování → commit
8. Push na origin main, vypsat co je potřeba nastavit ve Vercelu (env proměnné)

Po každém kroku spustit `npm run build` a opravit chyby, než pokračuješ.
