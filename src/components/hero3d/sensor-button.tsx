"use client";

import { useSyncExternalStore } from "react";
import { getSensorState, requestSensor, subscribeSensor } from "./sensor";

/** Tlačítko pro iOS povolení náklonu. Zobrazí se jen když je potřeba. */
export function SensorButton() {
  const state = useSyncExternalStore(subscribeSensor, getSensorState, () => "off" as const);
  if (state !== "needs-permission" && state !== "denied") return null;
  return (
    <button
      type="button"
      onClick={() => void requestSensor()}
      disabled={state === "denied"}
      className="btn btn-ghost btn-sm min-h-11 gap-2 text-[13px] disabled:opacity-60"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      {state === "denied" ? "Náklon zamítnut" : "Ovládat náklonem"}
    </button>
  );
}
