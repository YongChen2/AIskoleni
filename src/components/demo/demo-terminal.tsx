"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Copy, Sparkle } from "@/components/icons";
import { cx } from "@/components/ui";
import { DemoFrame } from "./demo-frame";
import { DEMO_DAILY_LIMIT, DEMO_MAX_TASK, MARK_OUTPUT, MARK_PROMPT, demoRoles, type DemoRoleId } from "./roles";

type Status = "idle" | "running" | "done" | "error";

function split(raw: string) {
  const o = raw.indexOf(MARK_OUTPUT);
  const p = raw.indexOf(MARK_PROMPT);
  const output = (o >= 0 ? raw.slice(o + MARK_OUTPUT.length, p >= 0 ? p : undefined) : p >= 0 ? "" : raw).trim();
  const prompt = p >= 0 ? raw.slice(p + MARK_PROMPT.length).trim() : "";
  return { output, prompt };
}

/** Indikátor psaní – běží jen během streamování (motivovaný stav, ne nekonečná dekorace). */
function Typing() {
  return (
    <span className="inline-flex gap-1 align-middle" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  );
}

export default function DemoTerminal() {
  const [role, setRole] = useState<DemoRoleId>("obchod");
  const [task, setTask] = useState("");
  const [asked, setAsked] = useState("");
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const current = demoRoles.find((r) => r.id === role)!;
  const { output, prompt } = split(raw);
  const running = status === "running";

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    const text = task.trim() || current.example;
    if (!task.trim()) setTask(text);
    setAsked(text);
    setRaw("");
    setError("");
    setCopied(false);
    setStatus("running");
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    let acc = "";

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, task: text }),
        signal: ctrl.signal,
      });
      const left = res.headers.get("X-RateLimit-Remaining");
      if (left !== null) setRemaining(Number(left));
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Spojení selhalo. Zkuste to prosím znovu.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setRaw(acc);
      }
      if (!acc.trim()) throw new Error("AI nevrátila žádnou odpověď. Zkuste úkol popsat jinak.");
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setStatus(acc ? "done" : "idle");
        return;
      }
      setError((err as Error).message);
      setStatus("error");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <DemoFrame
      right={
        <span className="mono text-[12px] text-subtle">
          Dotazy dnes{" "}
          <data value={remaining ?? DEMO_DAILY_LIMIT} className="text-muted">
            {remaining ?? DEMO_DAILY_LIMIT}/{DEMO_DAILY_LIMIT}
          </data>
        </span>
      }
    >
      <form onSubmit={run}>
        {/* Záložky rolí */}
        <fieldset className="border-b border-line">
          <legend className="sr-only">Vyberte roli</legend>
          <div className="swipe flex gap-1 overflow-x-auto px-3 py-2.5 md:px-4" role="presentation">
            {demoRoles.map((r) => (
              <label
                key={r.id}
                className={cx(
                  "inline-flex min-h-10 shrink-0 cursor-pointer items-center rounded-[9px] px-3.5 text-[14px] font-medium transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                  role === r.id ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg"
                )}
              >
                <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} className="sr-only" />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid lg:grid-cols-12" aria-live="polite" aria-busy={running}>
          {/* Konverzace */}
          <div className="min-h-[19rem] border-b border-line p-4 md:p-6 lg:col-span-7 lg:border-b-0 lg:border-r">
            {status === "idle" ? (
              <div className="flex h-full flex-col justify-center">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-surface-2 text-accent-hover">
                  <Sparkle size={18} />
                </span>
                <p className="mt-5 text-[17px] font-medium text-fg">Zadejte úkol ze své práce</p>
                <p className="body mt-2 text-[15px]">AI vrátí ukázkový výstup a prompt, který si můžete uložit a používat dál.</p>
                <button
                  type="button"
                  onClick={() => setTask(current.example)}
                  className="mt-6 self-start rounded-xl border border-line bg-surface-2 px-4 py-3 text-left text-[14px] text-muted transition-colors duration-200 hover:border-line-strong hover:text-fg"
                >
                  <span className="label mb-1 block">Příklad · {current.label}</span>
                  {current.example}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-3 text-[15px] text-fg">{asked}</div>
                <div className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-hover">
                    <Sparkle size={15} />
                  </span>
                  <samp className="block min-w-0 flex-1 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-muted">
                    {error ? <span className="text-accent-hover">{error}</span> : output}
                    {running && !output ? <Typing /> : null}
                  </samp>
                </div>
              </div>
            )}
          </div>

          {/* Hotový prompt */}
          <div className="flex flex-col p-4 md:p-6 lg:col-span-5">
            <div className="flex min-h-9 items-center justify-between gap-3">
              <p className="text-[14px] font-medium text-fg">Hotový prompt</p>
              {prompt && status === "done" ? (
                <button type="button" onClick={copy} className="btn btn-secondary btn-sm min-h-11 lg:min-h-9">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Zkopírováno" : "Kopírovat"}
                </button>
              ) : null}
            </div>
            <samp className="inset mt-3 block min-h-40 flex-1 whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-muted">
              {prompt || <span className="text-subtle">Sem se vypíše prompt, který si můžete uložit a používat.</span>}
            </samp>
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-line p-3 md:p-4">
          <label htmlFor="demo-task" className="sr-only">
            Napište úkol ze své práce
          </label>
          <div className="rounded-[14px] border border-line bg-surface-2 transition-[border-color,box-shadow] duration-200 focus-within:border-[color-mix(in_srgb,var(--accent)_55%,var(--line-strong))] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_20%,transparent)]">
            <textarea
              id="demo-task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !running) void run();
              }}
              maxLength={DEMO_MAX_TASK}
              rows={2}
              placeholder={`Např.: ${current.example}`}
              className="block min-h-16 w-full resize-none bg-transparent px-4 pt-3 text-[16px] text-fg outline-none placeholder:text-subtle"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-3 pl-4">
              <span className="text-[12.5px] text-subtle">
                <span className="mono">
                  {task.length}/{DEMO_MAX_TASK}
                </span>{" "}
                · Nevkládejte osobní ani citlivé údaje.
              </span>
              <div className="flex gap-2">
                {running ? (
                  <button type="button" className="btn btn-secondary btn-sm min-h-11 lg:min-h-9" onClick={() => abort.current?.abort()}>
                    Zastavit
                  </button>
                ) : null}
                <button type="submit" className="btn btn-primary btn-sm min-h-11 lg:min-h-9" disabled={running}>
                  {running ? "Generuji…" : "Spustit"}
                  {running ? null : <ArrowRight size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DemoFrame>
  );
}
