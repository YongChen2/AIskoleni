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
      className="micro-xs min-h-11 border border-line bg-bg px-3 text-fg hover:bg-fg hover:text-bg disabled:text-muted"
    >
      {state === "denied" ? "[ SENZOR ZAMÍTNUT ]" : "[ AKTIVOVAT SENZOR ]"}
    </button>
  );
}
