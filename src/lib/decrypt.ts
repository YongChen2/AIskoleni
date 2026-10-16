"use client";

import type { Engine } from "./motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▓▒░";
const SCRAMBLE = /[\p{L}\p{N}]/u;

type Cell = { el: HTMLSpanElement; final: string; resolveAt: number };

/**
 * Vizuální „dešifrování“ nadpisu. Finální text je v DOM od začátku;
 * během efektu jsou znaky v inline-blocích s pevnou šířkou (bez změny layoutu),
 * po skončení se vrátí původní textové uzly.
 */
export function decrypt(heading: HTMLElement, { gsap }: Engine, duration = 650): () => void {
  if (heading.dataset.decrypted) return () => {};
  heading.dataset.decrypted = "1";
  const label = heading.textContent?.replace(/\s+/g, " ").trim() ?? "";
  heading.setAttribute("aria-label", label);
  // výška zamčená po dobu efektu → okolní obsah se nemůže posunout (CLS 0), i kdyby se uvnitř změnilo zalomení
  const lockedHeight = heading.style.height;
  heading.style.height = `${heading.getBoundingClientRect().height}px`;

  // 1) textové uzly → slova (nowrap) → znaky
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);

  const restore: [Text, HTMLSpanElement][] = [];
  const cells: Cell[] = [];
  for (const t of texts) {
    if (!t.data.trim()) continue;
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    for (const part of t.data.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        wrap.append(part);
        continue;
      }
      const word = document.createElement("span");
      word.style.whiteSpace = "nowrap";
      for (const ch of part) {
        const c = document.createElement("span");
        c.textContent = ch;
        word.append(c);
        if (SCRAMBLE.test(ch)) cells.push({ el: c, final: ch, resolveAt: 0 });
      }
      wrap.append(word);
    }
    t.replaceWith(wrap);
    restore.push([t, wrap]);
  }

  // 2) zafixovat šířky (jedno čtení layoutu, pak zápisy)
  const widths = cells.map((c) => c.el.getBoundingClientRect().width);
  cells.forEach((c, i) => {
    c.el.style.display = "inline-block";
    c.el.style.width = `${widths[i]}px`;
    c.el.style.textAlign = "center";
    c.resolveAt = (i / Math.max(1, cells.length)) * duration * 0.75 + Math.random() * duration * 0.25;
  });

  const start = performance.now();
  let lastSwap = 0;
  const finish = () => {
    gsap.ticker.remove(tick);
    for (const [t, wrap] of restore) wrap.replaceWith(t);
    heading.removeAttribute("aria-label");
    heading.style.height = lockedHeight;
  };
  const tick = () => {
    const now = performance.now() - start;
    const swap = now - lastSwap > 45; // znaky se mění ~22×/s, ne každý snímek
    if (swap) lastSwap = now;
    let pending = 0;
    for (const c of cells) {
      if (now >= c.resolveAt) {
        if (c.el.textContent !== c.final) c.el.textContent = c.final;
      } else {
        pending++;
        if (swap) c.el.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
    }
    if (!pending) finish();
  };
  gsap.ticker.add(tick);
  return finish;
}
