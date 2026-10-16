import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Marquee } from "@/components/fx/marquee";

const assistants = ["ChatGPT", "Claude", "Microsoft Copilot", "Gemini", "Grok", "Perplexity", "Mistral Le Chat", "Meta AI"];
const tools = ["Notion AI", "DeepL", "Canva AI", "GitHub Copilot", "Zapier AI", "Fireflies", "Gamma", "ElevenLabs"];

/** Běžící pás nástrojů – čistá typografie bez log, na přechodu z tmavého hera do světlé části. */
export function ToolsMarquee() {
  return (
    <section data-theme="light" data-band="" aria-labelledby="nastroje-pas" className="relative overflow-hidden pb-4 pt-16 md:pt-24">
      <h2 id="nastroje-pas" className="sr-only">
        Nástroje, se kterými pracujeme
      </h2>
      <p className="sr-only">{[...assistants, ...tools].join(", ")}</p>
      <div className="space-y-3 text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold tracking-[-0.035em] text-fg md:space-y-4">
        <Marquee items={assistants} seconds={46} />
        <div className="text-subtle">
          <Marquee items={tools} reverse seconds={54} />
        </div>
      </div>
      <div className="shell mt-8 flex justify-end">
        <Link href="/nastroje" className="btn btn-ghost -mr-3 text-[14px]">
          Srovnání nástrojů pro firmy <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
