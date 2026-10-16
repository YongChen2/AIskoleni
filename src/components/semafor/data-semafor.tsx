"use client";

import { useState } from "react";
import { Check, Close } from "@/components/icons";
import { cx } from "@/components/ui";
import { haptic } from "@/lib/haptics";
import { play } from "@/lib/sound";

type Zone = "green" | "orange" | "red";

const zones: { id: Zone; label: string; rule: string; tone: "success" | "warning" | "danger"; dot: string }[] = [
  { id: "green", label: "Zelená", rule: "Můžete vložit do běžného nástroje", tone: "success", dot: "bg-success" },
  { id: "orange", label: "Oranžová", rule: "Jen ve firemní licenci, ideálně anonymizovaně", tone: "warning", dot: "bg-warning" },
  { id: "red", label: "Červená", rule: "Do AI nástroje nepatří", tone: "danger", dot: "bg-accent" },
];

const items: { id: string; label: string; zone: Zone; why: string }[] = [
  { id: "web", label: "Text z vašeho webu", zone: "green", why: "Veřejná informace. Můžete ji bez obav upravovat, překládat i zkracovat." },
  { id: "excel", label: "Dotaz na vzorec v Excelu", zone: "green", why: "Obecný dotaz bez firemních dat. Ideální úloha pro AI." },
  { id: "post", label: "Návrh příspěvku na sítě", zone: "green", why: "Marketingový text určený ke zveřejnění – žádné riziko." },
  {
    id: "invoice",
    label: "Faktura od dodavatele",
    zone: "orange",
    why: "Obsahuje obchodní údaje a ceny. Ve firemní licenci, která data nepoužívá k tréninku, je to v pořádku.",
  },
  {
    id: "minutes",
    label: "Zápis z porady vedení",
    zone: "orange",
    why: "Interní informace. Firemní licence ano, osobní účet ne. Jména a citlivá čísla raději vynechte.",
  },
  {
    id: "sales",
    label: "Tabulka prodejů po klientech",
    zone: "orange",
    why: "Názvy klientů nahraďte kódy. Anonymizovaná data může AI analyzovat bez rizika.",
  },
  {
    id: "contract",
    label: "Smlouva s klientem",
    zone: "orange",
    why: "Jen ve firemním nástroji a s ohledem na mlčenlivost ve smlouvě. Osobní údaje začerněte.",
  },
  {
    id: "hr",
    label: "Mzdy a rodná čísla zaměstnanců",
    zone: "red",
    why: "Osobní údaje podle GDPR. Do AI nástroje je nevkládejte ani ve firemní licenci, pokud to výslovně neschválí DPO.",
  },
  {
    id: "health",
    label: "Zdravotní údaje",
    zone: "red",
    why: "Zvláštní kategorie osobních údajů. Bez právního základu a posouzení rizik nikdy.",
  },
  {
    id: "pass",
    label: "Hesla a API klíče",
    zone: "red",
    why: "Přístupové údaje nepatří nikam mimo správce hesel. Ani do AI, ani do e-mailu.",
  },
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
  const lastOk = lastItem ? placed[lastItem.id] === lastItem.zone : false;

  function place(id: string, zone: Zone) {
    const item = items.find((i) => i.id === id);
    const ok = item?.zone === zone;
    haptic(ok ? 10 : [20, 40, 20]);
    play(ok ? "confirm" : "error");
    setPlaced((p) => ({ ...p, [id]: zone }));
    setLast(id);
  }

  return (
    <div data-sound="custom" className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 md:px-6">
        <p className="text-[15px] font-medium text-fg">Datový semafor</p>
        <p className="text-[14px] text-muted">
          Rozřazeno{" "}
          <data value={items.length - pool.length} className="mono text-fg">
            {items.length - pool.length}/{items.length}
          </data>
          <span className="mx-2 text-subtle">·</span>
          Správně{" "}
          <data value={correct} className="mono text-fg">
            {correct}
          </data>
        </p>
      </div>
      <div className="h-0.5 bg-white/[0.06]" aria-hidden>
        <div
          className="h-full origin-left bg-accent transition-transform duration-500 ease-[var(--ease)]"
          style={{ transform: `scaleX(${(items.length - pool.length) / items.length})` }}
        />
      </div>

      {/* Zásobník karet */}
      <div className="p-5 md:p-6">
        <p className="text-[15px] text-muted">Přetáhněte kartu do správné zóny, nebo klikněte na barevnou tečku.</p>
        <ul className="mt-5 flex min-h-14 flex-wrap gap-2.5">
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
                "flex w-full cursor-grab items-center justify-between gap-1 rounded-xl border border-line bg-surface-2 py-1 pl-3.5 pr-1 sm:w-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[opacity,border-color] duration-200 hover:border-line-strong active:cursor-grabbing",
                dragging === i.id && "opacity-40",
              )}
            >
              <span className="pr-2 text-[15px] text-fg">{i.label}</span>
              <span className="flex shrink-0">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => place(i.id, z.id)}
                    className="group inline-flex h-11 w-9 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/[0.06]"
                    aria-label={`${i.label}: zařadit do zóny ${z.label}`}
                    title={z.label}
                  >
                    <span
                      className={cx(
                        "h-3 w-3 rounded-full opacity-70 transition-[opacity,transform] duration-200 group-hover:scale-125 group-hover:opacity-100",
                        z.dot,
                      )}
                    />
                  </button>
                ))}
              </span>
            </li>
          ))}
          {done ? (
            <li className="flex flex-wrap items-center gap-3 text-[15px] text-fg">
              <span className={cx("badge badge-dot", correct === items.length ? "badge-success" : "badge-warning")}>
                Hotovo · {correct}/{items.length} správně
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm min-h-11 lg:min-h-9"
                onClick={() => {
                  setPlaced({});
                  setLast(null);
                }}
              >
                Zkusit znovu
              </button>
            </li>
          ) : null}
        </ul>
      </div>

      {/* Zpětná vazba */}
      <div className="mx-5 mb-5 min-h-[4.5rem] rounded-xl border border-line bg-surface-2 p-4 md:mx-6" aria-live="polite">
        {lastItem ? (
          <p className="flex gap-3 text-[15px]">
            <span
              className={cx(
                "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                lastOk ? "bg-success/15 text-success" : "bg-accent/15 text-accent-hover",
              )}
            >
              {lastOk ? <Check size={14} /> : <Close size={13} />}
            </span>
            <span>
              <strong className="font-medium text-fg">
                {lastOk ? "Správně." : `Patří do zóny ${zones.find((z) => z.id === lastItem.zone)!.label.toLowerCase()}.`}
              </strong>{" "}
              <span className="text-fg">{lastItem.label}:</span> <span className="text-muted">{lastItem.why}</span>
            </span>
          </p>
        ) : (
          <p className="text-[15px] text-subtle">Zpětná vazba se zobrazí po zařazení první karty.</p>
        )}
      </div>

      {/* Zóny */}
      <div className="grid gap-px border-t border-line bg-line md:grid-cols-3">
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
              className={cx("min-h-56 bg-surface p-5 transition-colors duration-200 md:p-6", over === z.id && "bg-surface-2")}
            >
              <span className={cx("badge badge-dot", `badge-${z.tone}`)}>{z.label}</span>
              <p className="label mt-3">{z.rule}</p>
              <ul className="mt-4 space-y-1.5">
                {inZone.map((i) => {
                  const ok = i.zone === z.id;
                  return (
                    <li
                      key={i.id}
                      className={cx(
                        "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[14px]",
                        ok ? "border-line bg-surface-2 text-fg" : "border-accent/40 bg-accent/[0.07] text-accent-hover",
                      )}
                    >
                      <span>{i.label}</span>
                      {ok ? <Check size={15} className="text-success" /> : <Close size={14} />}
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
