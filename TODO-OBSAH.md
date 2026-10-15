# TODO – obsah k doplnění

Všechna místa jsou na webu označená `[DOPLNIT]`. Najdete je příkazem:

```bash
grep -rn "\[DOPLNIT" src
```

## 1. Značka a kontakty – `src/config/brand.ts`
Propisuje se do hlavičky, patičky, kontaktu, JSON-LD i OG obrázků.
- [ ] Název značky (`name`, `code`) – teď pracovní „AI Akademie“
- [ ] E-mail, telefon
- [ ] Název firmy, IČO, adresa
- [ ] Souřadnice v HUD prvcích (`coords`) – volitelně skutečné sídlo
- [ ] Barvy (`colors`) a fonty (`src/config/fonts.ts`), pokud se mění vizuál
- [ ] Logo/ikona – `src/app/icon.svg`

## 2. Úvodní stránka – `src/content/site.ts`
- [ ] Čísla v sekci Reference: počet proškolených lidí, počet firem, hodnocení účastníků
- [ ] Dvě reference klientů (citace, jméno, pozice, firma) – se souhlasem klienta
- [ ] FAQ „Kolik školení stojí?“ – orientační ceník, nebo smazat poznámku

## 3. O nás – `src/app/o-nas/page.tsx`
- [ ] Krátký příběh firmy (úvodní odstavec)
- [ ] Rok založení, sídlo, počet lektorů
- [ ] Autor citátu
- [ ] Tým: jména, role, fotky (černobílé, převést do halftone / 1-bit ditheru)

## 4. Nástroje – `src/app/nastroje/page.tsx`
- [ ] Datum poslední kontroly srovnávací tabulky (2×)
- [ ] Před spuštěním ověřit aktuální názvy tarifů a funkce nástrojů

## 5. Blog – `src/app/blog/[slug]/page.tsx`, `src/content/blog/`
- [ ] Autor článků
- [ ] Projít a případně upravit 3 vzorové články

## 6. Právní stránky
Vzorové texty – **nechat zkontrolovat právníkem**.
- [ ] `/ochrana-osobnich-udaju`: správce (název, IČO, sídlo, rejstřík, e-mail), další účely zpracování, doba uložení, další zpracovatelé
- [ ] `/cookies`: správce; upravit, pokud přibude analytika
- [ ] Datum „Platnost od“ (`src/components/legal-page.tsx`)

## 7. Strukturovaná data – `src/lib/schema.ts`
- [ ] Doplnit do Organization adresu, IČO a `sameAs` (LinkedIn apod.)

## 8. Mimo kód
- [ ] Ověřená doména v Resend a odesílací adresa (`CONTACT_FROM_EMAIL`)
- [ ] Vlastní doména ve Vercelu + `NEXT_PUBLIC_SITE_URL`
