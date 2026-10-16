"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiché mechanické UI zvuky přes Web Audio API (bez souborů).
 * Výchozí VYPNUTO, volba v localStorage. AudioContext vzniká až po interakci uživatele
 * a zvuk nikdy nehraje bez předchozí interakce.
 */

type Kind = "click" | "confirm" | "error" | "boot";

const KEY = "ui-sound";
let enabled = false;
let loaded = false;
let interacted = false;
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    enabled = localStorage.getItem(KEY) === "on";
  } catch {}
  const mark = () => (interacted = true);
  window.addEventListener("pointerdown", mark, { capture: true, once: true });
  window.addEventListener("keydown", mark, { capture: true, once: true });
}

export function setSound(on: boolean) {
  enabled = on;
  interacted = true; // přepnutí je samo interakce
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((l) => l());
  if (on) play("confirm");
}

export function useSound() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      cb();
      return () => listeners.delete(cb);
    },
    () => enabled,
    () => false
  );
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(a: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, vol = 0.04) {
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(a.destination);
  o.start(start);
  o.stop(start + dur + 0.01);
}

export function play(kind: Kind) {
  load();
  if (!enabled || !interacted) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.005;
  switch (kind) {
    case "click":
      blip(a, 1800, t, 0.025, "square", 0.025);
      break;
    case "confirm":
      blip(a, 880, t, 0.05, "square", 0.03);
      blip(a, 1320, t + 0.06, 0.07, "square", 0.03);
      break;
    case "error":
      blip(a, 220, t, 0.09, "sawtooth", 0.03);
      break;
    case "boot":
      blip(a, 660, t, 0.06, "sine", 0.05);
      blip(a, 990, t + 0.08, 0.1, "sine", 0.05);
      break;
  }
}
