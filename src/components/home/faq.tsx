import Link from "next/link";
import { Plus } from "@/components/icons";
import { Section } from "@/components/ui";
import { faq } from "@/content/site";

export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="display-2">Časté dotazy</h2>
            <p className="lead mt-5">
              Nenašli jste odpověď?{" "}
              <Link href="/kontakt" className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
                Napište nám
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="lg:col-span-8">
          {faq.map((f) => (
            <details key={f.q} className="group border-b border-line first:border-t">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium text-fg transition-colors duration-200 hover:text-white [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform duration-300 ease-[var(--ease)] group-open:rotate-45"
                >
                  <Plus size={15} />
                </span>
              </summary>
              <p className="body -mt-1 pb-6 pr-14">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
