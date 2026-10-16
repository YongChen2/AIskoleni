/**
 * Předgenerované ukázky pro AI demo na úvodní stránce (bez volání API).
 * Každá role má 3 úkoly, každý úkol 2 varianty výstupu. Prompt se skládá z částí úkolu
 * a formátu zvolené varianty → zkopírovaný prompt odpovídá zobrazenému výstupu.
 * Jména firem a osob jsou vymyšlená, hranaté závorky = místo k doplnění.
 */

export type DemoVariant = {
  /** Krátký název varianty, např. „Formální“ */
  label: string;
  /** Řádek „Formát“ v promptu */
  format: string;
  /** Ukázkový výstup AI (max. ~150 slov) */
  output: string;
};

export type DemoTask = {
  id: string;
  /** Krátký název na chipu */
  title: string;
  /** Zadání tak, jak by ho napsal člověk */
  ask: string;
  role: string;
  context: string;
  task: string;
  limits: string;
  variants: [DemoVariant, DemoVariant];
};

export type DemoRole = { id: string; label: string; tasks: [DemoTask, DemoTask, DemoTask] };

export function buildPrompt(t: DemoTask, v: DemoVariant) {
  return [`Role: ${t.role}`, `Kontext: ${t.context}`, `Úkol: ${t.task}`, `Formát: ${v.format}`, `Omezení: ${t.limits}`].join(
    "\n\n",
  );
}

