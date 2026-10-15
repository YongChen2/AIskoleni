import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Obdélníkové tlačítko-odkaz `[ TEXT ]` */
export function ButtonLink({
  href,
  children,
  accent,
  className,
  ...rest
}: ComponentProps<typeof Link> & { accent?: boolean }) {
  return (
    <Link href={href} className={cx("btn", accent && "btn-accent", className)} {...rest}>
      [ {children} ]
    </Link>
  );
}

/** Křížek na průsečíku gridu */
export function Cross({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx("pointer-events-none absolute micro text-muted select-none leading-none", className)}>
      +
    </span>
  );
}

/** Čtyři křížky v rozích rodiče (rodič musí mít `relative`) */
export function Corners() {
  return (
    <>
      <Cross className="-left-[5px] -top-[8px]" />
      <Cross className="-right-[5px] -top-[8px]" />
      <Cross className="-left-[5px] -bottom-[8px]" />
      <Cross className="-right-[5px] -bottom-[8px]" />
    </>
  );
}

export function Barcode({ className }: { className?: string }) {
  return <div aria-hidden className={cx("barcode h-8", className)} />;
}

/** Hlavička sekce: kód sekce, štítek a volitelná metadata */
export function SectionHead({
  code,
  label,
  meta,
}: {
  code: string;
  label: string;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3 micro">
      <span>
        <span className="text-accent">{code}</span> <span className="text-muted">{"///"}</span> [ {label} ]
      </span>
      {meta ? <span className="text-muted">{meta}</span> : null}
    </div>
  );
}

/** Obal sekce s vnitřním okrajem a horní linkou přes celou šířku */
export function Section({
  id,
  children,
  className,
  ...rest
}: { id?: string; children: ReactNode; className?: string } & ComponentProps<"section">) {
  return (
    <section id={id} className={cx("border-t border-line px-4 py-16 md:px-8 md:py-28", className)} {...rest}>
      {children}
    </section>
  );
}

export function Tag({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span className={cx("micro-xs inline-block border px-2 py-1", accent ? "border-accent text-accent" : "border-line text-muted")}>
      {children}
    </span>
  );
}

/** Hlavička podstránky – obří titulek s mono metadaty */
export function PageHero({
  code,
  label,
  title,
  lead,
  meta,
}: {
  code: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: [string, string][];
}) {
  return (
    <header className="px-4 pb-14 pt-10 md:px-8 md:pb-24 md:pt-16">
      <SectionHead code={code} label={label} meta={`UNIT / ${code}`} />
      <h1 className="macro mt-10 break-words md:mt-16">{title}</h1>
      <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12">
        {lead ? <p className="prose-body text-fg md:col-span-7">{lead}</p> : null}
        {meta ? (
          <dl className="micro grid grid-cols-2 gap-x-6 gap-y-2 self-end md:col-span-4 md:col-start-9">
            {meta.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </header>
  );
}
