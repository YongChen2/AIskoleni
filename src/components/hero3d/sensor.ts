"use client";

/**
 * Náklon telefonu → vstup pro 3D síť.
 * iOS vyžaduje povolení (DeviceOrientationEvent.requestPermission) → tlačítko v heru.
 * Android povolení nepotřebuje → posloucháme rovnou.
 */

type State = "off" | "needs-permission" | "on" | "denied";
type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export const tilt = { x: 0, y: 0, active: false };

let state: State = "off";
const listeners = new Set<(s: State) => void>();

function set(s: State) {
  state = s;
  listeners.forEach((f) => f(s));
}

export const getSensorState = () => state;
export function subscribeSensor(fn: (s: State) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function onOrientation(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;
  // telefon držený zhruba v 45° → neutrální poloha
  tilt.x = Math.max(-1, Math.min(1, e.gamma / 35));
  tilt.y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
  tilt.active = true;
}

function listen() {
  window.addEventListener("deviceorientation", onOrientation, { passive: true });
  set("on");
}

/** Zavolá 3D vrstva na mobilu po načtení. */
export function initSensor() {
  if (state !== "off" || typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return;
  const DOE = window.DeviceOrientationEvent as IOSOrientation;
  if (typeof DOE.requestPermission === "function") set("needs-permission");
  else listen();
}

/** Klik na [ AKTIVOVAT SENZOR ] (musí být přímo z uživatelské akce). */
export async function requestSensor() {
  const DOE = window.DeviceOrientationEvent as IOSOrientation;
  try {
    const res = await DOE.requestPermission?.();
    if (res === "granted") listen();
    else set("denied");
  } catch {
    set("denied");
  }
}

export function stopSensor() {
  window.removeEventListener("deviceorientation", onOrientation);
  tilt.active = false;
  if (state === "on") set("off");
}