export const demoRoles: DemoRole[] = [
  {
    id: "obchod",
    label: "Obchod",
    tasks: [
      {
        id: "follow-up",
        title: "Follow-up po prezentaci",
        ask: "Napiš follow-up e-mail klientovi, který byl minulý týden na prezentaci, ale zatím se neozval.",
        role: "Jsi zkušený B2B obchodník firmy, která dodává LED osvětlení pro průmyslové provozy.",
        context:
          "Minulé úterý jsem prezentoval výměnu osvětlení ve skladu klienta (výrobní firma, 120 zaměstnanců). Nákupčí byl zaujatý a slíbil, že se ozve do pátku. Zatím se neozval. Hlavní přínos: úspora energie na osvětlení zhruba o 40 %.",
        task: "Napiš follow-up e-mail, který připomene schůzku a navrhne konkrétní další krok.",
        limits:
          "Nevymýšlej čísla, která nejsou v kontextu. Žádný nátlak ani fráze typu „jen se připomínám“. Na konci jedna jasná výzva k akci. Vykání.",
        variants: [
          {
            label: "Formální",
            format: "formální tón, předmět e-mailu, tři krátké odstavce a podpis.",
            output: `Předmět: Podklady k úsporám za osvětlení skladu

Dobrý den, pane [příjmení],

děkuji ještě jednou za čas, který jste minulé úterý věnoval naší prezentaci. Jak jsme zmínili, výměna osvětlení by ve Vašem skladu mohla snížit spotřebu energie na svícení zhruba o 40 %.

Abych Vám usnadnil rozhodování, rád připravím orientační výpočet návratnosti přímo pro Vaše provozní hodiny. Stačí mi k tomu poslední roční vyúčtování elektřiny.

Vyhovoval by Vám krátký telefonát ve čtvrtek nebo v pátek dopoledne? Rád se přizpůsobím Vašemu kalendáři.

S pozdravem
[Vaše jméno]`,
          },
          {
            label: "Přátelská",
            format: "přátelský, ale profesionální tón, předmět e-mailu a nejvýš pět vět.",
            output: `Předmět: Jak to vypadá se světly ve skladu?

Dobrý den,

ještě jednou díky za úterní schůzku – bylo vidět, že vás úspora kolem 40 % na osvětlení zaujala. Vím, že konec měsíce bývá hektický, tak to zkusím co nejjednodušeji: pošlete mi poslední vyúčtování za elektřinu a já vám spočítám, za jak dlouho by se nová světla zaplatila.

Hodí se vám to?

Hezký den
[Vaše jméno]`,
          },
        ],
      },
      {
        id: "namitka-cena",
        title: "Námitka „jste drazí“",
        ask: "Klient píše, že konkurence je o 15 % levnější. Pomoz mi odpovědět tak, abych neslevil a klienta neztratil.",
        role: "Jsi obchodník firmy, která dodává software pro správu vozového parku.",
        context:
          "Klient (dopravní firma, 40 vozidel) dostal od konkurence nabídku o 15 % levnější. Naše cena zahrnuje zavedení systému, zaškolení řidičů a podporu 24/7. Konkurence tyto položky účtuje zvlášť.",
        task: "Napiš odpověď, která obhájí naši cenu, neshodí konkurenci a nabídne další krok.",
        limits: "Neslibuj slevu. O konkurenci nemluv negativně. Vykání.",
        variants: [
          {
            label: "Stručně",
            format: "nejvýš čtyři věty, vhodné do e-mailu i do zprávy.",
            output: `Dobrý den,

děkuji, že jste se ozval otevřeně – rozumím, že 15 % je znát. Naše cena ale už obsahuje zavedení systému, zaškolení řidičů i podporu 24/7, které se jinde obvykle účtují zvlášť. Pokud chcete, připravím vám do čtvrtka srovnání celkových nákladů na první rok, ať se rozhodujete podle stejných čísel.`,
          },
          {
            label: "Detailně",
            format: "e-mail se shrnutím, co cena obsahuje, v odrážkách a s návrhem schůzky.",
            output: `Dobrý den,

děkuji za otevřenost – cena je pochopitelně důležitá. Aby srovnání bylo férové, shrnul jsem, co naše nabídka obsahuje:

• zavedení systému pro všech 40 vozidel – v ceně
• zaškolení řidičů a dispečinku – v ceně
• podpora 24/7 – v ceně

U nabídek, kde se tyto položky účtují zvlášť, se rozdíl v ceně licence často vyrovná už v prvním roce.

Navrhuji krátký hovor, ve kterém obě nabídky projdeme položku po položce. Pokud z něj vyjde, že jinde dostanete víc za méně, řeknu vám to na rovinu.

Hodí se vám příští úterý?

S pozdravem
[Vaše jméno]`,
          },
        ],
      },
      {
        id: "priprava-schuzky",
        title: "Otázky na první schůzku",
        ask: "Zítra mám první schůzku s novým potenciálním klientem. Připrav mi otázky, na které se zeptat.",
        role: "Jsi obchodní kouč se zkušeností z B2B prodeje služeb.",
        context:
          "Zítra mám první schůzku s ředitelem účetní kanceláře (25 lidí). Nabízíme software pro bezpečné sdílení dokumentů s klienty. O jejich současném řešení zatím nic nevím.",
        task: "Připrav otázky pro první schůzku, které mi pomůžou pochopit jejich potřeby.",
        limits: "Jen otevřené otázky, žádné ano/ne. Nezačínej prodejem ani představením produktu.",
        variants: [
          {
            label: "Stručně",
            format: "pět nejdůležitějších otázek v číslovaném seznamu.",
            output: `1. Jak dnes s klienty sdílíte dokumenty a co vám na tom nejvíc vadí?
2. Kolik času týdně vaši lidé stráví dohledáváním podkladů od klientů?
3. Co by se muselo stát, abyste řekl, že se změna vyplatila?
4. Kdo další se na rozhodnutí o novém nástroji podílí?
5. Zkoušeli jste už něco podobného? Co se tehdy osvědčilo a co ne?`,
          },
          {
            label: "Detailně",
            format: "otázky rozdělené do tří témat, ke každému tématu jeden tip, na co si dát pozor.",
            output: `Současný stav
• Jak dnes s klienty sdílíte dokumenty a podklady?
• Kde se celý proces nejčastěji zasekne?
Tip: nechte ho mluvit a neskákejte do řeči s řešením.

Dopad a priority
• Kolik času to vaše lidi týdně stojí?
• Co je pro vás v příští sezóně daňových přiznání nejdůležitější?
Tip: ptejte se na čísla, později je využijete v nabídce.

Rozhodování
• Kdo další se na výběru nástroje podílí?
• Podle čeho poznáte, že se změna vyplatila?
Tip: na konci si domluvte konkrétní další krok, ne jen „ozveme se“.`,
          },
        ],
      },
    ],
  },
  {
    id: "administrativa",
    label: "Administrativa",
    tasks: [
      {
        id: "faktury",
        title: "Systém pro faktury",
        ask: "Navrhni, jak třídit a pojmenovávat faktury, které mi chodí e-mailem, aby se nic neztrácelo.",
        role: "Jsi zkušená asistentka finančního oddělení.",
        context:
          "Měsíčně mi do sdílené schránky chodí asi 80 faktur od dodavatelů v PDF. Ukládám je na sdílený disk, odkud si je bere účetní. Občas se nějaká ztratí nebo skončí ve špatné složce.",
        task: "Navrhni jednoduchý systém třídění a pojmenování souborů.",
        limits: "Bez nového softwaru, jen e-mail a sdílený disk. Postup musí zvládnout i zástup během dovolené.",
        variants: [
          {
            label: "Stručně",
            format: "vzor názvu souboru, struktura složek a jedno pravidlo.",
            output: `Název souboru
RRRR-MM-DD_Dodavatel_CisloFaktury.pdf
např. 2026-03-14_Elektro-Novak_FV2026-118.pdf

Struktura složek
Faktury / 2026 / 03-brezen / K proplaceni
Faktury / 2026 / 03-brezen / Proplaceno

Pravidlo
Každou fakturu ze schránky hned uložte do složky K proplaceni a e-mail označte štítkem „Uloženo“. Po zaplacení soubor přesuňte do složky Proplaceno.`,
          },
          {
            label: "Detailně",
            format: "číslovaný postup krok za krokem včetně měsíční kontroly a poznámky pro zástup.",
            output: `1. Každé ráno projděte schránku a nové faktury uložte do složky Faktury / 2026 / 03-brezen / K proplaceni.
2. Soubor přejmenujte podle vzoru RRRR-MM-DD_Dodavatel_CisloFaktury.pdf.
3. E-mail označte štítkem „Uloženo“. Ve schránce pak hned vidíte, co ještě chybí.
4. Po zaplacení soubor přesuňte do podsložky Proplaceno.
5. Poslední pracovní den v měsíci porovnejte počet e-mailů se štítkem a počet souborů. Čísla musí sedět.

Pro zástup: tento postup uložte jako dokument přímo do složky Faktury. Nikdo pak nemusí nic hledat ani se ptát.`,
          },
        ],
      },
      {
        id: "zapis",
        title: "Zápis z porady",
        ask: "Mám poznámky z porady v bodech. Udělej z nich zápis s úkoly a termíny.",
        role: "Jsi asistentka vedení, která píše přehledné zápisy z porad.",
        context:
          "Poznámky: od dubna možná nový dodavatel kávy – Petra zjistí ceny do pátku; 12. 4. oprava parkoviště, auta parkovat u skladu; školení BOZP pro nové lidi – Martin domluví termín; letní dovolené nahlásit do 30. 4.",
        task: "Přepiš poznámky do zápisu z porady.",
        limits:
          "Nic nepřidávej, co v poznámkách není. U každého úkolu uveď odpovědnou osobu a termín; když termín chybí, napiš „termín doplnit“.",
        variants: [
          {
            label: "Formální",
            format: "zápis s hlavičkou, projednanými body a seznamem úkolů.",
            output: `Zápis z provozní porady
Datum: [doplnit] · Zapsal(a): [doplnit]

Projednáno
1. Dodavatel kávy – od dubna zvažujeme změnu dodavatele.
2. Parkoviště – 12. 4. proběhne oprava, ten den se parkuje u skladu.
3. Školení BOZP pro nové zaměstnance – je potřeba domluvit termín.
4. Letní dovolené – nahlásit do 30. 4.

Úkoly
• Zjistit ceny nových dodavatelů kávy – Petra – do pátku
• Domluvit termín školení BOZP – Martin – termín doplnit
• Nahlásit letní dovolené – všichni – do 30. 4.`,
          },
          {
            label: "Přátelská",
            format: "krátký e-mail pro kolegy s tím, co z porady plyne pro ně.",
            output: `Ahoj všichni,

krátké shrnutí dnešní porady:

– Od dubna možná změníme dodavatele kávy, Petra do pátku zjistí ceny.
– 12. 4. se opravuje parkoviště, ten den prosím parkujte u skladu.
– Noví kolegové půjdou na školení BOZP, termín domluví Martin.
– Letní dovolené nahlaste do 30. 4.

Díky a hezký den!`,
          },
        ],
      },
      {
        id: "reklamace",
        title: "Odpověď na reklamaci",
        ask: "Zákazník si stěžuje, že objednávka přišla pozdě. Napiš mu odpověď.",
        role: "Jsi pracovník zákaznické podpory e-shopu s kancelářskými potřebami.",
        context:
          "Objednávka č. 24518 měla dorazit v pondělí, dorazila ve čtvrtek. Příčina: výpadek u dopravce. Zákazník je firma a nakupuje pravidelně. Můžeme nabídnout dopravu zdarma na příští objednávku.",
        task: "Napiš odpověď na stížnost zákazníka.",
        limits: "Omluv se bez výmluv, ale uveď příčinu. Neslibuj nic nad rámec dopravy zdarma. Nejvýš 120 slov. Vykání.",
        variants: [
          {
            label: "Formální",
            format: "formální e-mail s oslovením, třemi krátkými odstavci a podpisem.",
            output: `Dobrý den,

omlouváme se, že objednávka č. 24518 dorazila o tři dny později, než jsme slíbili. Zpoždění způsobil výpadek u našeho dopravce. Chápeme ale, že pro Vás je podstatné hlavně to, že zboží nebylo včas k dispozici.

Jako poděkování za Vaši trpělivost Vám u příští objednávky rádi poskytneme dopravu zdarma. Kód Vám zašleme v samostatném e-mailu.

Situaci s dopravcem řešíme, aby se podobné zpoždění neopakovalo.

S pozdravem
[jméno], zákaznická podpora`,
          },
          {
            label: "Přátelská",
            format: "lidský, vstřícný tón, krátké odstavce, bez formálních frází.",
            output: `Dobrý den,

máte pravdu a moc se omlouváme – objednávka č. 24518 měla být u vás v pondělí a dorazila až ve čtvrtek. Zasekla se u dopravce, ale to vám ztracený čas nevrátí.

Příští objednávku vám proto pošleme s dopravou zdarma. Kód dostanete v dalším e-mailu.

Děkujeme, že u nás nakupujete pravidelně. Uděláme, co můžeme, aby to příště klaplo na den přesně.

[jméno]`,
          },
        ],
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    tasks: [
      {
        id: "kvartal",
        title: "Shrnutí kvartálu",
        ask: "Shrň výsledky kvartálu pro poradu vedení – tržby rostly o 8 %, náklady o 12 %, máme dvě nové zakázky.",
        role: "Jsi finanční ředitel výrobní firmy, který připravuje podklady pro vedení.",
        context:
          "3. kvartál: tržby meziročně +8 %, náklady +12 % (hlavně energie a mzdy). Získali jsme dvě nové zakázky na příští rok. Marže se zužuje.",
        task: "Připrav shrnutí výsledků pro poradu vedení.",
        limits: "Používej jen uvedená čísla. Věcný tón, nic nepřikrášluj.",
        variants: [
          {
            label: "Stručně",
            format: "tři věty a jedno doporučení.",
            output: `Tržby ve 3. kvartálu meziročně vzrostly o 8 %, náklady ale rostly rychleji, o 12 %, hlavně kvůli energiím a mzdám. Marže se proto zužuje, i když objem zakázek roste. Dvě nové zakázky na příští rok dávají dobrý základ – pokud je naceníme podle aktuálních nákladů.

Doporučení: do konce měsíce projít ceník a nastavit ceny nových zakázek tak, aby pokryly růst nákladů.`,
          },
          {
            label: "Detailně",
            format: "shrnutí, rizika a tři kroky s odpovědností, každá část s nadpisem.",
            output: `Shrnutí
Tržby +8 % meziročně, náklady +12 %. Rosteme, ale z každé koruny tržeb vyděláváme méně. Hlavní tlak přichází z energií a mezd.

Rizika
• Pokud trend potrvá, marže se bude dál zužovat.
• Nové zakázky mohou při dnešních cenách skončit s nižším ziskem, než čekáme.

Další kroky
1. Ekonomické oddělení: přepočítat kalkulace obou nových zakázek podle aktuálních nákladů.
2. Výroba: najít tři největší položky spotřeby energie a navrhnout úspory.
3. Vedení: rozhodnout o úpravě ceníku od 1. ledna.

Na příští poradu: aktualizovaná marže po přepočtu nových zakázek.`,
          },
        ],
      },
      {
        id: "hybrid",
        title: "Oznámení změny",
        ask: "Potřebuju týmu oznámit, že od listopadu přecházíme na hybridní práci – 3 dny v kanceláři, 2 z domova.",
        role: "Jsi vedoucí týmu, který umí srozumitelně oznamovat změny.",
        context:
          "Tým 30 lidí, dosud všichni v kanceláři. Od 1. 11. úterý až čtvrtek v kanceláři, pondělí a pátek z domova. Lidé o to dlouho žádali. Zkoušíme to na tři měsíce.",
        task: "Napiš oznámení pro tým.",
        limits: "Jasně uveď, co platí, od kdy a že jde o zkušební období. Nevymýšlej další pravidla. Žádné korporátní fráze.",
        variants: [
          {
            label: "Formální",
            format: "oficiální e-mail s předmětem a pravidly v odrážkách.",
            output: `Předmět: Hybridní režim práce od 1. 11.

Dobrý den, kolegové,

od 1. listopadu zavádíme na zkušební tři měsíce hybridní režim práce.

Pravidla
• V kanceláři pracujeme úterý až čtvrtek.
• V pondělí a v pátek můžete pracovat z domova.

Ke změně přistupujeme proto, že jste o ni dlouhodobě žádali. Po třech měsících společně vyhodnotíme, jak se osvědčila, a rozhodneme, jak dál.

Případné dotazy rád zodpovím osobně nebo e-mailem.

[jméno]`,
          },
          {
            label: "Přátelská",
            format: "krátká zpráva do týmového chatu, tykání.",
            output: `Ahoj všichni,

máme dobrou zprávu: od 1. 11. zkoušíme hybridní práci. Úterý až čtvrtek jsme v kanceláři, v pondělí a v pátek můžete pracovat z domova.

Je to pilot na tři měsíce. Pak spolu probereme, co funguje a co ne, a rozhodneme, jak dál.

Díky, že jste si o to řekli. Kdyby cokoli, napište mi.`,
          },
        ],
      },
      {
        id: "hodnoceni",
        title: "Hodnoticí pohovor",
        ask: "Připrav mi osnovu ročního hodnoticího pohovoru s vedoucím skladu.",
        role: "Jsi zkušený HR partner, který pomáhá manažerům s rozvojem lidí.",
        context:
          "Vedoucí skladu, ve firmě čtyři roky. Silné stránky: spolehlivost, tým ho respektuje. Slabší: plánuje směny na poslední chvíli a změny oznamuje pozdě. Chceme ho udržet a rozvíjet.",
        task: "Připrav osnovu ročního hodnoticího pohovoru.",
        limits: "Zpětná vazba konkrétně a s respektem. Začni tím, co funguje. Pohovor má skončit dohodou na cílech.",
        variants: [
          {
            label: "Stručně",
            format: "osnova v pěti bodech.",
            output: `1. Úvod: proč se scházíme a jak pohovor proběhne.
2. Co se letos povedlo: spolehlivost, respekt týmu, konkrétní příklady.
3. Prostor ke zlepšení: plánování směn s předstihem a včasné oznamování změn.
4. Jeho pohled: co mu pomáhá, co ho brzdí, co by potřeboval.
5. Dohoda: 2–3 cíle na příští rok a termín první kontroly.`,
          },
          {
            label: "Detailně",
            format: "osnova na 45 minut s časy, ke každé části jedna konkrétní otázka.",
            output: `Úvod (5 min)
Účel pohovoru. Ujištění, že jde o rozvoj, ne o kontrolu.

Co funguje (10 min)
„Co považujete za svůj největší úspěch letos?“ Doplňte vlastní příklady spolehlivosti a důvěry týmu.

Prostor ke zlepšení (10 min)
„Jak vypadá plánování směn z vašeho pohledu?“ Uveďte konkrétní situaci, kdy se rozpis měnil na poslední chvíli, a co to způsobilo.

Jeho potřeby (10 min)
„Co by vám práci usnadnilo? Kam se chcete posunout?“

Dohoda (10 min)
Společně stanovte 2–3 cíle, např. rozpis směn vždy týden dopředu. Domluvte kontrolu za tři měsíce.`,
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    tasks: [
      {
        id: "linkedin",
        title: "Příspěvek na LinkedIn",
        ask: "Napiš příspěvek na LinkedIn o tom, že rozšiřujeme výrobu.",
        role: "Jsi copywriter pro B2B komunikaci výrobních firem.",
        context:
          "Firma vyrábí dřevěné díly pro výrobce nábytku, 60 zaměstnanců. Otevíráme novou halu (2 000 m²), přijmeme 15 lidí, zkrátí se dodací lhůty. Čtou nás zákazníci i potenciální zaměstnanci.",
        task: "Napiš příspěvek na firemní LinkedIn.",
        limits: "Nejvýš 120 slov a tři hashtagy. Bez superlativů typu „revoluční“. Na konci výzva pro uchazeče o práci.",
        variants: [
          {
            label: "Formální",
            format: "firemní oznámení ve třech krátkých odstavcích.",
            output: `Rozšiřujeme výrobu

Otevíráme novou výrobní halu o rozloze 2 000 m². Díky ní navýšíme kapacitu a zkrátíme dodací lhůty pro naše zákazníky z řad výrobců nábytku.

S novou halou přijmeme 15 nových kolegů. Hledáme lidi, které baví práce se dřevem a chtějí u své práce vidět výsledek.

Máte zájem, nebo znáte někoho, kdo by k nám zapadl? Volné pozice najdete na našem webu.

#výroba #nábytek #práce`,
          },
          {
            label: "Přátelská",
            format: "osobní tón z pohledu jednatele, kratší text.",
            output: `Poslední měsíce nám ve výrobě bylo těsno. Teď otevíráme novou halu o rozloze 2 000 m².

Pro naše zákazníky to znamená kratší dodací lhůty. Pro nás 15 nových kolegů, na které se moc těšíme.

Pokud vás baví práce se dřevem, ozvěte se mi. Halu vám rád ukážu osobně.

#nábytek #výroba #nábor`,
          },
        ],
      },
      {
        id: "newsletter",
        title: "Newsletter s novinkou",
        ask: "Napiš newsletter, ve kterém zákazníkům představíme novou službu – servis kol s vyzvednutím.",
        role: "Jsi copywriter malé cykloprodejny, která píše zákazníkům srozumitelně a bez nadsázky.",
        context:
          "Nová služba od 1. 3.: kolo vyzvedneme u zákazníka doma, opravíme ho a do tří pracovních dnů vrátíme. Vyzvednutí stojí 190 Kč, členové věrnostního programu ho mají zdarma.",
        task: "Napiš text newsletteru o nové službě.",
        limits: "Vykání. Žádné vykřičníky v předmětu. Uveď cenu a podmínky přesně.",
        variants: [
          {
            label: "Stručně",
            format: "předmět, text do 60 slov a popisek tlačítka.",
            output: `Předmět: Servis kola, aniž byste vyšli z domu

Od 1. března si vaše kolo vyzvedneme přímo u vás doma, opravíme ho a do tří pracovních dnů vrátíme. Vyzvednutí stojí 190 Kč, členové věrnostního programu ho mají zdarma. Jaro je za dveřmi – ať vás zastihne s připraveným kolem.

[Objednat vyzvednutí]`,
          },
          {
            label: "Detailně",
            format: "předmět, úvod, postup ve třech krocích, cena a popisek tlačítka.",
            output: `Předmět: Nově servis kola s vyzvednutím u vás doma

Dobrý den,

dovézt kolo do servisu není vždycky jednoduché. Proto si pro něj od 1. března přijedeme sami.

Jak to funguje
1. Vyzvednutí objednáte na webu nebo telefonicky.
2. Kolo vyzvedneme u vás doma a opravíme ho v dílně.
3. Do tří pracovních dnů vám ho vrátíme.

Kolik to stojí
Vyzvednutí a vrácení stojí 190 Kč. Členové věrnostního programu ho mají zdarma a platí jen samotný servis.

[Objednat vyzvednutí]`,
          },
        ],
      },
      {
        id: "reklama",
        title: "Texty do reklamy",
        ask: "Potřebuju texty do reklamy na Facebooku pro jarní akci naší kavárny.",
        role: "Jsi výkonnostní copywriter se zkušeností s reklamou pro malé podniky.",
        context:
          "Kavárna v centru Brna. Jarní akce: ke každé kávě s sebou croissant za polovinu, platí v dubnu ve všední dny do 10:00. Cílová skupina: lidé cestou do práce.",
        task: "Napiš texty do reklamy na Facebooku.",
        limits: "Podmínky akce uveď přesně. Bez klišé typu „nenechte si ujít“.",
        variants: [
          {
            label: "Stručně",
            format: "tři varianty nadpisu, každá do 40 znaků.",
            output: `1. Ranní káva + croissant za půlku
2. Cestou do práce? Croissant za polovinu
3. Duben do 10:00: croissant za ½ ceny`,
          },
          {
            label: "Detailně",
            format: "dvě kompletní varianty: nadpis, text do 125 znaků a výzva k akci.",
            output: `Varianta 1
Nadpis: Ranní káva s croissantem za půlku
Text: V dubnu ke každé kávě s sebou croissant za polovinu. Všední dny do 10:00 v centru Brna.
Výzva: Zobrazit trasu

Varianta 2
Nadpis: Cestou do práce? Zastavte se.
Text: Káva s sebou a k ní croissant za poloviční cenu. Každý všední den v dubnu do 10:00.
Výzva: Další informace`,
          },
        ],
      },
    ],
  },
];
