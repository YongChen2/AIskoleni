"use client";

/**
 * Efekty, které mění text v obsahu (dešifrování), nesmí běžet před hydratací daného prvku –
 * React by našel jiný text a podstrom překreslil (chyba #418). Obsah stránky se hydratuje
 * po částech (streaming / Suspense), proto se kontroluje přímo konkrétní prvek.
 */

/** Po načtení stránky a v klidu (hydratace hlavního obsahu už proběhla nebo dobíhá). */
export function afterLoadIdle(): Promise<void> {
  return new Promise((resolve) => {
    const idle = () =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(() => resolve(), { timeout: 1000 }) : setTimeout(resolve, 50);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

/** React připojí ke každému hydratovanému DOM prvku interní fiber klíč. */
export const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));

/** Spustí `fn`, až bude prvek hydratovaný (max ~3 s, pak efekt vynechá). */
export function whenHydrated(el: Element, fn: () => void, tries = 15) {
  if (isHydrated(el)) fn();
  else if (tries > 0) setTimeout(() => whenHydrated(el, fn, tries - 1), 200);
}
