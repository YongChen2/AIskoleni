"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { formats } from "@/content/site";
import { contactRoles, contactSchema, teamSizes } from "./schema";

type Errors = Partial<Record<string, string[]>>;

function FieldError({ errors, name }: { errors: Errors; name: string }) {
  const e = errors[name]?.[0];
  return e ? (
    <p id={`${name}-error`} className="mt-2 text-[13.5px] text-accent-hover">
      {e}
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
      <div className="card-glow p-8 md:p-12" role="status">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Check size={22} />
        </span>
        <p className="display-2 mt-8">Děkujeme.</p>
        <p className="lead mt-4">Ozveme se do dvou pracovních dnů a domluvíme krátký úvodní hovor.</p>
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
    <form onSubmit={submit} noValidate className="card relative p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="title">Poptávka školení</p>
        <p className="label">* povinné údaje</p>
      </div>

      {context ? (
        <p className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-3 text-[14px] text-fg">
          <span className="badge badge-danger badge-dot">Z kvízu</span>
          {context}
        </p>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {[
          { name: "name", label: "Jméno a příjmení *", type: "text", auto: "name" },
          { name: "company", label: "Firma *", type: "text", auto: "organization" },
          { name: "email", label: "E-mail *", type: "email", auto: "email" },
          { name: "phone", label: "Telefon", type: "tel", auto: "tel" },
        ].map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="field-label">
              {f.label}
            </label>
            <input {...field(f.name)} type={f.type} autoComplete={f.auto} className="field" />
            <FieldError errors={errors} name={f.name} />
          </div>
        ))}
      </div>

      <fieldset className="mt-7" aria-describedby={errors.teamSize ? "teamSize-error" : undefined}>
        <legend className="field-label">Velikost týmu *</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {teamSizes.map((s) => (
            <label key={s} className="choice">
              <input type="radio" name="teamSize" value={s} className="sr-only" />
              {s} osob
            </label>
          ))}
        </div>
        <FieldError errors={errors} name="teamSize" />
      </fieldset>

      <fieldset className="mt-7">
        <legend className="field-label">Koho chcete školit</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {contactRoles.map((r) => (
            <label key={r} className="choice">
              <input type="checkbox" name="roles" value={r} className="sr-only" />
              <span aria-hidden className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border border-line-strong text-transparent [.choice:has(:checked)_&]:border-accent [.choice:has(:checked)_&]:bg-accent [.choice:has(:checked)_&]:text-white">
                <Check size={11} />
              </span>
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <label htmlFor="message" className="field-label">
          Zpráva
        </label>
        <textarea {...field("message")} rows={5} className="field resize-y" placeholder="Co od školení čekáte? Jaké nástroje používáte?" />
        <FieldError errors={errors} name="message" />
      </div>

      {/* Honeypot – lidé ho nevidí */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="label max-w-md">
          Údaje použijeme jen k odpovědi na poptávku. Více v{" "}
          <a href="/ochrana-osobnich-udaju" className="text-muted underline underline-offset-4 hover:text-fg">
            ochraně osobních údajů
          </a>
          .
        </p>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Odesílám…" : "Odeslat poptávku"}
          {status === "sending" ? null : (
            <span className="btn-arrow">
              <ArrowRight size={16} />
            </span>
          )}
        </button>
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-5 rounded-xl border border-accent/40 bg-accent/[0.07] px-4 py-3 text-[14.5px] text-accent-hover">
          {message}
        </p>
      ) : null}
    </form>
  );
}
