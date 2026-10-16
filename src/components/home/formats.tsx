import Link from "next/link";
import { ButtonLink, Section, SectionHead } from "@/components/ui";
import { formats } from "@/content/site";
import { Swipe } from "@/components/swipe";

export function Formats() {
  return (
    <Section id="formaty">
      <SectionHead code="SEC.02" label="Formáty školení" meta="3 MODULY / NAVAZUJÍCÍ" />
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 md:mt-16">
        <h2 className="macro-md max-w-[14ch]">Tři kroky od zvědavosti k rutině</h2>
        <ButtonLink href="/skoleni">Detail formátů</ButtonLink>
      </div>

      <Swipe count={formats.length} label="Formáty školení" className="mt-12 md:mt-20" gridClassName="lg:grid-cols-3" data-reveal-group>
        {formats.map((f) => (
          <li key={f.slug} data-reveal className="group relative flex w-[86%] shrink-0 flex-col bg-bg lg:w-auto">
            <Link href={`/skoleni#${f.slug}`} className="flex flex-1 flex-col p-5 hover:bg-bg-2 md:p-8">
              <div className="micro flex justify-between text-muted">
                <span>&lt; MODUL {f.step} &gt;</span>
                <span className="group-hover:text-accent">{">>>"}</span>
              </div>
              <p aria-hidden className="macro outline-num mt-8 text-[clamp(5rem,12vw,10rem)]">
                {f.step}
              </p>
              <h3 className="macro-sm mt-4">{f.title}</h3>
              <p className="mb-8 mt-4 text-muted">{f.short}</p>
              <dl className="micro-xs mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-line pt-4">
                <dt className="text-muted">Pro</dt>
                <dd>{f.audience}</dd>
                <dt className="text-muted">Rozsah</dt>
                <dd>{f.size}</dd>
                <dt className="text-muted">Délka</dt>
                <dd>{f.duration}</dd>
              </dl>
            </Link>
          </li>
        ))}
      </Swipe>
    </Section>
  );
}
