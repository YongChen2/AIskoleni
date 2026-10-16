import { Badge, ButtonLink } from "@/components/ui";
import { SensorButton } from "@/components/hero3d/sensor-button";
import { VideoBackground } from "@/components/video-background";

const meta: [string, string][] = [
  ["Formát", "Prezenčně i online"],
  ["Skupina", "6–12 osob"],
  ["Jazyk", "Čeština"],
  ["Výstup", "Report pro vedení"],
];

export function Hero({ visual }: { visual?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* pozadí: smyčkové video, akcentní záře a 3D síť (na desktopu vpravo, na mobilu nahoře a vyblednutá) */}
      <VideoBackground src="hero" overlay="hero" className="-z-20" />
      <div aria-hidden className="glow -z-20 right-[-20%] top-[-10%] h-[42rem] w-[42rem] lg:right-[-6%] lg:top-[4%] lg:h-[48rem] lg:w-[56rem]" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[62%] opacity-85 [mask-image:linear-gradient(to_bottom,black_45%,transparent)] lg:inset-y-0 lg:h-auto lg:[mask-image:linear-gradient(to_right,transparent_8%,black_42%)]"
      >
        {visual}
      </div>

      <div className="shell relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end pb-10 pt-40 md:pb-14 lg:min-h-[min(calc(100svh-var(--header-h)),56rem)] lg:justify-center lg:pt-16">
        <div className="absolute right-3 top-3 z-10 lg:hidden">
          <SensorButton />
        </div>

        <div className="max-w-[52rem]">
          <Badge dot className="text-fg">
            ChatGPT · Claude · Copilot · Gemini
          </Badge>
          <h1 className="display-1 mt-6">
            <span className="block">Licence máte.</span>
            <span className="hl block">Výsledky zatím ne.</span>
          </h1>
          <p className="lead mt-6 max-w-[34rem]">
            Školíme firemní týmy, aby AI používaly na skutečnou práci – podle rolí, na vašich úlohách a s jasnými pravidly
            pro data.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/kontakt" variant="primary">
              Domluvit školení
            </ButtonLink>
            <ButtonLink href="/#demo">Vyzkoušet AI demo</ButtonLink>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4 lg:mt-24">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="mt-1 text-[15px] text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
