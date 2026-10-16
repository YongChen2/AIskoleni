import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { ThemeName } from "@/config/brand";
import { ArrowRight } from "./icons";
import { VideoBackground } from "./video-background";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost";

/** Tlačítko-odkaz. Primární má šipku, která se na hover posune. */
export function ButtonLink({
  href,
  children,
  variant = "secondary",
  arrow,
  size,
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean; size?: "sm" }) {
  const showArrow = arrow ?? variant === "primary";
  return (
    <Link href={href} data-magnetic className={cx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)} {...rest}>
      {children}
      {showArrow ? (
        <span className="btn-arrow">
          <ArrowRight size={16} />
        </span>
      ) : null}
    </Link>
  );
}

/** Malý štítek nad nadpisem sekce (nejvýš jeden na tři sekce) */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("eyebrow", className)}>{children}</p>;
}

/** Hlavička sekce: volitelný eyebrow, nadpis H2 a perex. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const e = eyebrow;
  return (
    <div data-reveal-block className={cx(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {e ? <Eyebrow>{e}</Eyebrow> : null}
      {title ? <h2 className={cx("display-2", e ? "mt-5" : null)}>{title}</h2> : null}
      {lead ? <p className={cx("lead mt-5", align === "center" && "mx-auto")}>{lead}</p> : null}
      {children}
    </div>
  );
}

/** Barevné prostředí pásu: tokeny přes data-theme, pozadí přes ThemeBackdrop (data-band) */
export const band = (theme?: ThemeName) => (theme ? { "data-theme": theme, "data-band": "" } : {});

/** Obal sekce: svislé mezery + obsahový kontejner. `theme` = samostatný barevný pás. */
export function Section({
  id,
  children,
  className,
  shellClassName,
  theme,
  ...rest
}: { id?: string; children: ReactNode; className?: string; shellClassName?: string; theme?: ThemeName } & ComponentProps<"section">) {
  return (
    <section id={id} className={cx("section relative", className)} {...band(theme)} {...rest}>
      <div className={cx("shell", shellClassName)}>{children}</div>
    </section>
  );
}

export function Badge({
  children,
  tone,
  dot,
  className,
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger";
  dot?: boolean;
  className?: string;
}) {
  return <span className={cx("badge", tone && `badge-${tone}`, dot && "badge-dot", className)}>{children}</span>;
}

const metaCols: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

/** Hlavička podstránky – eyebrow, H1, perex a volitelný řádek klíčových údajů */
export function PageHero({
  label,
  title,
  lead,
  meta,
  children,
}: {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: [string, string][];
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pb-16 pt-14 md:pb-24 md:pt-24">
      <VideoBackground src="ambient" overlay="page" opacity={0.32} className="-z-10" />
      <div aria-hidden className="glow -z-10 -top-48 right-[-10%] h-[36rem] w-[48rem]" />
      <div className="shell">
        <Eyebrow>{label}</Eyebrow>
        <h1 className="display-1 mt-6 max-w-4xl">{title}</h1>
        {lead ? <p className="lead mt-6">{lead}</p> : null}
        {children}
        {meta ? (
          <dl className={cx("mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-16", metaCols[meta.length])}>
            {meta.map(([k, v], i) => (
              <div key={k} className={cx("bg-bg px-4 py-4 md:px-5", meta.length % 2 === 1 && i === meta.length - 1 && "col-span-2 md:col-span-1")}>
                <dt className="label">{k}</dt>
                <dd className="mt-1 text-[15px] text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </header>
  );
}
