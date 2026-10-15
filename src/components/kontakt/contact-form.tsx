"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cx } from "@/components/ui";
import { formats } from "@/content/site";
import { contactRoles, contactSchema, teamSizes } from "./schema";

type Errors = Partial<Record<string, string[]>>;

function FieldError({ errors, name }: { errors: Errors; name: string }) {
  const e = errors[name]?.[0];
  return e ? (
    <p id={`${name}-error`} className="micro-xs mt-2 text-accent">
      ERR {">>>"} {e}
    </p>
  ) : null;
}

export function ContactForm() {
  const params = useSearchParams();
  const format = formats.find((f) => f.slug === params.get("format"));
  const score = params.get("skore");
  const context = [format ? `Zájem o: ${format.title}` : null, score ? `Výsledek kvízu: ${score} %` : null]
    .filter(Boolean)
    .join(" · ");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      teamSize: fd.get("teamSize") ?? undefined,
      roles: fd.getAll("roles"),
      message: fd.get("message"),
      context,
      website: fd.get("website"),
    };

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]);
        fe[k] = [...(fe[k] ?? []), issue.message];
      }
      setErrors(fe);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error ?? "Odeslání se nepovedlo.");
      }
      setStatus("sent");
    } catch (err) {
      setMessage((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line p-6 md:p-10" role="status">
        <p className="micro text-accent">[ PŘENOS DOKONČEN ]</p>
        <p className="macro-md mt-6">Děkujeme.</p>
        <p className="prose-body mt-6">Ozveme se do dvou pracovních dnů a domluvíme krátký úvodní hovor.</p>
      </div>
    );
  }

  const field = (name: string) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="relative border border-line">
      <div className="micro-xs flex justify-between border-b border-line px-4 py-2 text-muted md:px-6">
        <span>[ FORMULÁŘ / POPTÁVKA ]</span>
        <span>* POVINNÉ</span>
      </div>

      {context ? (
        <p className="micro border-b border-line px-4 py-3 md:px-6">
          <span className="text-accent">{">>>"}</span> {context}
        </p>
      ) : null}

      <div className="grid gap-px bg-line md:grid-cols-2">
        {[
          { name: "name", label: "Jméno a příjmení *", type: "text", auto: "name" },
          { name: "company", label: "Firma *", type: "text", auto: "organization" },
          { name: "email", label: "E-mail *", type: "email", auto: "email" },
          { name: "phone", label: "Telefon", type: "tel", auto: "tel" },
        ].map((f) => (
          <div key={f.name} className="bg-bg p-4 md:p-6">
            <label htmlFor={f.name} className="micro text-muted">
              {f.label}
            </label>
            <input {...field(f.name)} type={f.type} autoComplete={f.auto} className="field mt-2" />
            <FieldError errors={errors} name={f.name} />
          </div>
        ))}
      </div>

      <fieldset className="border-t border-line p-4 md:p-6" aria-describedby={errors.teamSize ? "teamSize-error" : undefined}>
        <legend className="micro float-left w-full text-muted">Velikost týmu *</legend>
        <div className="clear-both grid grid-cols-2 gap-px bg-line pt-2 sm:grid-cols-4">
          {teamSizes.map((s) => (
            <label key={s} className="micro flex cursor-pointer items-center gap-3 bg-bg p-3 has-[:checked]:bg-fg has-[:checked]:text-bg">
              <input type="radio" name="teamSize" value={s} className="sr-only" />
              <span aria-hidden>[ ]</span> {s} osob
            </label>
          ))}
        </div>
        <FieldError errors={errors} name="teamSize" />
      </fieldset>

      <fieldset className="border-t border-line p-4 md:p-6">
        <legend className="micro float-left w-full text-muted">Koho chcete školit</legend>
        <div className="clear-both grid grid-cols-2 gap-px bg-line pt-2 sm:grid-cols-3">
          {contactRoles.map((r) => (
            <label key={r} className="micro flex cursor-pointer items-center gap-3 bg-bg p-3 has-[:checked]:bg-fg has-[:checked]:text-bg">
              <input type="checkbox" name="roles" value={r} className="sr-only" />
              <span aria-hidden>[+]</span> {r}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="border-t border-line p-4 md:p-6">
        <label htmlFor="message" className="micro text-muted">
          Zpráva
        </label>
        <textarea
          {...field("message")}
          rows={5}
          className="field mt-2 resize-y"
          placeholder="Co od školení čekáte? Jaké nástroje používáte?"
        />
        <FieldError errors={errors} name="message" />
      </div>

      {/* Honeypot – lidé ho nevidí */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-4 md:p-6">
        <p className="micro-xs max-w-md text-muted">
          Údaje použijeme jen k odpovědi na poptávku. Více v{" "}
          <a href="/ochrana-osobnich-udaju" className="underline">
            ochraně osobních údajů
          </a>
          .
        </p>
        <button type="submit" className={cx("btn btn-accent")} disabled={status === "sending"}>
          {status === "sending" ? "[ Odesílám… ]" : "[ Odeslat poptávku ]"}
        </button>
      </div>
      {status === "error" ? (
        <p role="alert" className="micro border-t border-accent px-4 py-3 text-accent md:px-6">
          ERR {">>>"} {message}
        </p>
      ) : null}
    </form>
  );
}
