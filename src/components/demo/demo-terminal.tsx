"use client";

import { useRef, useState } from "react";
import { cx } from "@/components/ui";
import { DEMO_DAILY_LIMIT, DEMO_MAX_TASK, MARK_OUTPUT, MARK_PROMPT, demoRoles, type DemoRoleId } from "./roles";

type Status = "idle" | "running" | "done" | "error";

function split(raw: string) {
  const o = raw.indexOf(MARK_OUTPUT);
  const p = raw.indexOf(MARK_PROMPT);
  const output = (o >= 0 ? raw.slice(o + MARK_OUTPUT.length, p >= 0 ? p : undefined) : p >= 0 ? "" : raw).trim();
  const prompt = p >= 0 ? raw.slice(p + MARK_PROMPT.length).trim() : "";
  return { output, prompt };
}

export default function DemoTerminal() {
  const [role, setRole] = useState<DemoRoleId>("obchod");
  const [task, setTask] = useState("");
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const current = demoRoles.find((r) => r.id === role)!;
  const { output, prompt } = split(raw);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const text = task.trim() || current.example;
    if (!task.trim()) setTask(text);
    setRaw("");
    setError("");
    setCopied(false);
    setStatus("running");
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;

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
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setRaw(acc);
      }
      if (!acc.trim()) throw new Error("AI nevrátila žádnou odpověď. Zkuste úkol popsat jinak.");
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
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

  const running = status === "running";

  return (
    <div className="border border-line bg-bg">
      {/* Stavový řádek */}
      <div className="micro-xs flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2 md:px-5">
        <span className="signal-glow">● SYSTÉM ONLINE</span>
        <span className="text-muted">
          TERMINÁL / DEMO-01 · DOTAZY:{" "}
          <data value={remaining ?? DEMO_DAILY_LIMIT} className="text-fg">
            {remaining ?? DEMO_DAILY_LIMIT}/{DEMO_DAILY_LIMIT}
          </data>
        </span>
      </div>

      <form onSubmit={run} className="grid border-b border-line lg:grid-cols-12">
        <fieldset className="border-b border-line p-3 md:p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
          <legend className="micro float-left mb-3 w-full text-muted">01 {">>>"} Vyberte roli</legend>
          <div className="grid clear-both grid-cols-2 gap-px bg-line lg:grid-cols-1">
            {demoRoles.map((r) => (
              <label
                key={r.id}
                className={cx(
                  "micro flex cursor-pointer items-center gap-3 px-3 py-3",
                  role === r.id ? "bg-fg text-bg" : "bg-bg hover:bg-bg-2"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.id}
                  checked={role === r.id}
                  onChange={() => setRole(r.id)}
                  className="sr-only"
                />
                <span aria-hidden>{role === r.id ? "[×]" : "[ ]"}</span>
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col p-3 md:p-5 lg:col-span-8">
          <label htmlFor="demo-task" className="micro text-muted">
            02 {">>>"} Napište úkol ze své práce
          </label>
          <div className="mt-3 flex flex-1 items-start gap-2 border border-line p-3 focus-within:border-fg">
            <span aria-hidden className="text-accent">&gt;</span>
            <textarea
              id="demo-task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              maxLength={DEMO_MAX_TASK}
              rows={4}
              placeholder={current.example}
              className="min-h-24 w-full resize-y bg-transparent outline-none placeholder:text-muted"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="micro-xs text-muted">
              {task.length}/{DEMO_MAX_TASK} · Nevkládejte osobní ani citlivé údaje.
            </span>
            <div className="flex gap-2">
              {running ? (
                <button type="button" className="btn" onClick={() => abort.current?.abort()}>
                  [ Stop ]
                </button>
              ) : null}
              <button type="submit" className="btn btn-accent" disabled={running}>
                {running ? "[ Zpracovávám… ]" : "[ Spustit ]"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Výstup */}
      <div className="grid lg:grid-cols-12" aria-live="polite" aria-busy={running}>
        <div className="border-b border-line p-3 md:p-5 lg:col-span-7 lg:border-b-0 lg:border-r">
          <p className="micro text-muted">03 {">>>"} Výstup</p>
          <samp className="mt-4 block min-h-40 whitespace-pre-wrap font-mono text-[15px] leading-relaxed">
            {status === "idle" ? (
              <span className="text-muted">
                Čekám na zadání. Vyberte roli, napište úkol a stiskněte Spustit.
                <br />
              </span>
            ) : null}
            {error ? <span className="text-accent">ERR {">>>"} {error}</span> : output}
            {running || status === "idle" ? <span className="cursor-block ml-1" aria-hidden /> : null}
          </samp>
        </div>
        <div className="p-3 md:p-5 lg:col-span-5">
          <div className="flex items-center justify-between">
            <p className="micro text-muted">04 {">>>"} Hotový prompt</p>
            {prompt && status === "done" ? (
              <button type="button" onClick={copy} className="micro-xs border border-line px-2 py-1 hover:bg-fg hover:text-bg">
                {copied ? "[ Zkopírováno ]" : "[ Kopírovat ]"}
              </button>
            ) : null}
          </div>
          <samp className="mt-4 block min-h-40 whitespace-pre-wrap bg-bg-2 p-3 font-mono text-[13px] leading-relaxed text-muted">
            {prompt || "Sem se vypíše prompt, který si můžete uložit a používat."}
          </samp>
        </div>
      </div>
    </div>
  );
}
