"use client";

/** Krátká haptická odezva. iOS Safari Vibration API nepodporuje → tiše nic. */
export function haptic(pattern: number | number[] = 12) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") navigator.vibrate(pattern);
  } catch {}
}
