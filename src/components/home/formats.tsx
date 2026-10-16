import Link from "next/link";
import { ArrowUpRight, Check } from "@/components/icons";
import { ButtonLink, Section, SectionHead, cx } from "@/components/ui";
import { formats } from "@/content/site";
import { Swipe } from "@/components/swipe";

/** Bento: první formát (vstupní bod) je velká karta s body programu, další dva vedle pod sebou. */
export function Formats() {
  return (
    <Section id="formaty" theme="light">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow="Formáty školení"
          title="Tři kroky od zvědavosti k rutině"
          lead="Začínáme s vedením, pokračujeme po týmech a pak držíme tempo. Každý krok funguje i samostatně."
        />
        <ButtonLink href="/skoleni" className="hidden md:inline-flex">
          Detail formátů
        </ButtonLink>
      </div>

      <Swipe
        count={formats.length}
        label="Formáty školení"
        className="mt-14 md:mt-20"
        gridClassName="lg:grid-cols-2 lg:grid-rows-2"
        data-reveal-group
      >
        {formats.map((f, i) => {
          const big = i === 0;
          return (
            <li key={f.slug} data-reveal className={cx("flex w-[86%] shrink-0 sm:w-[60%] lg:w-auto", big && "lg:row-span-2")}>
              <Link href={`/skoleni#${f.slug}`} className={cx("group flex flex-1 flex-col p-6 md:p-8", big ? "card-glow" : "card")}>
                <div className="flex items-center justify-between">
                  <span className="mono inline-flex h-8 items-center rounded-lg border border-line bg-surface-2 px-2.5 text-[13px] text-muted">
                    {f.step}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-subtle transition-[transform,color] duration-300 ease-[var(--ease)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                  />
                </div>
                <h3 className={cx("mt-8 font-semibold tracking-[-0.03em] text-fg", big ? "text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.1]" : "title")}>
                  {f.title}
                </h3>
                <p className="body mt-3">{f.short}</p>
                {big ? (
                  <ul className="mt-8 hidden space-y-3 lg:block">
                    {f.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[15px] text-muted">
                        <Check size={16} className="mt-1 shrink-0 text-accent-hover" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Parametry">
                  {[f.audience, f.size, f.duration].map((v) => (
                    <li key={v} className="badge">
                      {v}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          );
        })}
      </Swipe>
      <ButtonLink href="/skoleni" className="mt-8 md:hidden">
        Detail formátů
      </ButtonLink>
    </Section>
  );
}
