"use client";

import { useEffect } from "react";
import { play, setSound, useSound } from "@/lib/sound";
import { cx } from "./ui";

/** Přepínač [ SOUND: OFF ] + globální klikací zvuk pro tlačítka a odkazy. */
export function SoundToggle({ className }: { className?: string }) {
  const on = useSound();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setSound(!on)}
      className={cx("micro-xs hover:text-fg", on ? "text-accent" : "text-muted", className)}
    >
      [ SOUND: {on ? "ON" : "OFF"} ]
    </button>
  );
}

/** Jediný globální posluchač: krátký klik u interaktivních prvků, potvrzení u hlavních CTA. */
export function SoundClicks() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.("a, button, summary, label, input[type='range']");
      if (!el || el.matches("[aria-pressed]") || el.closest("[data-sound='custom']")) return;
      play(el.matches(".btn-accent") ? "confirm" : "click");
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
