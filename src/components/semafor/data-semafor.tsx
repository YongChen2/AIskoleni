"use client";

import { useState } from "react";
import { cx } from "@/components/ui";
import { brand } from "@/config/brand";
import { haptic } from "@/lib/haptics";

type Zone = "green" | "orange" | "red";

const zones: { id: Zone; label: string; rule: string; mark: string }[] = [
  { id: "green", label: "Zelená", rule: "Můžete vložit do běžného nástroje", mark: brand.colors.trafficGreen },
  { id: "orange", label: "Oranžová", rule: "Jen ve firemní licenci, ideálně anonymizovaně", mark: brand.colors.trafficOrange },
  { id: "red", label: "Červená", rule: "Do AI nástroje nepatří", mark: brand.colors.accent },
];

const items: { id: string; label: string; zone: Zone; why: string }[] = [
  { id: "web", label: "Text z vašeho webu", zone: "green", why: "Veřejná informace. Můžete ji bez obav upravovat, překládat i zkracovat." },
  { id: "excel", label: "Dotaz na vzorec v Excelu", zone: "green", why: "Obecný dotaz bez firemních dat. Ideální úloha pro AI." },
  { id: "post", label: "Návrh příspěvku na sítě", zone: "green", why: "Marketingový text určený ke zveřejnění – žádné riziko." },
  { id: "invoice", label: "Faktura od dodavatele", zone: "orange", why: "Obsahuje obchodní údaje a ceny. Ve firemní licenci, která data nepoužívá k tréninku, je to v pořádku." },
  { id: "minutes", label: "Zápis z porady vedení", zone: "orange", why: "Interní informace. Firemní licence ano, osobní účet ne. Jména a citlivá čísla raději vynechte." },
  { id: "sales", label: "Tabulka prodejů po klientech", zone: "orange", why: "Názvy klientů nahraďte kódy. Anonymizovaná data může AI analyzovat bez rizika." },
  { id: "contract", label: "Smlouva s klientem", zone: "orange", why: "Jen ve firemním nástroji a s ohledem na mlčenlivost ve smlouvě. Osobní údaje začerněte." },
  { id: "hr", label: "Mzdy a rodná čísla zaměstnanců", zone: "red", why: "Osobní údaje podle GDPR. Do AI nástroje je nevkládejte ani ve firemní licenci, pokud to výslovně neschválí DPO." },
  { id: "health", label: "Zdravotní údaje", zone: "red", why: "Zvláštní kategorie osobních údajů. Bez právního základu a posouzení rizik nikdy." },
  { id: "pass", label: "Hesla a API klíče", zone: "red", why: "Přístupové údaje nepatří nikam mimo správce hesel. Ani do AI, ani do e-mailu." },
];

export function DataSemafor() {
  const [placed, setPlaced] = useState<Record<string, Zone>>({});
  const [last, setLast] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Zone | null>(null);

  const pool = items.filter((i) => !placed[i.id]);
  const done = pool.length === 0;
  const correct = items.filter((i) => placed[i.id] === i.zone).length;
  const lastItem = items.find((i) => i.id === last);

  function place(id: string, zone: Zone) {
    const item = items.find((i) => i.id === id);
    haptic(item?.zone === zone ? 10 : [20, 40, 20]);
    setPlaced((p) => ({ ...p, [id]: zone }));
    setLast(id);
  }

  return (
    <div>
      <div className="micro-xs flex flex-wrap justify-between gap-2 border border-b-0 border-line px-3 py-2 text-muted md:px-5">
        <span>[ DATOVÝ SEMAFOR / SIM-01 ]</span>
        <span>
          ROZŘAZENO <data value={items.length - pool.length}>{items.length - pool.length}</data>/{items.length} · SPRÁVNĚ{" "}
          <data value={correct} className="text-fg">{correct}</data>
        </span>
      </div>

      {/* Zásobník karet */}
      <div className="border border-line p-3 md:p-5">
        <p className="micro text-muted">
          {">>>"} Přetáhněte kartu do správné zóny, nebo použijte tlačítka Z / O / Č.
        </p>
        <ul className="mt-4 flex min-h-14 flex-wrap gap-2">
          {pool.map((i) => (
            <li
              key={i.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", i.id);
                e.dataTransfer.effectAllowed = "move";
                setDragging(i.id);
              }}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
              }}
              className={cx(
                "flex cursor-grab items-stretch border border-fg bg-bg active:cursor-grabbing",
                dragging === i.id && "opacity-40"
              )}
            >
              <span className="micro flex items-center px-3 py-2">{i.label}</span>
              {zones.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => place(i.id, z.id)}
                  className="micro-xs min-h-11 min-w-11 border-l border-line px-2 hover:bg-fg hover:text-bg"
                  aria-label={`${i.label}: zařadit do zóny ${z.label}`}
                >
                  {z.label[0]}
                </button>
              ))}
            </li>
          ))}
          {done ? (
            <li className="micro py-2">
              [ HOTOVO ] Skóre {correct}/{items.length}.{" "}
              <button type="button" className="min-h-11 text-accent underline" onClick={() => { setPlaced({}); setLast(null); }}>
                Zkusit znovu
              </button>
            </li>
          ) : null}
        </ul>
      </div>

      {/* Zpětná vazba */}
      <div className="min-h-24 border border-t-0 border-line p-3 md:p-5" aria-live="polite">
        {lastItem ? (
          <p>
            <span className={cx("micro mr-2", placed[lastItem.id] === lastItem.zone ? "text-fg" : "text-accent")}>
              {placed[lastItem.id] === lastItem.zone ? "[ SPRÁVNĚ ]" : `[ CHYBA → ${zones.find((z) => z.id === lastItem.zone)!.label.toUpperCase()} ]`}
            </span>
            <strong className="font-normal">{lastItem.label}:</strong> <span className="text-muted">{lastItem.why}</span>
          </p>
        ) : (
          <p className="micro text-muted">Zpětná vazba se zobrazí po zařazení první karty.</p>
        )}
      </div>

      {/* Zóny */}
      <div className="hairgrid mt-6 md:grid-cols-3">
        {zones.map((z) => {
          const inZone = items.filter((i) => placed[i.id] === z.id);
          return (
            <div
              key={z.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(z.id);
              }}
              onDragLeave={() => setOver((o) => (o === z.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) place(id, z.id);
                setOver(null);
              }}
              className={cx("min-h-56 p-4 md:p-5", over === z.id && "bg-bg-2! outline outline-1 -outline-offset-4 outline-fg")}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-3 w-3" style={{ background: z.mark }} />
                <p className="micro">[ {z.label} ]</p>
              </div>
              <p className="micro-xs mt-2 text-muted">{z.rule}</p>
              <ul className="mt-4 space-y-1">
                {inZone.map((i) => {
                  const ok = i.zone === z.id;
                  return (
                    <li key={i.id} className={cx("micro-xs flex justify-between gap-2 border px-2 py-1.5", ok ? "border-line" : "border-accent text-accent")}>
                      <span>{i.label}</span>
                      <span>{ok ? "OK" : "✕"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
