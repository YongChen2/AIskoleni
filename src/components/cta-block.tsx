import { ButtonLink } from "@/components/ui";
import { brand } from "@/config/brand";

export function CtaBlock({
  title = (
    <>
      Domluvme <span className="hl">první krok</span>
    </>
  ),
  text = "Půlhodinový hovor, nezávazně. Zjistíme, kde vašemu týmu AI ušetří nejvíc času, a navrhneme formát školení.",
}: {
  title?: React.ReactNode;
  text?: string;
}) {
  return (
    <section className="section">
      <div className="shell">
        <div className="card-glow relative isolate overflow-hidden px-6 py-16 text-center md:px-12 md:py-24">
          <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
          <div aria-hidden className="glow -z-10 left-1/2 top-[-60%] h-[40rem] w-[60rem] -translate-x-1/2" />
          <h2 className="display-2 mx-auto max-w-[18ch]">{title}</h2>
          <p className="lead mx-auto mt-5 max-w-[52ch]">{text}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/kontakt" variant="primary">
              Domluvit školení
            </ButtonLink>
            <a className="btn btn-secondary" href={`mailto:${brand.contact.email}`}>
              Napsat e-mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
