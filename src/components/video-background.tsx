"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// vlastní cx: ui.tsx tuto komponentu importuje (PageHero), import zpět by byl kruhový
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Mode = "video" | "poster";
type Conn = { saveData?: boolean; effectiveType?: string };

/** Video se nespustí při reduced motion, Save-Data nebo pomalé síti – pak jen poster. */
function pickMode(): Mode {
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (prefersReducedMotion() || c?.saveData || /(^|-)2g$|^3g$/.test(c?.effectiveType ?? "")) return "poster";
  return "video";
}

/** Až po načtení stránky a v idle → video ani poster nesoupeří s LCP (nadpis). */
function afterIdle(fn: () => void) {
  let id = 0;
  const idle = () => {
    id = window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 2500 }) : window.setTimeout(fn, 1200);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    window.removeEventListener("load", idle);
    if (window.cancelIdleCallback) window.cancelIdleCallback(id);
    window.clearTimeout(id);
  };
}

const overlays = {
  // úvod: text vlevo dole (mobil) / vlevo (desktop)
  hero: "bg-[linear-gradient(to_top,var(--vb-tint)_10%,color-mix(in_srgb,var(--vb-tint)_78%,transparent)_48%,transparent_78%)] lg:bg-[linear-gradient(to_right,var(--vb-tint)_18%,color-mix(in_srgb,var(--vb-tint)_55%,transparent)_48%,transparent_80%),linear-gradient(to_top,var(--vb-tint),transparent_35%)]",
  // hlavička podstránky: text vlevo nahoře přes celou šířku
  page: "bg-[linear-gradient(to_right,var(--vb-tint)_10%,color-mix(in_srgb,var(--vb-tint)_60%,transparent)_55%,transparent),linear-gradient(to_top,var(--vb-tint),transparent_45%)]",
  // CTA karta: text uprostřed
  card: "bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,color-mix(in_srgb,var(--vb-tint)_80%,transparent),transparent)]",
} as const;

/**
 * Smyčkové video na pozadí (public/video, viz scripts/video.sh).
 * SSR vykreslí jen překryv; <video> se vloží až v idle po načtení. Přehrává (play) jen ve viewportu, mimo něj pause –
 * místo atributu autoplay, aby se video mimo obrazovku vůbec nestahovalo.
 * Mobil (< 768 px) dostane výřez na výšku `-m`.
 */
export function VideoBackground({
  src,
  overlay = "page",
  opacity = 0.42,
  className,
}: {
  src: "hero" | "ambient";
  overlay?: keyof typeof overlays;
  opacity?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [file, setFile] = useState<string>(src);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      afterIdle(() => {
        setFile(window.matchMedia("(max-width: 767.98px)").matches ? `${src}-m` : src);
        setMode(pickMode());
      }),
    [src]
  );

  // Přehrávat jen ve viewportu
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const v = video.current;
      if (!v || mode !== "video") return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  // Poster bez videa: zobrazit až po načtení obrázku (plynulý fade, žádné probliknutí)
  useEffect(() => {
    if (mode !== "poster") return;
    const img = new Image();
    img.onload = () => setReady(true);
    img.src = `/video/${file}.webp`;
  }, [mode, file]);

  return (
    <div ref={root} aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden [--vb-tint:var(--bg)]", className)}>
      {mode ? (
        <video
          ref={video}
          key={file}
          muted
          loop
          playsInline
          preload="none"
          poster={`/video/${file}.webp`}
          onPlaying={() => setReady(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: ready ? opacity : 0 }}
        >
          {mode === "video" ? (
            <>
              <source src={`/video/${file}.webm`} type="video/webm" />
              <source src={`/video/${file}.mp4`} type="video/mp4" />
            </>
          ) : null}
        </video>
      ) : null}
      {/* vinětace + gradient z barvy pozadí → text drží kontrast AA */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--vb-tint)_100%)]" />
      <div className={cx("absolute inset-0", overlays[overlay])} />
    </div>
  );
}
