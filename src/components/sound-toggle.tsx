"use client";

import { useEffect } from "react";
import { play, setSound, useSound } from "@/lib/sound";
import { SpeakerOff, SpeakerOn } from "./icons";
import { cx } from "./ui";

/** Malý přepínač zvuků (ikona reproduktoru). Výchozí vypnuto. */
export function SoundToggle({ className, withLabel }: { className?: string; withLabel?: boolean }) {
  const on = useSound();
  const label = on ? "Zvuky rozhraní: zapnuto" : "Zvuky rozhraní: vypnuto";
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={withLabel ? undefined : label}
      title={label}
      onClick={() => setSound(!on)}
      className={cx(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[10px] transition-colors duration-200 hover:bg-white/[0.05] hover:text-fg lg:min-h-9 lg:min-w-9",
        on ? "text-fg" : "text-subtle",
        className
      )}
    >
      {on ? <SpeakerOn /> : <SpeakerOff />}
      {withLabel ? <span className="text-[15px]">{on ? "Zvuky zapnuté" : "Zvuky vypnuté"}</span> : null}
    </button>
  );
}

/** Jediný globální posluchač: krátký klik u interaktivních prvků, potvrzení u hlavních CTA. */
export function SoundClicks() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.("a, button, summary, label, input[type='range']");
      if (!el || el.matches("[aria-pressed]") || el.closest("[data-sound='custom']")) return;
      play(el.matches(".btn-primary") ? "confirm" : "click");
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
