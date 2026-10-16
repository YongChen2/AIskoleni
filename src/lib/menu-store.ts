"use client";

import { useSyncExternalStore } from "react";

/** Sdílený stav mobilního menu (hlavička + spodní lišta). */
let open = false;
const listeners = new Set<() => void>();

export function setMenuOpen(v: boolean) {
  if (open === v) return;
  open = v;
  listeners.forEach((l) => l());
}

export function useMenuOpen() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false
  );
}
