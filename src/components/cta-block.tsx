import { ButtonLink, Section } from "@/components/ui";
import { brand } from "@/config/brand";

export function CtaBlock({
  title = (
    <>
      Domluvme <span className="text-accent">první</span> krok
    </>
  ),
  text = "Půlhodinový hovor, nezávazně. Zjistíme, kde vašemu týmu AI ušetří nejvíc času, a navrhneme formát školení.",
}: {
  title?: React.ReactNode;
  text?: string;
}) {
  return (
    <Section className="relative overflow-hidden" data-hud-code="CMD" data-hud-label="Spolupráce">
      <div className="hazard absolute inset-x-0 top-0 h-2" aria-hidden />
      <p className="micro text-muted">
        <span className="text-accent">CMD</span> {">>>"} [ ZAHÁJIT SPOLUPRÁCI ]
      </p>
      <h2 className="macro mt-10 max-w-[12ch] md:mt-16">{title}</h2>
      <div className="mt-12 grid gap-8 md:grid-cols-12 md:items-end">
        <p className="prose-body md:col-span-6">{text}</p>
        <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
          <ButtonLink href="/kontakt" accent>
            Domluvit školení
          </ButtonLink>
          <a className="btn" href={`mailto:${brand.contact.email}`}>
            [ Napsat e-mail ]
          </a>
        </div>
      </div>
    </Section>
  );
}
